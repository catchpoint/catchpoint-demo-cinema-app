if grep -q "otel" <<< "$TRACING_PROFILE"; then
    echo "Using OpenTelemetry"
    java -Xms786m -Xmx786m -javaagent:otel-agent.jar -Dotel.javaagent.configuration-file=config-$TRACING_PROFILE.properties -jar ./cinema-service.jar
else
    echo "Using Catchpoint"
    cp catchpoint-config-$TRACING_PROFILE.yml catchpoint-config.yml
    java -Xms786m -Xmx786m -javaagent:cp-trace-agent.jar -jar ./cinema-service.jar
    rm catchpoint-config.yml
fi