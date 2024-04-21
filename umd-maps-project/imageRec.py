from flask import Flask, request, jsonify, render_template
from PIL import Image
import google.generativeai as gai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key and model name from environment variables
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
MODEL_NAME = os.getenv('MODEL_NAME')
gai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)

# Function to process image and perform object localization using Gemini API
def process_image(image_data):
    model = gai.GenerativeModel('gemini-pro-vision')
    prompt = "Detect the main food item in this image and return its name. For example, if you see pizza in the image, just return stating 'pizza'. No sentences required, just name the food items. If it is curry, just say 'curry' rather than 'this is curry'. I just want the food name. I dont want the words this is."
    response = model.generate_content([prompt, image_data])
    return response.text.strip()  # Strip any leading or trailing whitespace

@app.route('/')
def upload_page():
    return render_template('upload_page.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Process the uploaded image
    food_item = process_image(file)

    # Get quantity from request
    quantity = request.form.get('quantity')

    return jsonify({'food_item': food_item, 'quantity': quantity})

@app.route('/result_page', methods=['GET'])
def result_page():
    food_item = request.args.get('food_item')
    quantity = request.args.get('quantity')
    return render_template('source_final.html', food_item=food_item, quantity=quantity)

if __name__ == '__main__':
    app.run(debug=True)
