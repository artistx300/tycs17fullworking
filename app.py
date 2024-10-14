# app.py

from flask import Flask
from flask_jwt_extended import JWTManager
from model import db, User
from routes.auth import auth
from config import Config
from flask_cors import CORS
from werkzeug.security import generate_password_hash

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  

# Initialize database
db.init_app(app)

# Initialize JWT manager
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth)

# Create database tables and admin user
with app.app_context():
    db.create_all()  # Create database tables

    # Check if admin user exists
    admin_user = User.query.filter_by(username='admin').first()
    if not admin_user:
        hashed_password = generate_password_hash('AdminPass100')  # Replace with a secure password
        admin_user = User(
            username='admin',
            email='admin@example.com',
            password=hashed_password,
            role='admin'  # Assign admin role
        )
        db.session.add(admin_user)
        db.session.commit()

# Error handling for JWT
@jwt.unauthorized_loader
def unauthorized_response(callback):
    return {'msg': 'Missing authorization header'}, 401

@jwt.invalid_token_loader
def invalid_token_response(callback):
    return {'msg': 'Invalid token'}, 401

@jwt.expired_token_loader
def expired_token_response(callback):
    return {'msg': 'Token has expired'}, 401

if __name__ == '__main__':
    app.run(debug=True)
