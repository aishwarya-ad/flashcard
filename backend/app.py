from flask import Flask
import os
from flask_pymongo import PyMongo
from routes.auth import init_auth_blueprint
from routes.user import init_users_blueprint
from routes.flashcard import init_flashcard_blueprint
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

auth_bp = init_auth_blueprint(mongo,app)
users_bp=init_users_blueprint(mongo)
flashcards_bp=init_flashcard_blueprint(mongo)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(users_bp,url_prefix='/user')
app.register_blueprint(flashcards_bp,url_prefix='/flashcard')

if __name__ == "__main__":
    app.run(debug=True)
