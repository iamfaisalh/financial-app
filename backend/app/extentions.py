from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_socketio  import SocketIO
from openai import OpenAI
from os import getenv

cors = CORS()
db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()
socketio = SocketIO()
openaiClient = OpenAI(api_key=getenv("OPENAI_API_KEY"))
