import streamlit as st
import requests
import os

# Set up your Groq API key
groq_api_key = os.getenv("GROQ_API_KEY")  # Ensure you set this in your environment variables

context = """Welcome back to Portfolio Rescue, folks. It's Duncan here, and today we're diving into the tumultuous waters of the current market situation. It's been a bit rough lately, with speculative investments taking quite the beating. But hey, I'm a glass-half-full kind of guy, and I want us to explore some positives amidst this drawdown.

Let's start with a reality check – getting rich overnight isn't easy, and it certainly isn't normal. I mean, come on, throwing ten grand into some internet token and expecting a lifetime's worth of earnings? That's just a joke. This market phase is a reminder that building wealth is a gradual process. So, let's talk about where the real players are, now that all the charlatans and bad advice-givers have been exposed.

I posted this on Twitter yesterday – pandemic, crazy inflation, and two bear markets – but guess what? The S&P 500 is still up 26% since 2020. Wrap your head around that. And here's a chart to prove it. Stocks are actually getting cheaper despite all the chaos. Forward P/E ratios are still a bit elevated, but mid-caps are below where we were in the 2018 bear market. Interesting, right?

Now, let's address some questions from you, the viewers. One of you is contemplating shifting your portfolio allocation during this bear market. The key here is not overreacting. It's a tricky game, but consider whether your goals and circumstances really demand a change. Don't forget to evaluate the situation through a long-term lens. It's all about staying the course and not letting short-term market moves dictate your strategy.

And then, we touch on the evergreen topic of retirement withdrawals. Someone's pondering the famous four percent rule but with a twist – withdrawing enough for a comfy life and still growing the retirement portfolio for the kids. Now, that's a thoughtful approach. It leads us to a discussion about soft landings and hard landings regarding the Fed's actions. I'll break down what these terms mean in market terms, and we'll explore the potential implications.

Finally, we round it off with some wisdom for our younger investors out there. Your biggest asset right now? Time. So, automate your savings, automate your investments, and don't let the market's ups and downs consume your every thought. Remember, bear markets can be your friend when you're in it for the long haul.

So, grab your notepads, folks. We're diving deep into portfolio strategies and market dynamics today on Portfolio Rescue."""

def answer_question(question):
    prompt = f"""Answer the following question using only the context below. Answer in the style of Ben Carlson, a financial advisor, and podcaster.

Context:
{context}

Q: {question}
A:"""

    # Specify the Groq API endpoint and headers
    groq_endpoint = "https://api.groq.com/v1/complete"  # Replace with the correct Groq endpoint
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gemma2-9b-it",  # Use the appropriate model name
        "prompt": prompt,
        "temperature": 0.7,
        "max_tokens": 500,
    }

    # Make the request to Groq
    response = requests.post(groq_endpoint, headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()["completion"].strip(" \n")
    else:
        return "Error: Unable to get a response from Groq API."

def main():
    st.title("Financial Advisor Q&A")

    # Input for user question
    question = st.text_area("Ask a question:")
    
    if st.button("Get Answer"):
        if question:
            # Call the answer_question function
            answer = answer_question(question)
            # Display the answer
            st.text_area("Answer:", answer)
        else:
            st.warning("Please enter a question.")

if __name__ == "__main__":
    main()