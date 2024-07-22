FROM eclipse-temurin:17-jdk-focal

COPY ./target/notification-service.jar /app/notification-service.jar
COPY ./cp-trace/ /app/
COPY ./otel-trace/ /app/
COPY ./run.sh /app/run.sh


WORKDIR /app

CMD ["bash", "run.sh"]