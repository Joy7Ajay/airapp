from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from ml_service import predict_passengers
from anomaly_detection import detect_anomalies
from nlp_insights import generate_insights
from computer_vision import PassengerCounter
from data_importer import import_from_external
from database import insert_passenger_record, insert_uploaded_file, init_db
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__)

# Secret key for JWT
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY')
jwt = JWTManager(app)

# Initialize Passenger Counter
passenger_counter = PassengerCounter()

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    file = request.files['image']
    # Save the file to a temporary location
    # and pass the path to the count_passengers method
    # For now, we'll just return a dummy count
    count = passenger_counter.count_passengers("path/to/image.jpg")
    return jsonify({"passenger_count": count})

@app.route('/api/import/external', methods=['POST'])
@jwt_required()
def import_external_data():
    mount_point = request.json.get('mount_point', '/mnt/external')
    result = import_from_external(mount_point)
    return jsonify(result)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    # Optionally, get user_id from JWT if available
    user_id = None
    try:
        from flask_jwt_extended import get_jwt_identity, jwt_required
        @jwt_required(optional=True)
        def get_user():
            return get_jwt_identity()
        user_id = get_user()
    except Exception:
        pass
    insert_uploaded_file(filename, user_id)
    return jsonify({'message': 'File uploaded successfully', 'filename': filename})


@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Backend is running!"})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5001)