function Random-Number {
    param (
        [int]$First,
        [int]$Second
    )
    $RandomNumber = $First + (Get-Random -Minimum 0 -Maximum $Second)
    return $RandomNumber
}

function Get-TicketId {
    $MovieId = (Invoke-RestMethod -Uri "http://localhost:5000/api/movie/random" -Headers @{traceparent=$Global:TRACE_PARENT}).movieId
    $Tickets = Invoke-RestMethod -Uri "http://localhost:5000/api/ticket/$MovieId" -Headers @{traceparent=$Global:TRACE_PARENT}
    $RandomTicket = Random-Number 0 $Tickets.Count
    $TicketId = $Tickets[$RandomTicket].ticketId
    return $TicketId
}

Set-Location -Path "backend/auth-service"
mvn clean install -DskipTests
Set-Location -Path ../..

Set-Location -Path "backend/cinema-service"
mvn clean install -DskipTests
Set-Location -Path ../..

Set-Location -Path "backend/notification-service"
mvn clean install -DskipTests
Set-Location -Path ../..

./otel.ps1

$VERSION = "00"
$TRACE_ID = -join (1..8 | ForEach-Object { "{0:x2}" -f (Get-Random -Minimum 0 -Maximum 255) })
$PARENT_ID = -join (1..4 | ForEach-Object { "{0:x2}" -f (Get-Random -Minimum 0 -Maximum 255) })
$FLAGS = "01"

$Global:TRACE_PARENT = "$VERSION-$TRACE_ID-$PARENT_ID-$FLAGS"

docker-compose up -d

do {
    Write-Host "Waiting for the application to be ready..."
    Start-Sleep -Seconds 1
} while (-not (Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get -ErrorAction SilentlyContinue) -match 'OK')

Write-Host "Application is ready! Starting the test..."
Start-Sleep -Seconds 10

$Global:AUTH_TOKEN = $null
$Global:MOVIE_ID = $null
$Global:TICKETS = $null
$Global:RANDOM_TICKET = $null
$Global:TICKET_ID = $null
$Global:AUTH_TOKEN = (Invoke-RestMethod -Uri "http://localhost:5000/api/account/login" -Method Post -Body '{"username": "admin", "password": "admin0xCODE"}' -ContentType "application/json" -Headers @{traceparent=$Global:TRACE_PARENT}).token

$COUNTER = 0
while ($null -eq $Global:AUTH_TOKEN) {
    Write-Host "Authentication failed. Retrying..."
    $Global:AUTH_TOKEN = (Invoke-RestMethod -Uri "http://localhost:5000/api/account/login" -Method Post -Body '{"username": "admin", "password": "admin0xCODE"}' -ContentType "application/json" -Headers @{traceparent=$Global:TRACE_PARENT}).token
    $COUNTER++
    if ($COUNTER -eq 5) {
        Write-Host "Failed to authenticate after 5 attempts. Exiting..."
        exit 1
    }
}

$COUNTER = 0
$Global:TICKET_ID = Get-TicketId
while ($null -eq $Global:TICKET_ID) {
    Write-Host "Ticket not found. Retrying..."
    $Global:TICKET_ID = Get-TicketId
    $COUNTER++
    if ($COUNTER -eq 5) {
        Write-Host "Failed to get ticket after 5 attempts. Exiting..."
        exit 1
    }
}

Start-Sleep -Seconds 5

Invoke-RestMethod -Uri "http://localhost:5000/api/ticket/reserve" -Method Post -Headers @{
    Authorization = "Bearer $Global:AUTH_TOKEN"
    traceparent = $Global:TRACE_PARENT
} -Body (@{
    ticketId = $Global:TICKET_ID
    seatCodes = @("A01")
    paymentInfo = @{
        cardNumber = "5555555555554444"
        cardName = "Nguyen Van A"
        expiryDate = "12/25"
        cvv = "123"
        billingAddress = "123 Nguyen Van A"
        couponCode = "P6BB6GCU"
    }
} | ConvertTo-Json) -ContentType "application/json"

Start-Sleep -Seconds 20
Write-Host "Test completed!"
Write-Host "View the results of the Trace Id: $TRACE_ID"
