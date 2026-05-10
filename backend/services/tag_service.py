from models.tag import Tag
from extensions import db


def get_all_tags(user_id):
    return Tag.query.filter_by(user_id=user_id).order_by(Tag.name).all()


def create_tag(user_id, name, color="#2DD4BF"):
    tag = Tag(user_id=user_id, name=name, color=color)
    db.session.add(tag)
    db.session.commit()
    return tag


def update_tag(user_id, tag_id, data):
    tag = Tag.query.filter_by(id=tag_id, user_id=user_id).first()
    if not tag:
        return None, "Tag not found"

    if "name" in data:
        tag.name = data["name"].strip()
    if "color" in data:
        tag.color = data["color"]

    db.session.commit()
    return tag, None


def delete_tag(user_id, tag_id):
    tag = Tag.query.filter_by(id=tag_id, user_id=user_id).first()
    if not tag:
        return False, "Tag not found"
    tag.events.clear()
    db.session.delete(tag)
    db.session.commit()
    return True, None
