from models.exercise import Exercise
from services.exercise_template_service import get_template_by_id
from extensions import db


def get_all_exercises(user_id):
    return Exercise.query.filter_by(user_id=user_id).order_by(Exercise.created_at.desc()).all()


def create_exercise(user_id, template_id, name, frequency, schedule_time, answers):
    template = get_template_by_id(user_id, template_id)
    if not template:
        return None, "Template not found"

    exercise = Exercise(
        user_id=user_id,
        template_id=template.id,
        name=name,
        frequency=frequency,
        schedule_time=schedule_time,
        answers=answers,
        template_name=template.name,
        template_fields=template.fields or [],
    )
    db.session.add(exercise)
    db.session.commit()
    return exercise, None


def delete_exercise(user_id, exercise_id):
    exercise = Exercise.query.filter_by(id=exercise_id, user_id=user_id).first()
    if not exercise:
        return False, "Exercise not found"

    db.session.delete(exercise)
    db.session.commit()
    return True, None
