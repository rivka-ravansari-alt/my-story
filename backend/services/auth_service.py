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
