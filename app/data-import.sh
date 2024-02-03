#!/bin/bash

# Can be any target database
TARGET_DB_HOST="localhost" 
TARGET_DB_PORT="15432" 
TARGET_DB_NAME="spacedb"
TARGET_DB_USER="postgres"
TARGET_DB_PASSWORD="password"

# File that contains the exported data
EXPORT_FILE="data-export.sql"

echo "Importing data to Target Database..."

# Import data into Target Database
PGPASSWORD=$TARGET_DB_PASSWORD psql -h $TARGET_DB_HOST -p $TARGET_DB_PORT -U $TARGET_DB_USER -d $TARGET_DB_NAME < $EXPORT_FILE

# Check if the import was successful
if [ $? -eq 0 ]; then
    echo "Data import successful."
else
    echo "Data import failed."
fi
