from models.event import Event
from models.tag import Tag
from extensions import db


def get_all_events(user_id):
    return Event.query.filter_by(user_id=user_id).order_by(Event.event_date.desc()).all()


def get_events_by_date(user_id, event_date):
    return Event.query.filter_by(user_id=user_id, event_date=event_date).all()


def get_event_by_id(user_id, event_id):
    return Event.query.filter_by(id=event_id, user_id=user_id).first()


def create_event(user_id, title, content, event_date, tag_ids=None):
    event = Event(user_id=user_id, title=title, content=content, event_date=event_date)
    if tag_ids:
        tags = Tag.query.filter(Tag.id.in_(tag_ids), Tag.user_id == user_id).all()
        event.tags = tags
    db.session.add(event)
    db.session.commit()
    return event


def update_event(user_id, event_id, data):
    event = get_event_by_id(user_id, event_id)
    if not event:
        return None, "Event not found"

    if "title" in data:
        event.title = data["title"]
    if "content" in data:
        event.content = data["content"]
    if "event_date" in data:
        event.event_date = data["event_date"]
    if "tag_ids" in data:
        tags = Tag.query.filter(Tag.id.in_(data["tag_ids"]), Tag.user_id == user_id).all()
        event.tags = tags

    db.session.commit()
    return event, None


def delete_event(user_id, event_id):
    event = get_event_by_id(user_id, event_id)
    if not event:
        return False, "Event not found"
    event.tags.clear()
    db.session.delete(event)
    db.session.commit()
    return True, None
