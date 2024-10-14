# backend/routes/auth.py 

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from model import User, db
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not username or not email or not password:
        return jsonify({'msg': 'All fields are required.'}), 400

    # Check if user already exists
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        return jsonify({'msg': 'User already exists.'}), 400

    # Hash the password and create a new user
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'msg': 'User created successfully.'}), 201


@auth.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Validate input
    if not username or not password:
        return jsonify({'msg': 'Username and password are required.'}), 400

    # Fetch user by username
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'msg': 'Invalid username or password.'}), 401

    # Create a JWT token with role information
    access_token = create_access_token(identity={'username': user.username, 'role': user.role})

    return jsonify({'token': access_token}), 200
