from datetime import datetime
from extensions import db
from models.event_tag import event_tags


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, default="")
    event_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    tags = db.relationship(
        "Tag",
        secondary=event_tags,
        lazy="subquery",
        backref=db.backref("events", lazy=True),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "event_date": self.event_date.isoformat() if self.event_date else None,
            "created_at": self.created_at.isoformat(),
            "user_id": self.user_id,
            "tags": [t.to_dict() for t in self.tags],
        }

    def to_preview_dict(self):
        content = self.content or ""
        preview = content.strip()
        if len(preview) > 140:
            preview = preview[:137].rstrip() + "..."

        return {
            "id": self.id,
            "title": self.title,
            "preview": preview,
            "event_date": self.event_date.isoformat() if self.event_date else None,
            "created_at": self.created_at.isoformat(),
            "tags": [t.to_dict() for t in self.tags],
        }
