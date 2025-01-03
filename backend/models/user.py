from datetime import datetime

def create_user_schema():
    return {
        "username": "",
        "email": "",
        "password": "",  
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "preferences": {}  
    }