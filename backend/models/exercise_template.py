from datetime import datetime
from extensions import db


class ExerciseTemplate(db.Model):
    __tablename__ = "exercise_templates"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, default="")
    fields = db.Column(db.JSON, default=list, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    exercises = db.relationship("Exercise", backref="template", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description or "",
            "fields": self.fields or [],
            "created_at": self.created_at.isoformat(),
            "user_id": self.user_id,
        }
