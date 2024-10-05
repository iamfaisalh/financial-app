from .auth import auth_blueprint
from .stocks import stocks_blueprint
from .users import users_blueprint

def register_routes(app):
    app.register_blueprint(auth_blueprint, url_prefix="/api/auth")
    app.register_blueprint(stocks_blueprint, url_prefix="/api/stocks")
    app.register_blueprint(users_blueprint, url_prefix="/api/users")

