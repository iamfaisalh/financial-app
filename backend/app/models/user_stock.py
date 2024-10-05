from datetime import datetime
from ..extentions import db
import uuid

class UserStock(db.Model):
    __tablename__ = "user_stocks"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    stock_id = db.Column(db.String, db.ForeignKey("stocks.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    user = db.relationship("User", back_populates="user_stocks")
    stock = db.relationship("Stock")
    transactions = db.relationship("Transaction", secondary="stocks", viewonly=True)

    def to_dict(self, include_transactions=False):
        user_stock_data = {
            "id": self.id,
            "user_id": self.user_id,
            "stock_id": self.stock_id,
            "quantity": self.quantity,
            "stock": self.stock.to_dict()
        }
        
        if include_transactions:
            user_stock_data["transactions"] = [transaction.to_dict() for transaction in self.transactions]
        
        return user_stock_data

