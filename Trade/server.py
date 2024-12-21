from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route("/handlePerformTrade", methods=["POST"])
def perform_trade():
    
    result = subprocess.run(["python", "tradingbot.py"], capture_output=True)
    
    return jsonify({"output": result.stdout.decode("utf-8"), "error": result.stderr.decode("utf-8")})


if __name__ == "__main__":
    app.run(debug=True,port=5006)
