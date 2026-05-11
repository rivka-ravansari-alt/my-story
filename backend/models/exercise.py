from datetime import datetime
from extensions import db


class Exercise(db.Model):
    __tablename__ = "exercises"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False)
    frequency = db.Column(db.String(40), nullable=False)
    schedule_time = db.Column(db.String(80), default="")
    answers = db.Column(db.JSON, default=dict, nullable=False)
    template_name = db.Column(db.String(160), nullable=False)
    template_fields = db.Column(db.JSON, default=list, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey("exercise_templates.id"), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "frequency": self.frequency,
            "schedule_time": self.schedule_time or "",
            "answers": self.answers or {},
            "template_id": self.template_id,
            "template_name": self.template_name,
            "template_fields": self.template_fields or [],
            "created_at": self.created_at.isoformat(),
            "user_id": self.user_id,
        }
