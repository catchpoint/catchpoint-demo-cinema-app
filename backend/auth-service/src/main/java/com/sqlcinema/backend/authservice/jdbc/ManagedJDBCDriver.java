package com.sqlcinema.backend.authservice.jdbc;

import java.sql.*;
import java.util.Properties;
import java.util.logging.Logger;

/**
 * @author mehmetyildiz
 */
public class ManagedJDBCDriver implements Driver {

    private final com.mysql.cj.jdbc.Driver driver;

    public ManagedJDBCDriver() throws SQLException {
        DriverManager.registerDriver(this);
        this.driver = new com.mysql.cj.jdbc.Driver();
    }

    @Override
    public Connection connect(String url, Properties info) throws SQLException {
        return new ManagedConnection(driver.connect(url, info));
    }

    @Override
    public boolean acceptsURL(String url) throws SQLException {
        return driver.acceptsURL(url);
    }

    @Override
    public DriverPropertyInfo[] getPropertyInfo(String url, Properties info) throws SQLException {
        return driver.getPropertyInfo(url, info);
    }

    @Override
    public int getMajorVersion() {
        return driver.getMajorVersion();
    }

    @Override
    public int getMinorVersion() {
        return driver.getMinorVersion();
    }

    @Override
    public boolean jdbcCompliant() {
        return driver.jdbcCompliant();
    }

    @Override
    public Logger getParentLogger() throws SQLFeatureNotSupportedException {
        return driver.getParentLogger();
    }
}