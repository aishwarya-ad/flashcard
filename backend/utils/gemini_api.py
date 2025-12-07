import os
from flask import jsonify
import dotenv
from typing import List, Dict, Any

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

dotenv.load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="models/gemini-2.5-flash",
    api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.3,
)

parser = JsonOutputParser()

flashcard_prompt = PromptTemplate.from_template(
    """
You are a flashcard generator.

Generate **at least 15** flashcards from the content below.

Return ONLY valid JSON.
No backticks. No extra text.

Example Output:

[
  {{ "question": "What is X?", "answer": "X is ..." }},
  {{ "question": "What is Y?", "answer": "Y is ..." }}
]

Content:
{content}
"""
)

flashcard_chain = flashcard_prompt | llm | parser

def call_gemini_langchain(prompt: str) -> List[Dict[str, Any]] | None:
    try:
        print("=== Calling Gemini via LangChain ===")
        print("Input:", prompt[:200])

        result = flashcard_chain.invoke({"content": prompt})
        print("Parsed:", result)
        category_name = prompt.strip()[:40] or "General"
        print(category_name)

        cleaned = []
        for item in result:
            q = item.get("question", "").strip()
            a = item.get("answer", "").strip()
            if q and a:
                cleaned.append({
                    "question": q,
                    "answer": a,
                    "category": category_name
                })
        return cleaned
        # return jsonify({"flashcards": cleaned})


    except Exception as e:
        print("LangChain Error:", e)
        return None



# import google.generativeai as genai
# import os
# import re

# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# def extract_flashcards(response_text):
#     pattern = r"Q:\s*(.*?)\s*A:\s*(.*?)\s*(?=\n|$)" 
#     flashcards = []
#     matches = re.findall(pattern, response_text, re.DOTALL)
#     for match in matches:
#         question, answer = match
#         flashcards.append({"question": question.strip(), "answer": answer.strip()})
#     return flashcards

# def call_gemini_api(prompt):    
#     try:
#         model = genai.GenerativeModel("gemini-1.5-flash")
#         response = model.generate_content(f"Generate flashcards based on the following content in the format of 'Q' and 'A' one by one... I do not want the card numbers and the asterisks: {prompt}")
#         print("Response:", response.text)
#         if not response.text.strip():
#             print("No content returned from the API.")
#             return None
#         flashcards_data = extract_flashcards(response.text)
#         if not flashcards_data:
#             print("Insufficient flashcards generated.")
#             return None
#         return flashcards_data
#     except Exception as e:
#         print(f"Error while calling Gemini API: {e}")
#         return None

