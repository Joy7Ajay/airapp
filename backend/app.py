from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager, verify_jwt_in_request_optional
from werkzeug.security import generate_password_hash, check_password_hash
from ml_service import predict_passengers
from anomaly_detection import detect_anomalies
from nlp_insights import generate_insights
from computer_vision import PassengerCounter
from data_importer import import_from_external
from database import (
    insert_passenger_record, insert_uploaded_file, init_db,
    insert_notification, get_notifications, mark_notification_read, mark_all_notifications_read,
    set_user_preference, get_user_preferences, insert_report_request, update_report_request_status, get_report_requests,
    get_user_by_email, get_user_by_id
)
from werkzeug.utils import secure_filename
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
import json
from datetime import datetime
import time
logging.basicConfig(level=logging.INFO)

load_dotenv()

app = Flask(__name__)

# Initialize Database
init_db()

# Secret key for JWT
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY')
jwt = JWTManager(app)

# Initialize Passenger Counter
passenger_counter = PassengerCounter()

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Email utility
EMAIL_FROM = os.environ.get('EMAIL_FROM', 'noreply@example.com')
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.example.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USER = os.environ.get('EMAIL_USER', '')
EMAIL_PASS = os.environ.get('EMAIL_PASS', '')

# In-memory store for failed login attempts and lockout
FAILED_LOGINS = {}
LOCKOUTS = {}
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION = 300  # 5 minutes in seconds

def send_email_notification(to_email, subject, message):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_FROM
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(message, 'plain'))
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        if EMAIL_USER and EMAIL_PASS:
            server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_FROM, to_email, msg.as_string())
        server.quit()
        logging.info(f"Email sent to {to_email}: {subject}")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if get_user_by_email(username): # Changed from get_user_by_username to get_user_by_email
        return jsonify({"error": "Username already exists"}), 400

    hashed_password = generate_password_hash(password)
    insert_user(username, hashed_password) # This line was not in the new_code, but should be changed for consistency

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        user = get_user_by_email(username)
        user_id = user['id'] if user else None
        now = time()
        # Check lockout
        if user_id in LOCKOUTS and now < LOCKOUTS[user_id]:
            logging.warning(f"User {username} is locked out from login.")
            if user and user['email']:
                send_email_notification(user['email'], 'Login Attempt Blocked', 'Your account is temporarily locked due to too many failed login attempts.')
            if user_id:
                insert_notification(user_id, 'login', 'Account locked due to too many failed login attempts.')
            return jsonify({'error': 'Account locked. Try again later.'}), 403
        # Check credentials
        if user and check_password_hash(user['password_hash'], password):
            # Reset failed attempts
            FAILED_LOGINS[user_id] = 0
            LOCKOUTS.pop(user_id, None)
            access_token = create_access_token(identity=user['id'])
            logging.info(f"User {username} logged in successfully.")
            if user['email']:
                send_email_notification(user['email'], 'Login Successful', 'You have successfully logged in.')
            insert_notification(user_id, 'login', 'Login successful.')
            return jsonify({'access_token': access_token, 'user_id': user['id']})
        else:
            # Failed login
            if user_id:
                FAILED_LOGINS[user_id] = FAILED_LOGINS.get(user_id, 0) + 1
                if FAILED_LOGINS[user_id] >= MAX_FAILED_ATTEMPTS:
                    LOCKOUTS[user_id] = now + LOCKOUT_DURATION
                    logging.warning(f"User {username} locked out after too many failed attempts.")
                    insert_notification(user_id, 'login', 'Account locked due to too many failed login attempts.')
                    if user and user['email']:
                        send_email_notification(user['email'], 'Account Locked', 'Your account is locked due to too many failed login attempts.')
            logging.warning(f"Failed login attempt for user {username}.")
            if user_id:
                insert_notification(user_id, 'login', 'Failed login attempt.')
            if user and user['email']:
                send_email_notification(user['email'], 'Failed Login Attempt', 'There was a failed login attempt on your account.')
            return jsonify({'error': 'Invalid credentials.'}), 401
    except Exception as e:
        logging.error(f"Error during login: {e}")
        return jsonify({'error': 'Login failed due to server error.'}), 500

@app.route('/api/predict', methods=['POST'])
@jwt_required()
def predict():
    data = request.get_json()
    predictions = predict_passengers(data['historical_data'])
    return jsonify(predictions)

@app.route('/api/detect_anomalies', methods=['POST'])
@jwt_required()
def anomalies():
    data = request.get_json()
    anomalies = detect_anomalies(data)
    return jsonify(anomalies)

@app.route('/api/generate_insights', methods=['POST'])
@jwt_required()
def insights():
    data = request.get_json()
    report = generate_insights(data['kpi_data'])
    return jsonify(report)

