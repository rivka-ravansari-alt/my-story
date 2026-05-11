from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.exercise_service import get_all_exercises, create_exercise, delete_exercise

exercises_bp = Blueprint("exercises", __name__)

ALLOWED_FREQUENCIES = {"daily", "weekly", "monthly", "custom"}


@exercises_bp.route("/", methods=["GET"])
@jwt_required()
def list_exercises():
    user_id = int(get_jwt_identity())
    exercises = get_all_exercises(user_id)
    return jsonify([exercise.to_dict() for exercise in exercises]), 200


@exercises_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    name = (data.get("name") or "").strip()
    frequency = data.get("frequency") or "daily"
    schedule_time = (data.get("schedule_time") or "").strip()
    template_id = data.get("template_id")
    answers = data.get("answers") or {}

    if not name:
        return jsonify({"error": "name is required"}), 400
    if not template_id:
        return jsonify({"error": "template_id is required"}), 400
    if frequency not in ALLOWED_FREQUENCIES:
        return jsonify({"error": "frequency must be daily, weekly, monthly, or custom"}), 400
    if not isinstance(answers, dict):
        return jsonify({"error": "answers must be an object"}), 400

    try:
        template_id = int(template_id)
    except (TypeError, ValueError):
        return jsonify({"error": "template_id must be a number"}), 400

    exercise, error = create_exercise(user_id, template_id, name, frequency, schedule_time, answers)
    if error:
        return jsonify({"error": error}), 404

    return jsonify(exercise.to_dict()), 201


@exercises_bp.route("/<int:exercise_id>", methods=["DELETE"])
@jwt_required()
def delete(exercise_id):
    user_id = int(get_jwt_identity())
    success, error = delete_exercise(user_id, exercise_id)
    if not success:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Exercise deleted"}), 200
