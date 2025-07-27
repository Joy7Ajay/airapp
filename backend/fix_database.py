#!/usr/bin/env python3
"""
Script to check and fix database schema issues.
"""

import os
import sqlite3
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'app.db')

def check_database():
    print("🔍 Checking database structure...")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if users table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
    if not cursor.fetchone():
        print("❌ Users table doesn't exist!")
        return False
    
    # Check users table structure
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    print("📋 Users table columns:")
    for col in columns:
        print(f"  - {col[1]} ({col[2]})")
    
    # Check if email column exists
    email_exists = any(col[1] == 'email' for col in columns)
    if not email_exists:
        print("❌ Email column missing!")
        return False
    
    print("✅ Database structure looks good!")
    return True

def recreate_database():
    print("🔄 Recreating database...")
    
    # Backup old database
    if os.path.exists(DB_PATH):
        backup_path = DB_PATH + '.backup'
        os.rename(DB_PATH, backup_path)
        print(f"📦 Backed up old database to {backup_path}")
    
    # Create new database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            created_at TEXT NOT NULL
        )
    ''')
    
    # Create other tables
    cursor.execute('''
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
    
    cursor.execute('''
        CREATE TABLE user_preferences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            key TEXT NOT NULL,
            value TEXT,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE uploaded_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            user_id INTEGER,
            upload_time TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE report_requests (
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
    
    cursor.execute('''
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
    
    print("✅ Database recreated successfully!")
    return True

def test_database():
    print("🧪 Testing database functions...")
    
    from database import insert_user, get_user_by_email
    
    try:
        # Test inserting a user
        insert_user("test@example.com", "hashed_password", "Test", "User")
        print("✅ User insertion works!")
        
        # Test getting user by email
        user = get_user_by_email("test@example.com")
        if user:
            print("✅ User retrieval works!")
            print(f"   Found user: {user['email']}")
        else:
            print("❌ User retrieval failed!")
            return False
            
        return True
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Database Fix Script")
    print("=" * 30)
    
    if check_database():
        print("✅ Database structure is correct!")
        if test_database():
            print("🎉 Everything is working!")
        else:
            print("⚠️ Database functions have issues")
    else:
        print("❌ Database structure has issues!")
        print("🔄 Recreating database...")
        if recreate_database():
            if test_database():
                print("🎉 Database fixed and working!")
            else:
                print("❌ Still having issues after recreation")
        else:
            print("❌ Failed to recreate database") 