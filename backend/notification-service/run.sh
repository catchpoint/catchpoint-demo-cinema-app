echo "Using OpenTelemetry"
java -Xms786m -Xmx786m -javaagent:otel-agent.jar -Dotel.javaagent.configuration-file=config-otel.properties -jar ./notification-service.jar
