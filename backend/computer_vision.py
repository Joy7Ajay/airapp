import cv2
import numpy as np

import os

class PassengerCounter:
    def __init__(self):
        self.model_loaded = False
        weights_path = "yolov4.weights"
        config_path = "yolov4.cfg"

        if os.path.exists(weights_path) and os.path.exists(config_path):
            self.net = cv2.dnn.readNet(weights_path, config_path)
            self.classes = ["person"]
            self.model_loaded = True
        else:
            print("Warning: YOLOv4 model files not found. Passenger counting will be disabled.")
            self.net = None

    def count_passengers(self, image_path):
        if not self.model_loaded:
            return -1
        image = cv2.imread(image_path)
        height, width, _ = image.shape
        
        blob = cv2.dnn.blobFromImage(image, 1/255, (416, 416), (0,0,0), True, crop=False)
        self.net.setInput(blob)
        output_layers = self.net.getUnconnectedOutLayersNames()
        outs = self.net.forward(output_layers)
        
        count = 0
        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.5 and class_id == 0:
                    count += 1
                    
        return count