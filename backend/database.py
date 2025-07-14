import os
import sqlite3
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'app.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS uploaded_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            user_id INTEGER,
            upload_time TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def insert_uploaded_file(filename, user_id=None):
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO uploaded_files (filename, user_id, upload_time) VALUES (?, ?, ?)',
        (filename, user_id, datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()

def get_uploaded_files(user_id=None):
    conn = get_db_connection()
    if user_id:
        files = conn.execute('SELECT * FROM uploaded_files WHERE user_id = ?', (user_id,)).fetchall()
    else:
        files = conn.execute('SELECT * FROM uploaded_files').fetchall()
    conn.close()
    return files

def insert_passenger_record(record):
    """
    Placeholder function to simulate inserting a passenger record into the database.
    In a real application, this would write to a SQL database, NoSQL database, or other data store.
    """
    print(f"Inserting record into database: {record}")
    # In a real implementation, you would have database connection logic here.
    # For example:
    # connection = create_db_connection()
    # cursor = connection.cursor()
    # cursor.execute("INSERT INTO passenger_data (...) VALUES (...)", (record['timestamp'], ...))
    # connection.commit()
    # cursor.close()
    # connection.close()
    pass