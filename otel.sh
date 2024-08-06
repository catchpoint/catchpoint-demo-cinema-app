#!/bin/bash
curl -L -O https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar
cp opentelemetry-javaagent.jar ./backend/auth-service/otel-trace/otel-agent.jar
cp opentelemetry-javaagent.jar ./backend/notification-service/otel-trace/otel-agent.jar
cp opentelemetry-javaagent.jar ./backend/cinema-service/otel-trace/otel-agent.jar
rm opentelemetry-javaagent.jar