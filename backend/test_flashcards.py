from utils.gemini_api import call_gemini_langchain

if __name__ == "__main__":
    prompt = "Explain neural networks, layers, weights, bias, activation functions, training, loss, backpropagation, optimization, gradient descent."
    output = call_gemini_langchain(prompt)
    print("\nTEST RESULT:\n", output)
