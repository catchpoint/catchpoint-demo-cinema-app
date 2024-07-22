FROM eclipse-temurin:17-jdk-focal

COPY ./target/auth-service.jar /app/auth-service.jar
COPY ./cp-trace/ /app/
COPY ./otel-trace/ /app/
COPY ./run.sh /app/run.sh


WORKDIR /app

CMD ["bash", "run.sh"]