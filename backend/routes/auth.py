from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager,create_access_token,jwt_required,get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import os,dotenv
from models.user import create_user_schema
from datetime import timedelta

dotenv.load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

auth_bp = Blueprint('auth', __name__)
mongo = None 

def init_auth_blueprint(app_mongo,app):
    global mongo
    mongo = app_mongo
    app.config['JWT_SECRET_KEY']=SECRET_KEY
    JWTManager(app)
    return auth_bp

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        mongo.db.command('ping')
    except Exception as e:
        return jsonify({'status': 'fail', 'message': 'Database connection is not initialized.'}), 500

    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'status': 'fail', 'message': 'Missing fields!'}), 400
    if mongo.db.users.find_one({"email": data['email']}):
        return jsonify({'status': 'fail', 'message': 'User already exists with this email'}), 409

    hashed_password = generate_password_hash(data['password'])
    user_schema = create_user_schema()
    user_schema.update({
        "username": data['username'],
        "email": data['email'],
        "password": hashed_password,
    })
    mongo.db.users.insert_one(user_schema)
    return jsonify({'status': 'success', 'message': 'User created successfully!'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'status': 'fail', 'message': 'Missing fields!'}), 400

    user = mongo.db.users.find_one({"email": data['email']})
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'status': 'fail', 'message': 'Invalid email or password'}), 401
    access_token=create_access_token(identity=str(user["_id"]),expires_delta=timedelta(days=30))

    return jsonify({'status': 'success', 'access_token': access_token}), 200


