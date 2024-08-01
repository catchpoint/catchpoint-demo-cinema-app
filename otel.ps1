Invoke-WebRequest -Uri "https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar" -OutFile "opentelemetry-javaagent.jar"
Copy-Item -Path "opentelemetry-javaagent.jar" -Destination "./backend/auth-service/otel-trace/otel-agent.jar"
Copy-Item -Path "opentelemetry-javaagent.jar" -Destination "./backend/cinema-service/otel-trace/otel-agent.jar"
Copy-Item -Path "opentelemetry-javaagent.jar" -Destination "./backend/notification-service/otel-trace/otel-agent.jar"
Remove-Item -Path "opentelemetry-javaagent.jar"