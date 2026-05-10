from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.tag_service import get_all_tags, create_tag, update_tag, delete_tag

tags_bp = Blueprint("tags", __name__)


@tags_bp.route("/", methods=["GET"])
@jwt_required()
def list_tags():
    user_id = int(get_jwt_identity())
    tags = get_all_tags(user_id)
    return jsonify([t.to_dict() for t in tags]), 200


@tags_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "name is required"}), 400

    color = data.get("color", "#2DD4BF")
    tag = create_tag(user_id, name, color)
    return jsonify(tag.to_dict()), 201


@tags_bp.route("/<int:tag_id>", methods=["PUT"])
@jwt_required()
def update(tag_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "name" in data:
        data["name"] = (data.get("name") or "").strip()
        if not data["name"]:
            return jsonify({"error": "name is required"}), 400

    tag, error = update_tag(user_id, tag_id, data)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(tag.to_dict()), 200


@tags_bp.route("/<int:tag_id>", methods=["DELETE"])
@jwt_required()
def delete(tag_id):
    user_id = int(get_jwt_identity())
    success, error = delete_tag(user_id, tag_id)
    if not success:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Tag deleted"}), 200
