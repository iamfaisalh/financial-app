from datetime import datetime
from ..extentions import bcrypt, db
import uuid

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    user_stocks = db.relationship("UserStock", back_populates="user")
    transactions = db.relationship("Transaction", back_populates="user")

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self, include_user_stocks=False, include_transactions=False):
        user_data = {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "created_at": self.created_at
        }

        if include_user_stocks:
            user_data["user_stocks"] = [user_stock.to_dict() for user_stock in self.user_stocks]
        
        if include_transactions:
            user_data["transactions"] = [transaction.to_dict() for transaction in self.transactions]
        
        return user_data

