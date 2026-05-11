from flask import Blueprint, current_app, request, jsonify
from flask_jwt_extended import create_access_token
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from services.auth_service import register_user, authenticate_user, find_or_create_google_user

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    if not username or not email or not password:
        return jsonify({"error": "username, email, and password are required"}), 400

    user, error = register_user(username, email, password)
    if error:
        return jsonify({"error": error}), 409

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return jsonify({"error": "username and password are required"}), 400

    user, error = authenticate_user(username, password)
    if error:
        return jsonify({"error": error}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route("/google", methods=["POST"])
def google_login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    google_id_token = data.get("idToken") or ""
    if not google_id_token:
        return jsonify({"error": "Google ID token is required"}), 400

    client_id = current_app.config.get("GOOGLE_CLIENT_ID")
    if not client_id:
        return jsonify({"error": "Google login is not configured"}), 500

    try:
        profile = id_token.verify_oauth2_token(
            google_id_token,
            google_requests.Request(),
            client_id,
        )
    except ValueError:
        return jsonify({"error": "Invalid Google login token"}), 401

    email = profile.get("email")
    if not email:
        return jsonify({"error": "Google account email is required"}), 400

    user = find_or_create_google_user(
        email=email,
        name=profile.get("name") or email.split("@")[0],
    )
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200
