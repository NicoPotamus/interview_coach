# Import necessary modules for authentication, JWT handling, password hashing, and database access
from fastapi import Depends, HTTPException
from fastapi_jwt_auth import AuthJWT  # JWT authentication dependency
from fastapi_jwt_auth.exceptions import AuthJWTException  # Handles JWT-related exceptions
from passlib.hash import bcrypt  # Secure password hashing
from .database import SessionLocal  # SQLAlchemy session factory
from .models import User  # SQLAlchemy User model

# Dependency: Database session provider
def get_db():
    """
    Provides a SQLAlchemy session for interacting with the database.
    Ensures the session is closed after request handling.
    """
    db = SessionLocal()
    try:
        yield db  # Yield the session for use in routes or dependencies
    finally:
        db.close()  # Always close the session to avoid resource leaks

# Hash a plaintext password using bcrypt
def hash_password(password: str) -> str:
    """
    Hashes a plaintext password using bcrypt.
    Returns the hashed password string.
    """
    return bcrypt.hash(password)

# Verify a plaintext password against a hashed password
def verify_password(password: str, hashed: str) -> bool:
    """
    Verifies that a plaintext password matches its hashed version.
    Returns True if they match, False otherwise.
    """
    return bcrypt.verify(password, hashed)

# Retrieves the current authenticated user based on the JWT token
def get_current_user(Authorize: AuthJWT = Depends(), db=Depends(get_db)):
    """
    Validates the user's JWT and retrieves the corresponding user from the database.

    Parameters:
        Authorize: The JWT dependency that validates and extracts token data.
        db: The SQLAlchemy session.

    Raises:
        HTTPException with 401 status code if the token is invalid or user not found.

    Returns:
        The authenticated User object.
    """
    try:
        # Ensure the request includes a valid JWT token
        Authorize.jwt_required()

        # Extract the user's email (subject) from the token
        user_email = Authorize.get_jwt_subject()

        # Query the user from the database using the extracted email
        user = db.query(User).filter(User.email == user_email).first()

        # If the user does not exist, raise an Unauthorized exception
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user  # Return the authenticated user

    except AuthJWTException as e:
        # If the JWT is invalid or expired, raise an Unauthorized error
        raise HTTPException(status_code=401, detail=str(e))