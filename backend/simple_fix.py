#!/usr/bin/env python3
"""
Simple database fix script.
"""

import os
import sqlite3
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'app.db')

def fix_database():
    print("🔧 Fixing database...")
    
    # Delete old database
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print("🗑️ Removed old database")
    
    # Create new database
    conn = sqlite3.connect(DB_PATH)
    
    # Create tables directly with connection
    conn.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            created_at TEXT NOT NULL
        )
    ''')
    
    conn.execute('''
        CREATE TABLE notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            type TEXT NOT NULL,
            message TEXT NOT NULL,
            read INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    
    conn.execute('''
        CREATE TABLE passenger_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            airline TEXT NOT NULL,
            destination TEXT NOT NULL,
            passengers INTEGER NOT NULL,
            revenue REAL NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()
    
    print("✅ Database fixed!")
    return True

def test_user_creation():
    print("🧪 Testing user creation...")
    
    from database import insert_user, get_user_by_email
    
    try:
        # Create a test user
        insert_user("test@example.com", "password123", "Test", "User")
        print("✅ User created successfully!")
        
        # Get the user back
        user = get_user_by_email("test@example.com")
        if user:
            print(f"✅ Found user: {user['email']}")
            return True
        else:
            print("❌ Could not find user")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Simple Database Fix")
    print("=" * 25)
    
    if fix_database():
        if test_user_creation():
            print("🎉 Database is working!")
        else:
            print("❌ Still having issues")
    else:
        print("❌ Failed to fix database") 