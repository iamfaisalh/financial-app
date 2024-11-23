from os import getenv
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    SECRET_KEY = getenv("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    OPENAI_API_KEY= getenv("OPENAI_API_KEY")
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_ACCESS_COOKIE_PATH = "/"
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_SECRET_KEY = getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    ALLOWED_ORIGINS = getenv("ALLOWED_ORIGINS") or ""


class DevelopmentConfig(Config):
    DEBUG = True
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_COOKIE_SECURE = False


class ProductionConfig(Config):
    DEBUG = False
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_COOKIE_SECURE = True


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig
}
