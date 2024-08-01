@echo off
set /p username=Enter username: 
set /p password=Enter password: 

echo Creating database and tables...
mysql -u %username% -p%password% < ./sql/create.sql

echo Creating trigger...
mysql -u %username% -p%password% < ./sql/triggers.sql

echo Creating views...
mysql -u %username% -p%password% < ./sql/views.sql

echo Creating procedures...
mysql -u %username% -p%password% < ./sql/procedures.sql

set insert_directory=./sql/inserts
for %%F in (%insert_directory%\*.sql) do (
    echo Inserting data from %%F...
    mysql -u %username% -p%password% < %%F
)

echo Database created successfully
