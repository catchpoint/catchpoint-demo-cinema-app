FROM eclipse-temurin:17-jdk-focal

COPY ./target/cinema-service.jar /app/cinema-service.jar
COPY ./static /app/static
COPY ./cp-trace/ /app/
COPY ./otel-trace/ /app/
COPY ./run.sh /app/run.sh

WORKDIR /app

CMD ["bash", "run.sh"]