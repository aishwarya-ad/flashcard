from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required,get_jwt_identity
from bson import ObjectId
from utils.gemini_api import call_gemini_langchain
from models.flashcard import create_flashcard_schema
from utils.pdf_utils import generate_flashcards_from_pdf_content,extract_text_from_pdf

flashcards_bp = Blueprint('flashcards', __name__)
mongo=None

def init_flashcard_blueprint(app_mongo):
    global mongo
    mongo=app_mongo
    return flashcards_bp

from flask import Flask, request, jsonify
import PyPDF2

app = Flask(__name__)

@flashcards_bp.route('/generate_combined', methods=['POST'], endpoint='generate_combined_flashcards')
@jwt_required()
def generate_combined_flashcards():
    """
    Generate flashcards based on a combined input of user-provided prompt and uploaded PDF.
    """
    prompt = request.form.get("prompt", "")
    current_user_id=get_jwt_identity()
    if 'file' in request.files:
        pdf_file=request.files['file']
        filename = pdf_file.filename  
        category = filename.rsplit('.', 1)[0]
        try:
            pdf_text=extract_text_from_pdf(pdf_file)
            print(pdf_text)
        except Exception as e:
            return jsonify({"message": f"Failed to extract text from pdf:{str(e)}"}),500
    else:
        pdf_text=" "
        category=prompt
    if not prompt and not pdf_file:
        return jsonify({"message": "Either a prompt or a PDF file is required."}), 400
    combined_input = (prompt + "\n\n" + pdf_text).strip()
    if not combined_input:
        return jsonify({"message": "No valid input provided after combining."}), 400
    flashcards = call_gemini_langchain(combined_input)
    if not flashcards:
        return jsonify({"message": "Failed to generate flashcards."}), 500
    flashcardsarray = []
    for flashcard in flashcards:
        flashcard_data = create_flashcard_schema()
        flashcard_data["question"] = flashcard.get("question", "")
        flashcard_data["answer"] = flashcard.get("answer", "")
        flashcard_data["category"] = category 
        flashcard_data["user_id"] = current_user_id
        flashcardsarray.append(flashcard_data)
    return jsonify({"flashcards": flashcardsarray}), 200


@flashcards_bp.route('/create', methods=['POST'],endpoint='create_flashcard')
@jwt_required()
def create_flashcard():
    current_user_id=get_jwt_identity()
    data = request.get_json()
    if not data or not data.get('question') or not data.get('answer'):
        return jsonify({'message': 'Missing question or answer'}), 400
    flashcard_data = create_flashcard_schema()
    flashcard_data["question"] = data["question"]
    flashcard_data["answer"] = data["answer"]
    flashcard_data["category"] = data.get("category", "")
    flashcard_data["user_id"] = current_user_id 
    mongo.db.flashcards.insert_one(flashcard_data) 
    return jsonify({'message': 'Flashcard created successfully!'}), 200


@flashcards_bp.route('/allflashcards', methods=['GET'],endpoint='get_all_flashcards')
@jwt_required()
def get_all_flashcards():
    current_user_id = get_jwt_identity()
    flashcards = mongo.db.flashcards.find({"user_id": current_user_id})
    flashcards_list = [
        {
            "_id": str(flashcard["_id"]),
            "question": flashcard["question"],
            "answer": flashcard["answer"],
            "category": flashcard.get("category", ""),
        }
        for flashcard in flashcards
    ]
    return jsonify(flashcards_list), 200


@flashcards_bp.route('/getflashcards', methods=['GET'], endpoint='get_flashcards')
@jwt_required()
def get_flashcards():
    current_user_id = get_jwt_identity()
    flashcards = mongo.db.flashcards.find({"user_id": current_user_id})
    grouped_flashcards = {}
    for flashcard in flashcards:
        category = flashcard.get("category", "")
        if category not in grouped_flashcards:
            grouped_flashcards[category] = []
        grouped_flashcards[category].append({
            "question": flashcard["question"],
            "answer": flashcard["answer"]
        })
    
    return jsonify(grouped_flashcards), 200


@flashcards_bp.route('/update/<flashcard_id>', methods=['PUT'],endpoint='update_flashcard')
@jwt_required()
def update_flashcard(flashcard_id):
    current_user_id=get_jwt_identity()
    data = request.get_json()
    update_fields = {key: value for key, value in data.items() if value is not None}
    if not update_fields:
        return jsonify({'message': 'No data provided for update'}), 400
    result = mongo.db.flashcards.update_one({"_id": ObjectId(flashcard_id),"user_id":current_user_id}, {"$set": update_fields})
    if result.matched_count == 0:
        return jsonify({'message': 'Flashcard not found'}), 404

    return jsonify({'message': 'Flashcard updated successfully!'}), 200


@flashcards_bp.route('/delete/<flashcard_id>', methods=['DELETE'],endpoint='delete_flashcard')
@jwt_required()
def delete_flashcard(flashcard_id):
    current_user_id=get_jwt_identity()
    result = mongo.db.flashcards.delete_one({"_id": ObjectId(flashcard_id),"user_id":current_user_id})
    if result.deleted_count == 0:
        return jsonify({'message': 'Flashcard not found'}), 404

    return jsonify({'message': 'Flashcard deleted successfully!'}), 200



@flashcards_bp.route('/delete_category', methods=['DELETE'], endpoint='delete_flashcards_by_category')
@jwt_required()
def delete_flashcards_by_category():
    """
    Delete all flashcards for the specified categories.
    """
    current_user_id = get_jwt_identity()
    data = request.json
    if not data or 'categories' not in data:
        return jsonify({'message': 'No categories specified'}), 400
    categories = data['categories']
    if not categories:
        return jsonify({'message': 'Categories list is empty'}), 400
    result = mongo.db.flashcards.delete_many({
        "category": {"$in": categories},
        "user_id": current_user_id
    })
    if result.deleted_count == 0:
        return jsonify({'message': 'No flashcards found in the specified categories'}), 404

    return jsonify({'message': f'Successfully deleted {result.deleted_count} flashcards'}), 200


@flashcards_bp.route('/save_deck', methods=['POST'], endpoint='save_flashcard_deck')
@jwt_required()
def save_flashcard_deck():
    """
    Save a deck of flashcards with a specific category.
    """
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    flashcards = data.get("flashcards", [])
    category = data.get("category", "")

    if not flashcards or not category:
        return jsonify({"message": "Flashcards and category are required."}), 400
    flashcardsarray=[]
    for flashcard in flashcards:
        flashcard_data = create_flashcard_schema()
        flashcard_data["question"] = flashcard.get("question")
        flashcard_data["answer"] = flashcard.get("answer")
        flashcard_data["category"] = category  
        flashcard_data["user_id"] = current_user_id
        flashcardsarray.append(flashcard_data)
    try:
        mongo.db.flashcards.insert_many(flashcardsarray)
        return jsonify({"message": "Flashcard deck saved successfully."}), 200
    except Exception as e:
        return jsonify({"message": f"Failed to save flashcards: {str(e)}"}), 500

