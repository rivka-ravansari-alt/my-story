from models.exercise import Exercise
from models.exercise_template import ExerciseTemplate
from extensions import db


def get_all_templates(user_id):
    return ExerciseTemplate.query.filter_by(user_id=user_id).order_by(ExerciseTemplate.created_at.desc()).all()


def get_template_by_id(user_id, template_id):
    return ExerciseTemplate.query.filter_by(id=template_id, user_id=user_id).first()


def create_template(user_id, name, description, fields):
    template = ExerciseTemplate(
        user_id=user_id,
        name=name,
        description=description,
        fields=fields,
    )
    db.session.add(template)
    db.session.commit()
    return template


def delete_template(user_id, template_id):
    template = get_template_by_id(user_id, template_id)
    if not template:
        return False, "Template not found"

    Exercise.query.filter_by(user_id=user_id, template_id=template_id).update({"template_id": None})
    db.session.delete(template)
    db.session.commit()
    return True, None
