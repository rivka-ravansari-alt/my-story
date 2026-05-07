from extensions import db

event_tags = db.Table(
    "event_tags",
    db.Column("event_id", db.Integer, db.ForeignKey("events.id"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
)
