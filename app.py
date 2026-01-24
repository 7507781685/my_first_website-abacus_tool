from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sqlite3
from flask import render_template
from werkzeug.security import generate_password_hash, check_password_hash
import json
import random
otp_store = {}  # temporary storage

app = Flask(__name__)
CORS(app)

DB_NAME = "pranit.db"

# Create database + table
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reg_no TEXT,
            email TEXT UNIQUE,
            phone TEXT UNIQUE,
            password TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# REGISTER API
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    reg_no = data.get("regNo")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    if not email or not phone or not password:
        return jsonify({"error": "Missing required fields"}), 400

    hashed_password = generate_password_hash(password)

    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (reg_no, email, phone, password) VALUES (?, ?, ?, ?)",
            (reg_no, email, phone, hashed_password)
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Registration successful"})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email or Phone already registered"}), 409


# LOGIN API
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    login_id = data.get("loginId")
    password = data.get("password")

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT password FROM users WHERE email=? OR phone=?",
        (login_id, login_id)
    )
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user[0], password):
        return jsonify({"message": "Login successful"})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route("/")
def index_page():
    return render_template("index.html")

@app.route("/login-page")
def login_page():
    return render_template("login.html")

@app.route("/levels")
def levels_page():
    return render_template("level.html")

@app.route("/start-test", methods=["POST"])
def start_test():
    level = request.form.get("level")
    return render_template("test.html", level=level)

'''result route'''

@app.route("/result")
def result_page():
    return render_template("result.html")

@app.route("/forgot-password-page")
def forgot_password_page():
    return render_template("forgot_password.html")

#Verify OTP + Reset Password
@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json
    contact = data.get("contact")

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id FROM users WHERE email=? OR phone=?",
        (contact, contact)
    )
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    otp = str(random.randint(100000, 999999))
    otp_store[contact] = otp

    print("OTP (for testing):", otp)  # simulate SMS/Email

    return jsonify({"message": "OTP sent"})
@app.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    contact = data.get("contact")
    otp = data.get("otp")
    new_password = data.get("newPassword")

    # Debug (optional)
    print("Stored OTP:", otp_store.get(contact))
    print("Entered OTP:", otp)

    if otp_store.get(contact) != otp:
        return jsonify({"error": "Invalid OTP"}), 401

    hashed = generate_password_hash(new_password)

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET password=? WHERE email=? OR phone=?",
        (hashed, contact, contact)
    )
    conn.commit()
    conn.close()

    otp_store.pop(contact, None)

    return jsonify({"message": "Password reset successful"})

if __name__ == "__main__":
    app.run(debug=True)
