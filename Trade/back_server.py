from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route("/perform_backtest", methods=["POST"])
def perform_backtest():
    
    result = subprocess.run(["python", "backtesting.py"], capture_output=True)
    
    return jsonify({"output": result.stdout.decode("utf-8"), "error": result.stderr.decode("utf-8")})    

if __name__ == "__main__":
    app.run(debug=True,port=5008)
