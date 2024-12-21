import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
from crewai import Agent, Task
from langchain_groq import ChatGroq

# Load environment variables
load_dotenv()

# Ensure API key is retrieved correctly
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY is missing. Check your .env file.")

default_llm = ChatGroq(
    api_key=api_key,
    model="llama3-70b-8192"
)

def scrape_website_content(website_url):
    try:
        response = requests.get(website_url, timeout=20)
        response.raise_for_status()
    except (requests.HTTPError, requests.ConnectionError, requests.Timeout) as e:
        print(f"Error occurred while scraping {website_url}: {str(e)}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.extract()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    content = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    content = "\n".join(chunk for chunk in content if chunk)

    with open("scraped_content.txt", "w") as file:
        file.write(content)
        
    content = [content[i : i + 8000] for i in range(0, len(content), 8000)]

    # print(content)
    summaries = []
    for chunk in content:
        agent = Agent(
            role="Principal Researcher",
            goal="Do amazing research and summaries based on the content you are working with",
            backstory="You're a Principal Researcher at a big company and you need to do research about a given topic.",
            allow_delegation=False,
            llm=default_llm,
        )

        task = Task(
            agent=agent,
            description=f"Analyze and summarize the content below, make sure to include the most relevant information in the summary, return only the summary nothing else.\n\nCONTENT\n----------\n{chunk}",
        )
        summary = task.execute()
        summaries.append(summary)
    print(summaries)
    return "\n\n".join(summaries)


scrape_website_content(
    "https://thedecisionlab.com/reference-guide/philosophy/system-1-and-system-2-thinking"
)
