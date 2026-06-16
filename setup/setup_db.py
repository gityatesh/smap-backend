#connects to the postgresql through docker and insert the data inside the database

import psycopg2
import os

def initialize_database():
    print("Connecting to PostgreSQL Container on port 5432...")
    try:
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="stockmarket_db",
            user="postgres",
            password="Yatesh1234?"
        )
        cursor = conn.cursor()

        print("Executing create_tables.sql...")
        with open('sql/create_tables.sql', 'r') as file:
            cursor.execute(file.read())
            
        print("Executing insert_data.sql...")
        with open('sql/insert_data.sql', 'r') as file:
            cursor.execute(file.read())
            
        conn.commit()
        print("Success! all records injected.")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    initialize_database()