@app.route('/api/count_passengers', methods=['POST'])
@jwt_required()
def count_passengers():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    user_id = get_jwt_identity()
    insert_uploaded_file(filename, user_id)

    count = passenger_counter.count_passengers(filepath)
    return jsonify({"passenger_count": count})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        user_id = None
        user_email = None
        # Try to get user_id from JWT if available
        try:
            verify_jwt_in_request_optional()
            user_id = get_jwt_identity()
            if user_id:
                user = get_user_by_id(user_id)
                user_email = user['email'] if user else None
        except Exception:
            pass
        if 'file' not in request.files:
            if user_id:
                insert_notification(user_id, 'upload', 'File upload failed: No file part.')
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            if user_id:
                insert_notification(user_id, 'upload', 'File upload failed: No selected file.')
            return jsonify({'error': 'No selected file'}), 400
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        if user_id:
            insert_uploaded_file(filename, user_id)
            insert_notification(user_id, 'upload', f'File "{filename}" uploaded successfully.')
            if user_email:
                send_email_notification(user_email, 'File Uploaded', f'Your file "{filename}" was uploaded successfully.')
        logging.info(f"File uploaded: {filename} by user {user_id}")
        return jsonify({'message': 'File uploaded successfully', 'filename': filename})
    except Exception as e:
        logging.error(f"File upload error: {e}")
        if user_id:
            insert_notification(user_id, 'upload', 'File upload failed due to server error.')
            if user_email:
                send_email_notification(user_email, 'File Upload Failed', 'Your file upload failed due to a server error.')
        return jsonify({'error': 'File upload failed due to server error.'}), 500

@app.route('/api/import/external', methods=['POST'])
@jwt_required()
def import_external_data():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    user_email = user['email'] if user else None
    try:
        mount_point = request.json.get('mount_point', '/mnt/external')
        result = import_from_external(mount_point)
        insert_notification(user_id, 'import', f'External data import completed. {result.get("files_processed", 0)} files processed.')
        if user_email:
            send_email_notification(user_email, 'Data Import Completed', f'Your external data import completed. {result.get("files_processed", 0)} files processed.')
        logging.info(f"External data import completed for user {user_id}")
        return jsonify(result)
    except Exception as e:
        logging.error(f"External data import error: {e}")
        insert_notification(user_id, 'import', 'External data import failed due to server error.')
        if user_email:
            send_email_notification(user_email, 'Data Import Failed', 'Your external data import failed due to a server error.')
        return jsonify({'error': 'External data import failed due to server error.'}), 500

@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Backend is running!"})

# Notification endpoints
@app.route('/api/notifications', methods=['GET'])
@jwt_required()
def api_get_notifications():
    try:
        user_id = get_jwt_identity()
        notifs = get_notifications(user_id)
        return jsonify([dict(n) for n in notifs])
    except Exception as e:
        logging.error(f"Error fetching notifications: {e}")
        return jsonify({'error': 'Failed to fetch notifications'}), 500

@app.route('/api/notifications/mark_read', methods=['POST'])
@jwt_required()
def api_mark_notification_read():
    try:
        notif_id = request.json.get('notification_id')
        mark_notification_read(notif_id)
        return jsonify({'status': 'success'})
    except Exception as e:
        logging.error(f"Error marking notification as read: {e}")
        return jsonify({'error': 'Failed to mark as read'}), 500

@app.route('/api/notifications/mark_all_read', methods=['POST'])
@jwt_required()
def api_mark_all_notifications_read():
    try:
        user_id = get_jwt_identity()
        mark_all_notifications_read(user_id)
        return jsonify({'status': 'success'})
    except Exception as e:
        logging.error(f"Error marking all notifications as read: {e}")
        return jsonify({'error': 'Failed to mark all as read'}), 500

# User Preferences endpoints
@app.route('/api/preferences', methods=['GET'])
@jwt_required()
def api_get_preferences():
    try:
        user_id = get_jwt_identity()
        prefs = get_user_preferences(user_id)
        return jsonify(prefs)
    except Exception as e:
        logging.error(f"Error fetching preferences: {e}")
        return jsonify({'error': 'Failed to fetch preferences'}), 500

@app.route('/api/preferences', methods=['POST'])
@jwt_required()
def api_set_preferences():
    try:
        user_id = get_jwt_identity()
        prefs = request.json.get('preferences', {})
        for key, value in prefs.items():
            set_user_preference(user_id, key, value)
        return jsonify({'status': 'success'})
    except Exception as e:
        logging.error(f"Error saving preferences: {e}")
        return jsonify({'error': 'Failed to save preferences'}), 500

# Report request endpoints
@app.route('/api/reports/request', methods=['POST'])
@jwt_required()
def api_request_report():
    try:
        user_id = get_jwt_identity()
        params = request.json
        params_str = json.dumps(params)
        # Insert report request as pending
        insert_report_request(user_id, params_str, status='pending')
        # Simulate report generation (mock, instant for now)
        # In a real app, this could be async/background
        # Generate mock result path
        result_path = f"/reports/report_{user_id}_{int(datetime.utcnow().timestamp())}.json"
        # Update report request as completed
        # Get the latest report request id for this user
        reports = get_report_requests(user_id)
        report_id = reports[0]['id'] if reports else None
        update_report_request_status(report_id, 'completed', result_path)
        # Insert notification (in-app)
        insert_notification(user_id, 'report', 'Your report is ready!')
        # Send email notification
        user = get_user_by_id(user_id)
        if user and user['email']:
            send_email_notification(user['email'], 'Report Ready', 'Your requested report is ready to view/download.')
        logging.info(f"Report ready for user {user_id}")
        return jsonify({'status': 'success', 'report_id': report_id, 'result_path': result_path})
    except Exception as e:
        logging.error(f"Error processing report request: {e}")
        return jsonify({'error': 'Failed to process report request'}), 500

@app.route('/api/reports', methods=['GET'])
@jwt_required()
def api_get_reports():
    try:
        user_id = get_jwt_identity()
        reports = get_report_requests(user_id)
        return jsonify([dict(r) for r in reports])
    except Exception as e:
        logging.error(f"Error fetching reports: {e}")
        return jsonify({'error': 'Failed to fetch reports'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)