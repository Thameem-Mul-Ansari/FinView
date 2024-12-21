from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from crewai import Crew
from stock_analysis_agents import StockAnalysisAgents
from stock_analysis_tasks import StockAnalysisTasks
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

class FinancialCrew:
    def __init__(self, company, socket=None):
        self.company = company
        self.socket = socket

    def emit_progress(self, message):
        if self.socket:
            self.socket.emit('analysis_progress', message)

    def run(self):
        try:
            agents = StockAnalysisAgents()
            tasks = StockAnalysisTasks()

            self.emit_progress("Initializing research analyst...")
            research_analyst_agent = agents.research_analyst()
            
            self.emit_progress("Initializing financial analyst...")
            financial_analyst_agent = agents.financial_analyst()
            
            self.emit_progress("Initializing investment advisor...")
            investment_advisor_agent = agents.investment_advisor()

            self.emit_progress(f"Starting research analysis for {self.company}...")
            research_task = tasks.research(research_analyst_agent, self.company)
            
            self.emit_progress("Conducting financial analysis...")
            financial_task = tasks.financial_analysis(financial_analyst_agent)
            
            self.emit_progress("Analyzing financial filings...")
            filings_task = tasks.filings_analysis(financial_analyst_agent)
            
            self.emit_progress("Preparing investment recommendations...")
            recommend_task = tasks.recommend(investment_advisor_agent)

            crew = Crew(
                agents=[
                    research_analyst_agent,
                    financial_analyst_agent,
                    investment_advisor_agent,
                ],
                tasks=[research_task, financial_task, filings_task, recommend_task],
                verbose=True,
            )

            result = crew.kickoff()
            
            if self.socket:
                self.socket.emit('analysis_complete', result)
                
            return result
            
        except Exception as e:
            if self.socket:
                self.socket.emit('analysis_error', str(e))
            raise e

@app.route('/run_financial_analysis', methods=['POST'])
def run_financial_analysis():
    try:
        data = request.get_json()
        company = data.get('company')

        if not company:
            return jsonify({'error': 'Company symbol is required'}), 400

        financial_crew = FinancialCrew(company, socketio)
        result = financial_crew.run()

        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)