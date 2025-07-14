from sklearn.ensemble import IsolationForest
import numpy as np
import pandas as pd

def detect_anomalies(data):
    """Identify unusual patterns in airport data"""
    # Convert to feature matrix
    features = np.array([
        data['passengers'],
        data['revenue'],
        data['flight_count'],
        pd.to_datetime(data['timestamp']).dt.hour
    ]).T
    
    # Train isolation forest
    clf = IsolationForest(contamination=0.01)
    clf.fit(features)
    
    # Predict anomalies
    anomalies = clf.predict(features)
    return [i for i, x in enumerate(anomalies) if x == -1]