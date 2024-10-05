from datetime import datetime
import uuid
from ..extentions import db

class Stock(db.Model):
    __tablename__ = "stocks"

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    symbol = db.Column(db.String(10), unique=True, nullable=False)
    company_name = db.Column(db.String(150), nullable=False)
    industry = db.Column(db.String(150), nullable=False)
    sector = db.Column(db.String(150), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    transactions = db.relationship("Transaction", back_populates="stock")

    def to_dict(self):
        return {
            "id": self.id,
            "symbol": self.symbol,
            "company_name": self.company_name,
            "industry": self.industry,
            "sector": self.sector,
        }

