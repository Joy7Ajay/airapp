from sklearn.ensemble import IsolationForest
import numpy as np
import pandas as pd

def detect_anomalies(data):
    features = np.array([
        data['passengers'],
        data['revenue'],
        data['flight_count'],
        pd.to_datetime(data['timestamp']).dt.hour
    ]).T
    
    clf = IsolationForest(contamination=0.01)
    clf.fit(features)
    
    anomalies = clf.predict(features)
    return [i for i, x in enumerate(anomalies) if x == -1]