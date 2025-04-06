# Load model directly
from transformers import (
    AutoImageProcessor, 
    AutoModelForImageClassification,
    AutoTokenizer,
    AutoModelForSequenceClassification
)
from flask import Flask, request, jsonify
from PIL import Image
import torch
import io

# Check if GPU is available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Load the ViT Deepfake Detection model
image_processor = AutoImageProcessor.from_pretrained("Wvolf/ViT_Deepfake_Detection")
deepfake_model = AutoModelForImageClassification.from_pretrained("Wvolf/ViT_Deepfake_Detection")
deepfake_model = deepfake_model.to(device)  # Move model to GPU if available

# Load the Crime Classification model
tokenizer = AutoTokenizer.from_pretrained("PDG/gpt2_for_crime_classification")
crime_model = AutoModelForSequenceClassification.from_pretrained("PDG/gpt2_for_crime_classification")
crime_model = crime_model.to(device)  # Move model to GPU if available

app = Flask(__name__)

@app.route('/deepfake', methods=['POST'])
def detect_deepfake():
    try:
        # Check if the post request has the file part
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
        
        # Open the image
        image = Image.open(io.BytesIO(file.read()))
        
        # Process the image with the model
        inputs = image_processor(images=image, return_tensors="pt")
        # Move input tensors to the same device as the model
        inputs = {key: val.to(device) for key, val in inputs.items()}
        
        with torch.no_grad():
            outputs = deepfake_model(**inputs)
            logits = outputs.logits
            predicted_class_idx = logits.argmax(-1).item()
        
        # Get the predicted label and confidence
        predicted_label = deepfake_model.config.id2label[predicted_class_idx]
        confidence = torch.softmax(logits, dim=1)[0][predicted_class_idx].item()
        
        # Return the result
        return jsonify({
            'result': predicted_label,
            'confidence': round(confidence * 100, 2),
            'is_fake': predicted_label.lower() == 'fake'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/classify-crime', methods=['POST'])
def classify_crime():
    try:
        # Get text from request
        data = request.json
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text']
        
        # Process the text with the model
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        # Move input tensors to the same device as the model
        inputs = {key: val.to(device) for key, val in inputs.items()}
        
        with torch.no_grad():
            outputs = crime_model(**inputs)
            logits = outputs.logits
            predicted_class_idx = logits.argmax(-1).item()
        
        # Get the predicted label and confidence
        predicted_label = crime_model.config.id2label[predicted_class_idx]
        confidence = torch.softmax(logits, dim=1)[0][predicted_class_idx].item()
        
        # Return the result
        return jsonify({
            'crime_type': predicted_label,
            'confidence': round(confidence * 100, 2)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)