import requests
from PyPDF2 import PdfReader
import os
from utils.gemini_api import call_gemini_api

def extract_text_from_pdf(pdf_file):
    print("Extract from pdf called")
    reader = PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    print(text)
    return text

def generate_flashcards_from_pdf_content(text):
    response = call_gemini_api(text)
    if response:
        return response
    else:
        return None
