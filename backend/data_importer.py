import os
import csv
import datetime
from database import insert_passenger_record

def import_from_external(path):
    for filename in os.listdir(path):
        if filename.endswith('.csv'):
            with open(os.path.join(path, filename), 'r') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    record = {
                        'timestamp': datetime.datetime.strptime(row['timestamp'], '%Y-%m-%d %H:%M:%S'),
                        'airline': row['airline'],
                        'destination': row['destination'],
                        'passengers': int(row['passengers']),
                        'revenue': float(row['revenue'])
                    }
                    insert_passenger_record(record)
    return {"status": "success", "files_processed": len(os.listdir(path))}