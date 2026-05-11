import re
import secrets

from models.user import User
from extensions import db


def register_user(username, email, password):
    if User.query.filter_by(username=username).first():
        return None, "Username already taken"
    if User.query.filter_by(email=email).first():
        return None, "Email already registered"

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return user, None


def authenticate_user(username, password):
    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return None, "Invalid username or password"
    return user, None


def _username_from_google_profile(email, name):
    base = (name or email.split("@")[0]).strip().lower()
    base = re.sub(r"[^a-z0-9_]+", "_", base).strip("_") or "google_user"
    username = base[:70]
    suffix = 1

    while User.query.filter_by(username=username).first():
        suffix += 1
        username = f"{base[:65]}_{suffix}"

    return username


def find_or_create_google_user(email, name):
    user = User.query.filter_by(email=email).first()
    if user:
        return user

    user = User(
        username=_username_from_google_profile(email, name),
        email=email,
    )
    user.set_password(secrets.token_urlsafe(32))
    db.session.add(user)
    db.session.commit()
    return user
