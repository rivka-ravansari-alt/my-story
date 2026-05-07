from datetime import date
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.event_service import (
    get_all_events,
    get_events_by_date,
    get_event_by_id,
    create_event,
    update_event,
    delete_event,
)

events_bp = Blueprint("events", __name__)


@events_bp.route("/", methods=["GET"])
@jwt_required()
def list_events():
    user_id = int(get_jwt_identity())
    events = get_all_events(user_id)
    return jsonify([e.to_preview_dict() for e in events]), 200


@events_bp.route("/by-date/<string:event_date>", methods=["GET"])
@jwt_required()
def events_by_date(event_date):
    user_id = int(get_jwt_identity())
    try:
        parsed_date = date.fromisoformat(event_date)
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    events = get_events_by_date(user_id, parsed_date)
    return jsonify([e.to_dict() for e in events]), 200


@events_bp.route("/<int:event_id>", methods=["GET"])
@jwt_required()
def get_event(event_id):
    user_id = int(get_jwt_identity())
    event = get_event_by_id(user_id, event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    return jsonify(event.to_dict()), 200


@events_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    title = (data.get("title") or "").strip()
    content = data.get("content", "")
    event_date_str = data.get("event_date")
    tag_ids = data.get("tag_ids", [])

    if not title:
        return jsonify({"error": "title is required"}), 400
    if not event_date_str:
        return jsonify({"error": "event_date is required (YYYY-MM-DD)"}), 400

    try:
        event_date = date.fromisoformat(event_date_str)
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    event = create_event(user_id, title, content, event_date, tag_ids)
    return jsonify(event.to_dict()), 201


@events_bp.route("/<int:event_id>", methods=["PUT"])
@jwt_required()
def update(event_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "event_date" in data:
        try:
            data["event_date"] = date.fromisoformat(data["event_date"])
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    event, error = update_event(user_id, event_id, data)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(event.to_dict()), 200


@events_bp.route("/<int:event_id>", methods=["DELETE"])
@jwt_required()
def delete(event_id):
    user_id = int(get_jwt_identity())
    success, error = delete_event(user_id, event_id)
    if not success:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Event deleted"}), 200
