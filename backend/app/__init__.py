from os import getenv
from flask import Flask, jsonify
from .routes import register_routes
from .extentions import db, migrate, jwt, cors, bcrypt, socketio
from .config import config
import logging

def create_app():
    app = Flask(__name__)

    # load config based on the environment
    config_mode = getenv("FLASK_ENV")
    app.config.from_object(config[config_mode])

    # initialize flask extentions
    cors.init_app(app, origins=app.config["ALLOWED_ORIGINS"], supports_credentials=True)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    socketio.init_app(app)
    bcrypt.init_app(app)

    # register blueprints
    register_routes(app)

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"message": "Resource not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logging.error(f"Error: {str(error)}")
        return jsonify({"message": "Something went wrong"}), 500
    
    @app.errorhandler(Exception)
    def handle_exception(e):
        logging.error(f"Error: {str(e)}")
        return jsonify({"message": "Something went wrong" }), 500

    return app

