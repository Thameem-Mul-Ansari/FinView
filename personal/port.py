from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)

# Initialize Flask app
app = Flask(__name__)

# Configure CORS to allow requests from your Vite frontend
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],  # Vite's default port
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Store context as a constant
FINANCIAL_CONTEXT = """At interest rates so low, should I instead take a loan, finance the house and invest my capital in the stock market? So last but not least, I'm in my 30s and can now afford to buy a house full cash without taking any debt. However, with interest rates so low and they wrote this one a while back, but should I take a loan anyway and finance the house and invest my capital in the stock market? I think this is interesting that rates could change the story. Going from a 3% mortgage rate to a 5% that hurdle changes. So nine months ago, I would have said you'd be nuts to pay full cash now. Maybe it kind of makes sense, but first of all, who does this person for having that amount of money? I don't really live to be able to buy and cash, but that's great. But so Matt, you're thinking through this type of decision with a client. And this is the kind of thing where there really is no right or wrong answer, right? A lot of this is personality driven and depending on what the person wants to get"""

@app.route("/get_answer", methods=["POST", "OPTIONS"])
def get_answer():
    # Handle preflight request
    if request.method == "OPTIONS":
        return "", 200
        
    try:
        data = request.get_json()
        if not data or "question" not in data:
            return jsonify({"error": "No question provided"}), 400
        
        question = data["question"]
        answer = generate_answer(question)
        return jsonify({"answer": answer})
    
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

def generate_answer(question):
    initial_prompt = f"""Only answer the questions that is asked, please dont mention the context. Answer the following question using the context below if it is out of context, just provide related answer from the context don't mention that the question is out of context, Start in this way 'As a Financial Advisor'. Answer in the style of Ben Carlson, a financial advisor, and podcaster.
    
    Context:
    {FINANCIAL_CONTEXT}
    
    Q: {question}
    A:"""
    
    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": initial_prompt},
                {"role": "user", "content": question}
            ],
            temperature=0.5,
            top_p=0.95,
            frequency_penalty=0,
            presence_penalty=0,
            max_tokens=300,
            stop=None,
            stream=False,
        )
        return response.choices[0].message.content.replace('"', '')
    except Exception as e:
        print(f"Error generating answer: {str(e)}")
        raise

if __name__ == "__main__":
    app.run(debug=True, port=5010)