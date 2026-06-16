#used to get connection from postgresql
import psycopg2
from psycopg2.extras import RealDictCursor

class DatabaseConnector:
    """Handles PostgreSQL connection and query execution."""
    
    def get_connection(self):
        return psycopg2.connect(
            host="localhost",
            port="5432",
            database="stockmarket_db",
            user="postgres",
            password="Yatesh1234?"
        )

    def execute_read_query(self, query: str, params: tuple = None):
        #we use tuple so that no one can use maulicius queries
        """Executes a SELECT query and returns rows as dictionaries."""
        conn = self.get_connection()
        if not conn: 
            return []
            
        try:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            # We pass params separately to prevent SQL Injection attacks
            cursor.execute(query, params)
            return cursor.fetchall()
        except Exception as e:
            print(f"Database Query Error: {e}")
            return []
        finally:
            cursor.close()
            conn.close()