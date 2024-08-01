#!/bin/bash
username=$1
password=$2

if [ -z "$username" ]
then
  read -r -p "Enter username: " username
fi

if [ -z "$password" ]
then
  read -r -sp "Enter password: " password
fi

echo "Creating database and tables..."
mysql "$username" -p"$password" < ./sql/create.sql

echo "Creating triggerr..."
mysql "$username" -p"$password" < ./sql/triggers.sql

echo "Creating views..."
mysql "$username" -p"$password" < ./sql/views.sql

echo "Creating procedures..."
mysql "$username" -p"$password" < ./sql/procedures.sql


insert_directory="./sql/inserts"
for file in $insert_directory/*.sql
do
    echo "Inserting data from $file..."
    mysql "$username" -p"$password" < "$file"
done


echo "Database created successfully"