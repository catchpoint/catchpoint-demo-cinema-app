package com.sqlcinema.backend.common;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sqlcinema.backend.model.Log;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class LogFileProcessor {
    private final File path;
    private final ObjectMapper mapper;

    public LogFileProcessor(String path, ObjectMapper mapper) throws FileNotFoundException {
        this.mapper = mapper;
        this.path = new File(path);

        createFileIfNotExists();
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
    }

    public List<Log> readAllLogs() throws FileNotFoundException {
        InputStreamReader reader = new InputStreamReader(new FileInputStream(path));
        try {
            return mapper.readValue(reader, mapper.getTypeFactory().constructCollectionType(List.class, Log.class));
        } catch (IOException ignored) {
        }
        return new ArrayList<>();
    }

    public void addLog(Log log) {
        List<Log> logs = null;
        try {
            logs = readAllLogs();
        } catch (FileNotFoundException e) {
            logs = new ArrayList<>();
        }

        Log existing = logs.stream()
                .filter(l -> l.getSql().equals(log.getSql()))
                .findFirst()
                .orElse(null);
        
        if (existing != null) {
            existing.setCount(existing.getCount() + 1);
        } else {
            logs.add(log);
        }
        
        try {
            write(mapper.writeValueAsString(logs));
        } catch (JsonProcessingException e) {
        }
    }

    public void clearLogs() {
        write("[]");
    }


    private void createFileIfNotExists() {
        if (!this.path.exists()) {
            try {
                this.path.createNewFile();
                write("[]");
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void write(String data) {
        OutputStreamWriter writer;
        try {
            writer = new OutputStreamWriter(new FileOutputStream(path));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }

        try {
            writer.write(data);
            writer.write("\n");
            writer.close();
        } catch (IOException ignored) {
        }
    }

}