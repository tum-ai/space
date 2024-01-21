#!/bin/bash

# Configuration
DB_HOST="db.hostname.supabase.co"
DB_USER="your_db_user"
DB_NAME="your_db_name"
#TABLE_NAME= #"your_table_name"
EXPORT_FILE="data-export.sql"

# Prompt for password (for security reasons, it's better not to hardcode it)
echo "Enter password for $DB_USER at $DB_HOST:"
read -s DB_PASSWORD

# Run pg_dump command
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $EXPORT_FILE

# Check if the pg_dump was successful
if [ $? -eq 0 ]; then
    echo "Data export successful. File created: $EXPORT_FILE"
else
    echo "Data export failed."
fi
