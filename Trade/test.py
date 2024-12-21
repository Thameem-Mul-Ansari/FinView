from fastapi import FastAPI  
from pydantic import BaseModel
from datetime import datetime  
  
from lumibot.brokers import Alpaca  
from lumibot.backtesting import YahooDataBacktesting  
from lumibot.strategies import Strategy  
from lumibot.traders import Trader  
from alpaca_trade_api import REST   
from timedelta import Timedelta   
from finbert_utils import estimate_sentiment  
  
app = FastAPI()  
  
class TradingParams(BaseModel):  
    symbol: str  
    cash_at_risk: float  
  
API_KEY = "PKRZ64CXW8A8MP0JLASJ"   
API_SECRET = "tbMf7SDPar30gdicCH1yPm7Cr2clcgossAKPpCDw"   
BASE_URL = "https://paper-api.alpaca.markets"  
  
ALPACA_CREDS = {  
    "API_KEY":API_KEY,   
    "API_SECRET": API_SECRET,   
    "PAPER": True  
}  
  
class MLTrader(Strategy):   
    def initialize(self, symbol:str="SPY", cash_at_risk:float=.5):   
        self.symbol = symbol  
        self.sleeptime = "5M"   
        self.last_trade = None   
        self.cash_at_risk = cash_at_risk  
        self.api = REST(base_url=BASE_URL, key_id=API_KEY, secret_key=API_SECRET)  
  
    def position_sizing(self):   
        cash = self.get_cash()   
        last_price = self.get_last_price(self.symbol)  
        quantity = round(cash * self.cash_at_risk / last_price,0)  
        return cash, last_price, quantity  
  
    def get_dates(self):   
        today = self.get_datetime()  
        three_days_prior = today - Timedelta(days=3)  
        return today.strftime('%Y-%m-%d'), three_days_prior.strftime('%Y-%m-%d')  
  
    def get_sentiment(self):   
        today, three_days_prior = self.get_dates()  
        news = self.api.get_news(symbol=self.symbol,   
                                 start=three_days_prior,   
                                 end=today)   
        news = [ev.dict["_raw"]["headline"] for ev in news]  
        probability, sentiment = estimate_sentiment(news)  
        return probability, sentiment   
  
    def on_trading_iteration(self):  
        cash, last_price, quantity = self.position_sizing()  
        probability, sentiment = self.get_sentiment()  
  
        if cash > last_price:  
            if sentiment == "positive" and probability > .999:  
                if self.last_trade == "sell":  
                    self.sell_all()  
                target_price = round(last_price * 1.20, 2)    
                stop_price = round(last_price * 0.95, 2)    
                order = self.create_order(  
                    self.symbol,  
                    quantity,  
                    "buy",  
                    take_profit_price=target_price,  
                    stop_loss_price=stop_price  
                )  
                self.submit_order(order)  
                self.last_trade = "buy"  
            elif sentiment == "negative" and probability > .999:  
                if self.last_trade == "buy":  
                    self.sell_all()  
                target_price = round(last_price * 0.8, 2)    
                stop_price = round(last_price * 1.05, 2)    
                order = self.create_order(  
                    self.symbol,  
                    quantity,  
                    "sell",  
                    take_profit_price=target_price,  
                    stop_loss_price=stop_price  
                )  
                self.submit_order(order)  
                self.last_trade = "sell"  
  
@app.post("/backtest_strategy/")  
async def backtest_strategy(params: TradingParams):  
    start_date = datetime(2020,1,1)  
    end_date = datetime(2023,12,31)   
    broker = Alpaca(ALPACA_CREDS)   
    strategy = MLTrader(name='mlstrat', broker=broker,   
                        parameters={"symbol": params.symbol,   
                                    "cash_at_risk": params.cash_at_risk})  
      
    # Backtest code  
    strategy.backtest(  
        YahooDataBacktesting,  
        start_date,  
        end_date,  
        parameters={"symbol": params.symbol, "cash_at_risk": params.cash_at_risk}  
    )  
  
    return {"status": "Backtesting complete!"}  
  
@app.post("/live_trade_strategy/")  
async def live_trade_strategy(params: TradingParams):  
    broker = Alpaca(ALPACA_CREDS)   
    strategy = MLTrader(name='mlstrat', broker=broker,   
                        parameters={"symbol": params.symbol,   
                                    "cash_at_risk": params.cash_at_risk})  
      
    # Live Trade  
    trader = Trader()  
    trader.add_strategy(strategy)  
    trader.run_all()  
  
    return {"status": "Live trading started!"}