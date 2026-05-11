import sys
import os

# Ensure the backend directory is always on sys.path so that imports like
# "from config import Config" work regardless of the working directory
# (Flask's debug reloader may restart from a different CWD).
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import db, jwt, migrate
import models  # noqa: F401 — registers all ORM models with SQLAlchemy
from routes.auth import auth_bp
from routes.events import events_bp
from routes.tags import tags_bp
from routes.exercise_templates import exercise_templates_bp
from routes.exercises import exercises_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(tags_bp, url_prefix="/api/tags")
    app.register_blueprint(exercise_templates_bp, url_prefix="/api/exercise-templates")
    app.register_blueprint(exercises_bp, url_prefix="/api/exercises")

    @app.route("/")
    def index():
        return jsonify({"message": "Welcome to My Story API"})

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    """
    for validations
    """
    port = 8080
    app.run(host="0.0.0.0", port=port, debug=True)


