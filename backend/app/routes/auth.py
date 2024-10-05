from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, unset_access_cookies, get_jwt_identity
from ..models import User
from ..extentions import db
import logging
import re

auth_blueprint = Blueprint("auth", __name__)

def is_valid_email(email):
    pattern = r'^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
    return re.match(pattern, email) is not None


@auth_blueprint.route("/signup", methods=["POST"])
def signup():
    body = request.get_json()
    email = body.get("email").strip().lower()
    password = body.get("password").strip()
    first_name = body.get("first_name").strip()
    last_name = body.get("last_name").strip()

    if not is_valid_email(email) or not password or not first_name or not last_name:
        return jsonify({"message": "Missing a required field"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    user = User(email=email, first_name=first_name, last_name=last_name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)

    response = jsonify(user.to_dict())
    set_access_cookies(response, access_token, max_age=60 * 60 * 24 * 7)
    return response


@auth_blueprint.route("/login", methods=["POST"])
def login():
    body = request.get_json()    
    email = body.get("email").strip().lower()
    password = body.get("password").strip()

    if not is_valid_email(email) or not password:
        return jsonify({"message": "Missing a required field"}), 400

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        response = jsonify(user.to_dict())
        set_access_cookies(response, access_token, max_age=60 * 60 * 24 * 7)
        return response

    return jsonify({"message": "Invalid email or password"}), 400


@auth_blueprint.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"message": "Successfully logged out"})
    unset_access_cookies(response)
    
    return response


@auth_blueprint.route("/validate", methods=["GET"])
@jwt_required(optional=True)
def check_session():
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"is_authenticated": False, "user": None })
        
        user = User.query.get(current_user_id)
        if not user:
            response = jsonify({"is_authenticated": False, "user": None })
            unset_access_cookies(response)
            return response

        return jsonify({"is_authenticated": True, "user": user.to_dict()})
    except Exception as e:
        logging.error(f"Error fetching user with ID {current_user_id}: {str(e)}")
        return jsonify({ "message": "Something went wrong"}), 500

