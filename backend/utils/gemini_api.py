import google.generativeai as genai
import os
import re

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def extract_flashcards(response_text):
    pattern = r"Q:\s*(.*?)\s*A:\s*(.*?)\s*(?=\n|$)" 
    flashcards = []
    matches = re.findall(pattern, response_text, re.DOTALL)
    for match in matches:
        question, answer = match
        flashcards.append({"question": question.strip(), "answer": answer.strip()})
    return flashcards

def call_gemini_api(prompt):    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(f"Generate flashcards based on the following content in the format of 'Q' and 'A' one by one... I do not want the card numbers and the asterisks: {prompt}")
        print("Response:", response.text)
        if not response.text.strip():
            print("No content returned from the API.")
            return None
        flashcards_data = extract_flashcards(response.text)
        if not flashcards_data:
            print("Insufficient flashcards generated.")
            return None
        return flashcards_data
    except Exception as e:
        print(f"Error while calling Gemini API: {e}")
        return None
