from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, UserStock, Stock, Transaction
from ..extentions import db
from decimal import Decimal
import yfinance as yf
import logging
import pandas as pd
import math

stocks_blueprint = Blueprint("stocks", __name__)

@stocks_blueprint.route("/buy", methods=["POST"])
@jwt_required()
def buy_stock():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    body = request.get_json()
    symbol = body.get("symbol")
    quantity = body.get("quantity")
    current_price = Decimal(body.get("current_price"))

    if (not isinstance(symbol, str)) or (not isinstance(quantity, int)) or quantity <= 0 or current_price <= 0:
        return jsonify({"message": "Invalid data"}), 400

    symbol = symbol.upper()

    # validate ticker using yfinance
    stock_info = (yf.Ticker(symbol)).get_info()

    try:
        # if we can't access these fields, the stock symbol is invalid
        company_name = stock_info["longName"]
        expected_current_price = Decimal(stock_info["currentPrice"])
        industry = stock_info["industry"]
        sector = stock_info["sector"]
    except KeyError as e:
        logging.error(f"Error accessing stock: {str(e)}")
        return jsonify({"message": "Invalid stock symbol"}), 400
    
    # validate the current price approximately matches the expected value
    if not (expected_current_price * Decimal(0.99) <= current_price <= expected_current_price * Decimal(1.01)):
        return jsonify({"message": "The current price is incorrect"}), 400
    
    # check if the stock already exists in the database
    stock = Stock.query.filter_by(symbol=symbol).first()
    if not stock:
        # add stock to the database if not found
        stock = Stock(symbol=symbol, company_name=company_name, industry=industry, sector=sector)
        db.session.add(stock)

    # check if user already owns the stock
    user_stock = UserStock.query.filter_by(user_id=user.id, stock_id=stock.id).first()
    refresh_user = False
    if user_stock:
        user_stock.quantity += quantity
    else:
        user_stock = UserStock(user_id=user.id, stock_id=stock.id, quantity=quantity)
        refresh_user = True
    
    db.session.add(user_stock)

    total_cost = current_price * quantity
    # now create the buy transaction
    transaction = Transaction(
        user_id=user.id,
        stock_id=stock.id,
        transaction_type="buy",
        quantity=quantity,
        total_cost=total_cost,
        cost_per_share=current_price
    )
    db.session.add(transaction)
    db.session.commit()

    response_object = {
        "message": f"Successfully bought {quantity} shares of {symbol}",
        "quantity": user_stock.quantity, "total_cost": transaction.total_cost,
        "new_user_stock": None
    }

    if refresh_user:
        new_user_stock = db.session.query(UserStock).join(Stock).filter(UserStock.user_id == user.id, Stock.id == stock.id).first()
        if new_user_stock:
            new_user_stock = new_user_stock.to_dict()
            response_object["new_user_stock"] = new_user_stock
    
    return jsonify(response_object)


@stocks_blueprint.route("/sell", methods=["POST"])
@jwt_required()
def sell_stock():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    body = request.get_json()
    symbol = body.get("symbol")
    quantity = body.get("quantity")
    current_price = Decimal(body.get("current_price"))

    if (not isinstance(symbol, str)) or (not isinstance(quantity, int)) or quantity <= 0 or current_price <= 0:
        return jsonify({"message": "Invalid data"}), 400
    
    symbol = symbol.upper()

    # validate ticker using yfinance
    stock_info = (yf.Ticker(symbol)).get_info()

    try:
        # if we can't access these fields, the stock symbol is invalid
        expected_current_price = Decimal(stock_info["currentPrice"])
    except KeyError as e:
        logging.error(f"Error accessing stock: {str(e)}")
        return jsonify({"message": "Invalid stock symbol"}), 400
    
    # validate the total cost approximately matches the expected value
    if not (expected_current_price * Decimal(0.99) <= current_price <= expected_current_price * Decimal(1.01)):
        return jsonify({"message": "The current price is incorrect"}), 400
    
    # find the stock and user's ownership
    stock = Stock.query.filter_by(symbol=symbol).first()
    if not stock:
        return jsonify({"message": "Stock not found"}), 404
    
    user_stock = UserStock.query.filter_by(user_id=user.id, stock_id=stock.id).first()
    if not user_stock:
        return jsonify({"message": "You do not own this stock"}), 400

    if user_stock.quantity < quantity:
        return jsonify({"message": "Not enough shares to sell"}), 400
    
    # deduct shares and update or delete the UserStock
    user_stock.quantity -= quantity
    if user_stock.quantity == 0:
        db.session.delete(user_stock)
    else:
        db.session.add(user_stock)
    
    total_cost = current_price * quantity
    # create the sell transaction
    transaction = Transaction(
        user_id=user.id, stock_id=stock.id, transaction_type="sell",
        quantity=quantity, total_cost=total_cost, cost_per_share=current_price
    )
    db.session.add(transaction)
    db.session.commit()

    return jsonify({"message": f"Successfully sold {quantity} shares of {symbol}", "quantity": user_stock.quantity, "total_cost": transaction.total_cost})


# periods = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"]
# intervals = ["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo"]

def get_stock_data(symbol):
    stock = yf.Ticker(symbol)
    info = stock.get_info()

    # if stock does not exist
    if not info.get("symbol"):
        return None, []

    current_price = info.get("currentPrice")
    previous_close = info.get("previousClose")
    regular_market_change = round(current_price - previous_close, 2)
    regular_market_change_percent = round((regular_market_change / previous_close) * 100, 2)
    info["regularMarketChange"] = regular_market_change
    info["regularMarketChangePercent"] = regular_market_change_percent

    try:
        history = stock.history(period="1y", interval="1d")
        if history.empty:
            raise Exception()

        history.reset_index(inplace=True)
        history["Date"] = pd.to_datetime(history["Date"])

        data = history.apply(lambda row: [int(row["Date"].timestamp() * 1000), (0 if math.isnan(row["Close"]) else row["Close"])], axis=1).tolist()

        return info, data
    except Exception as e:
        logging.error(f"Error manipulating data: {str(e)}")
        return info, []

@stocks_blueprint.route("/<symbol>", methods=["GET"])
@jwt_required()
def get_stock(symbol: str):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    try:        
        symbol_uppercase = symbol.strip().upper()

        if not symbol_uppercase:
            return jsonify({"message": "Invalid stock symbol"}), 400
        
        info, data = get_stock_data(symbol=symbol_uppercase)

        if not info:
            return jsonify({"info": None, "data": [], "user_stock": None}), 200

        user_stock = db.session.query(UserStock).join(Stock).filter(UserStock.user_id == user.id, Stock.symbol == symbol_uppercase).first()

        if user_stock:
            user_stock = user_stock.to_dict()

        return jsonify({"info": info, "data": data, "user_stock": user_stock}), 200
    except Exception as e:
        logging.error(f"Error fetching stock: {str(e)}")
        return jsonify({ "message": "Something went wrong fetching stock data"}), 500

