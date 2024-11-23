from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, UserStock, Transaction
from sqlalchemy import desc
import yfinance as yf
from ..extentions import openaiClient
users_blueprint = Blueprint("users", __name__)

@users_blueprint.route("/me/portfolio/analyze", methods=["GET"])
@jwt_required()
def get_portfolio_analysis():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    user_stocks = UserStock.query.filter_by(user_id=user.id).all()

    prompt_stock_data = ""

    for user_stock in user_stocks:
        stock = user_stock.stock
        prompt_stock_data += f'{user_stock.quantity} {stock.symbol} '

    prompt = f"""
    I will give you my stock portfolio, I need a response to 3 questions 
    and the response should be 1 sentence for each question and keep in mind 
    that the max tokens should be 150. I have {prompt_stock_data}. 
    The questions are 'What is good about portfolio?', 'What can be improved?', 
    Can I get a couple of example tickers to improve my portfolio?' The response 
    should be in the following format and separate each response with a newline character: 
    1. <Answer for question 1>.
    2. <Answer for question 2>.
    3. <Answer for question 3>.
    """
    
    response = openaiClient.completions.create(
        model="gpt-3.5-turbo-instruct",
        prompt=prompt,
        max_tokens=150
        )
    
    analysis = response.choices[0].text.strip().split("\n")
    return jsonify({"analysis": analysis}), 200


@users_blueprint.route("/me/portfolio", methods=["GET"])
@jwt_required()
def get_portfolio():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    user_stocks = UserStock.query.filter_by(user_id=user.id).all()

    ticker_string = ""
    for user_stock in user_stocks:
        stock = user_stock.stock
        ticker_string += stock.symbol + " "

    tickers = yf.Tickers(ticker_string)

    portfolio = [user_stock.to_dict() for user_stock in user_stocks]

    for item in portfolio:
        stock = item["stock"]
        info = tickers.tickers.get(stock["symbol"]).get_info()
        website = info.get("website")
        item["website"] = website

    return jsonify(portfolio), 200


@users_blueprint.route("/me/transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    # get user's transactions and sort in descending order
    transactions = Transaction.query.filter_by(user_id=user.id).order_by(desc(Transaction.created_at))

    paginated_transactions = transactions.paginate(page=page, per_page=per_page, error_out=False)

    # convert transactions to dict
    transactions = [transaction.to_dict() for transaction in paginated_transactions.items]

    return jsonify({
        "transactions": transactions,
        "page": paginated_transactions.page,
        "per_page": paginated_transactions.per_page,
        "total_transactions": paginated_transactions.total,
        "has_next": paginated_transactions.has_next,
        "has_prev": paginated_transactions.has_prev
    }), 200

