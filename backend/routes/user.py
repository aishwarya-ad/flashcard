from flask import Blueprint, request, jsonify,current_app
from bson import ObjectId

users_bp = Blueprint('users', __name__)
mongo = None  

def init_users_blueprint(app_mongo):
    global mongo
    mongo = app_mongo
    return users_bp

@users_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    users_collection = mongo.db.users 
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    user["_id"] = str(user["_id"])  
    return jsonify(user), 200



@users_bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    users_collection = mongo.db.users 
    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "User deleted successfully"}), 200
