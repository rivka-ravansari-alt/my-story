from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.exercise_template_service import get_all_templates, create_template, delete_template

exercise_templates_bp = Blueprint("exercise_templates", __name__)

ALLOWED_FIELD_TYPES = {"text", "long_text"}


def normalize_fields(raw_fields):
    if not isinstance(raw_fields, list):
        return None, "fields must be a list"

    fields = []
    for index, field in enumerate(raw_fields):
        if not isinstance(field, dict):
            return None, f"field {index + 1} must be an object"

        label = (field.get("label") or "").strip()
        placeholder = (field.get("placeholder") or "").strip()
        field_type = field.get("type") or "text"

        if not label:
            return None, f"field {index + 1} label is required"
        if field_type not in ALLOWED_FIELD_TYPES:
            return None, "field type must be text or long_text"

        fields.append(
            {
                "id": field.get("id") or f"field-{index + 1}",
                "label": label,
                "placeholder": placeholder,
                "type": field_type,
            }
        )

    if not fields:
        return None, "at least one field is required"

    return fields, None


@exercise_templates_bp.route("/", methods=["GET"])
@jwt_required()
def list_templates():
    user_id = int(get_jwt_identity())
    templates = get_all_templates(user_id)
    return jsonify([template.to_dict() for template in templates]), 200


@exercise_templates_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    name = (data.get("name") or "").strip()
    description = (data.get("description") or "").strip()
    fields, error = normalize_fields(data.get("fields"))

    if not name:
        return jsonify({"error": "name is required"}), 400
    if error:
        return jsonify({"error": error}), 400

    template = create_template(user_id, name, description, fields)
    return jsonify(template.to_dict()), 201


@exercise_templates_bp.route("/<int:template_id>", methods=["DELETE"])
@jwt_required()
def delete(template_id):
    user_id = int(get_jwt_identity())
    success, error = delete_template(user_id, template_id)
    if not success:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Template deleted"}), 200
