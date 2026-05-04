from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
    return jsonify({"message": "Welcome to My Story API"})


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/api/stories")
def get_stories():
    stories = [
        {"id": 1, "title": "My First Story", "content": "Once upon a time..."},
        {"id": 2, "title": "Another Adventure", "content": "It was a dark and stormy night..."},
    ]
    return jsonify(stories)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
