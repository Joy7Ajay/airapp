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
    # User table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    # Notification table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            type TEXT NOT NULL,
            message TEXT NOT NULL,
            read INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    # UserPreference table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS user_preferences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            key TEXT NOT NULL,
            value TEXT,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    # UploadedFile table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS uploaded_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            user_id INTEGER,
            upload_time TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    # ReportRequest table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS report_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            params TEXT NOT NULL,
            status TEXT NOT NULL,
            result_path TEXT,
            created_at TEXT NOT NULL,
            completed_at TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    conn.commit()
    conn.close()

# User functions

def insert_user(email, password_hash):
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)',
        (email, password_hash, datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()

def get_user_by_email(email):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    return user

def get_user_by_id(user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    return user

# Notification functions

def insert_notification(user_id, type, message):
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO notifications (user_id, type, message, read, created_at) VALUES (?, ?, ?, 0, ?)',
        (user_id, type, message, datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()

def get_notifications(user_id, unread_only=False):
    conn = get_db_connection()
    if unread_only:
        notifs = conn.execute('SELECT * FROM notifications WHERE user_id = ? AND read = 0 ORDER BY created_at DESC', (user_id,)).fetchall()
    else:
        notifs = conn.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', (user_id,)).fetchall()
    conn.close()
    return notifs

def mark_notification_read(notification_id):
    conn = get_db_connection()
    conn.execute('UPDATE notifications SET read = 1 WHERE id = ?', (notification_id,))
    conn.commit()
    conn.close()

def mark_all_notifications_read(user_id):
    conn = get_db_connection()
    conn.execute('UPDATE notifications SET read = 1 WHERE user_id = ?', (user_id,))
    conn.commit()
    conn.close()

# UserPreference functions

def set_user_preference(user_id, key, value):
    conn = get_db_connection()
    now = datetime.utcnow().isoformat()
    existing = conn.execute('SELECT * FROM user_preferences WHERE user_id = ? AND key = ?', (user_id, key)).fetchone()
    if existing:
        conn.execute('UPDATE user_preferences SET value = ?, updated_at = ? WHERE user_id = ? AND key = ?', (value, now, user_id, key))
    else:
        conn.execute('INSERT INTO user_preferences (user_id, key, value, updated_at) VALUES (?, ?, ?, ?)', (user_id, key, value, now))
    conn.commit()
    conn.close()

def get_user_preferences(user_id):
    conn = get_db_connection()
    prefs = conn.execute('SELECT key, value FROM user_preferences WHERE user_id = ?', (user_id,)).fetchall()
    conn.close()
    return {row['key']: row['value'] for row in prefs}

# UploadedFile functions (already present, can extend as needed)
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

# ReportRequest functions
def insert_report_request(user_id, params, status='pending', result_path=None):
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO report_requests (user_id, params, status, result_path, created_at) VALUES (?, ?, ?, ?, ?)',
        (user_id, params, status, result_path, datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()

def update_report_request_status(report_id, status, result_path=None):
    conn = get_db_connection()
    if result_path:
        conn.execute('UPDATE report_requests SET status = ?, result_path = ?, completed_at = ? WHERE id = ?', (status, result_path, datetime.utcnow().isoformat(), report_id))
    else:
        conn.execute('UPDATE report_requests SET status = ?, completed_at = ? WHERE id = ?', (status, datetime.utcnow().isoformat(), report_id))
    conn.commit()
    conn.close()

def get_report_requests(user_id):
    conn = get_db_connection()
    reports = conn.execute('SELECT * FROM report_requests WHERE user_id = ? ORDER BY created_at DESC', (user_id,)).fetchall()
    conn.close()
    return reports