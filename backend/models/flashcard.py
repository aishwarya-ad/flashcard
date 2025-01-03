from datetime import datetime

def create_flashcard_schema():
    return {
        "question": "",        
        "answer": "",           
        "category": "",         
        "created_at": datetime.utcnow(),  
        "updated_at": datetime.utcnow(),  
        "user_id": "",         
    }
