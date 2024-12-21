from crewai import Agent
import os
from dotenv import load_dotenv
from tools.browser_tools import BrowserTools
from tools.calculator_tools import CalculatorTools
from tools.search_tools import SearchTools
from tools.sec_tools import SECTools
from langchain_openai import AzureChatOpenAI
from langchain_groq import ChatGroq
from langchain.tools.yahoo_finance_news import YahooFinanceNewsTool

# Load environment variables
load_dotenv()

# Ensure GROQ API Key is retrieved correctly
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing. Ensure it's set in your .env file.")

# Initialize LLM
default_llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model="llama3-70b-8192"
)

# Define Stock Analysis Agents
class StockAnalysisAgents:
    def financial_analyst(self):
        return Agent(
            role="The Best Financial Analyst",
            llm=default_llm,
            goal="""Impress all customers with your financial data 
            and market trends analysis.""",
            backstory="""The most seasoned financial analyst with 
            lots of expertise in stock market analysis and investment
            strategies. Now working for an important customer.""",
            verbose=True,
            tools=[
                BrowserTools.scrape_and_summarize_website,
                SearchTools.search_internet,
                CalculatorTools.calculate,
                SECTools.search_10q,
                SECTools.search_10k,
            ],
        )

    def research_analyst(self):
        return Agent(
            role="Staff Research Analyst",
            llm=default_llm,
            goal="""Be the best at gathering and interpreting data,
            and amaze your customers with it.""",
            backstory="""Known as the BEST research analyst, you're
            skilled in sifting through news, company announcements, 
            and market sentiments. Now you're working for an 
            important customer.""",
            verbose=True,
            tools=[
                BrowserTools.scrape_and_summarize_website,
                SearchTools.search_internet,
                SearchTools.search_news,
                YahooFinanceNewsTool(),
                SECTools.search_10q,
                SECTools.search_10k,
            ],
        )

    def investment_advisor(self):
        return Agent(
            role="Private Investment Advisor",
            llm=default_llm,
            goal="""Impress your customers with full analyses of stocks
            and complete investment recommendations.""",
            backstory="""You're the most experienced investment advisor
            combining various analytical insights to formulate
            strategic investment advice. Now working for an 
            important customer.""",
            verbose=True,
            tools=[
                BrowserTools.scrape_and_summarize_website,
                SearchTools.search_internet,
                SearchTools.search_news,
                CalculatorTools.calculate,
                YahooFinanceNewsTool(),
            ],
        )