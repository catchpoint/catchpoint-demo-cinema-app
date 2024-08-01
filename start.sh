#!/bin/bash
random_number () {
    FIRST=$1
    SECOND=$2
    echo $((FIRST + RANDOM % SECOND))
}

get_ticket_id() {
    MOVIE_ID=$(curl -s -XGET http://localhost:5000/api/movie/random -H "traceparent: $TRACE_PARENT" | jq -r '.movieId')
    TICKETS=$(curl -s -XGET http://localhost:5000/api/ticket/${MOVIE_ID} -H "traceparent: $TRACE_PARENT")
    RANDOM_TICKET=$(random_number 0 $(echo $TICKETS | jq '.[] | length'))
    TICKET_ID=$(echo $TICKETS | jq -r ".[$RANDOM_TICKET].ticketId")
    echo $TICKET_ID
}

pushd backend/auth-service
mvn clean install -DskipTests
popd

pushd backend/cinema-service
mvn clean install -DskipTests
popd

pushd backend/notification-service
mvn clean install -DskipTests
popd

./otel.sh

VERSION=00
TRACE_ID=$(head -c 16 /dev/urandom | od -An -t x | tr -d ' ')
PARENT_ID=$(head -c 8 /dev/urandom | od -An -t x | tr -d ' ')
FLAGS=01

TRACE_PARENT=$VERSION-$TRACE_ID-$PARENT_ID-$FLAGS

docker-compose up -d

while ! curl -s http://localhost:5000/health | grep -q 'OK'; do
    echo "Waiting for the application to be ready..."
    sleep 1
done

echo "Application is ready! Starting the test..."
sleep 10

unset AUTH_TOKEN
unset MOVIE_ID
unset TICKETS
unset RANDOM_TICKET
unset TICKET_ID
AUTH_TOKEN=$(curl -s -XPOST http://localhost:5000/api/account/login -d '{"username": "admin", "password": "admin0xCODE"}' -H 'Content-Type: application/json' -H "traceparent: $TRACE_PARENT" | jq -r '.token')

COUNTER=0
while [ "$AUTH_TOKEN" == null ]; do
    echo "Authentication failed. Retrying..."
    AUTH_TOKEN=$(curl -s -XPOST http://localhost:5000/api/account/login -d '{"username": "admin", "password": "admin0xCODE"}' -H 'Content-Type: application/json' -H "traceparent: $TRACE_PARENT" | jq -r '.token')
    COUNTER=$((COUNTER+1))
    if [ $COUNTER -eq 5 ]; then
        echo "Failed to authenticate after 5 attempts. Exiting..."
        exit 1
    fi
done

COUNTER=0
TICKET_ID=$(get_ticket_id)
while [ "$TICKET_ID" == null ]; do
    echo "Ticket not found. Retrying..."
    TICKET_ID=$(get_ticket_id)
    COUNTER=$((COUNTER+1))
    
    if [ $COUNTER -eq 5 ]; then
        echo "Failed to get ticket after 5 attempts. Exiting..."
        exit 1
    fi
done
sleep 5
curl -s -XPOST http://localhost:5000/api/ticket/reserve -H "Authorization: Bearer $AUTH_TOKEN" -H "traceparent: $TRACE_PARENT" -d "{\"ticketId\": ${TICKET_ID}, \"seatCodes\": [\"A01\"], \"paymentInfo\": {\"cardNumber\": \"5555555555554444\", \"cardName\": \"Nguyen Van A\", \"expiryDate\": \"12/25\", \"cvv\": \"123\", \"billingAddress\": \"123 Nguyen Van A\", \"couponCode\": \"P6BB6GCU\"}}" -H 'Content-Type: application/json'

sleep 20
echo "Test completed!"
echo "View the results of the Trace Id: $TRACE_ID"