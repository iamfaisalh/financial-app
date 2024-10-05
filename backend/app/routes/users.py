from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User, UserStock, Transaction
from sqlalchemy import desc

users_blueprint = Blueprint("users", __name__)

@users_blueprint.route("/me/portfolio", methods=["GET"])
@jwt_required()
def get_portfolio():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    user_stocks = UserStock.query.filter_by(user_id=user.id).all()

    portfolio = [user_stock.to_dict() for user_stock in user_stocks]
 
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

