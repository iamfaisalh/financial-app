from datetime import datetime
from ..extentions import db
import uuid

class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    stock_id = db.Column(db.String, db.ForeignKey("stocks.id"), nullable=False)
    transaction_type = db.Column(db.Enum("buy", "sell", name="transaction_type"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    cost_per_share = db.Column(db.Numeric(15, 2), nullable=False)
    total_cost = db.Column(db.Numeric(15, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship("User", back_populates="transactions")
    stock = db.relationship("Stock", back_populates="transactions")

    def to_dict(self):
        return {
            "id": self.id,
            "stock_id": self.stock_id,
            "transaction_type": self.transaction_type,
            "quantity": self.quantity,
            "cost_per_share": self.cost_per_share,
            "total_cost": self.total_cost,
            "created_at": self.created_at,
            "stock": self.stock.to_dict()
        }
    
