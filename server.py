from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# File paths
DATA_DIR = "data"
USERS_FILE = os.path.join(DATA_DIR, "users.json")
VIDEOS_FILE = os.path.join(DATA_DIR, "videos.json")
VOTES_FILE = os.path.join(DATA_DIR, "votes.json")

# Helper functions to load and save JSON
def load_json(file_path):
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            return json.load(f)
    return []

def save_json(file_path, data):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)  # Ensure directory exists
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    if os.path.exists(f"./build/{path}"):
        return send_from_directory("./build", path)
    return send_from_directory("./build", "index.html")

# Default route
@app.route("/", methods=["GET"])
def home():
    return """
    <h1>Welcome to the Voting System API</h1>
    <p>Available endpoints:</p>
    <ul>
        <li><strong>POST /signup</strong> - Register a new user</li>
        <li><strong>GET /videos</strong> - Retrieve all videos</li>
        <li><strong>POST /vote</strong> - Submit a vote</li>
        <li><strong>GET /admin/report</strong> - Retrieve aggregated voting report</li>
        <li><strong>POST /admin/upload</strong> - Upload a new video (Admin)</li>
    </ul>
    """

# User signup
@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        if not data or "name" not in data or "email" not in data:
            return jsonify({"error": "Missing 'name' or 'email' field"}), 400

        print("Received signup data:", data)

        # Load existing users
        users = load_json(USERS_FILE)
        if any(user["email"] == data["email"] for user in users):
            return jsonify({"message": "User already exists"}), 400

        # Register new user
        new_user = {"name": data["name"], "email": data["email"], "votes": []}
        users.append(new_user)
        save_json(USERS_FILE, users)

        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        print("Error during signup:", e)
        return jsonify({"error": "Internal server error"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    return "OK", 200

# Admin upload a video
@app.route("/admin/upload", methods=["POST"])
def admin_upload():
    try:
        data = request.json
        if not data or "title" not in data or "url" not in data:
            return jsonify({"error": "Missing 'title' or 'url' field"}), 400

        print("Received video upload data:", data)

        videos = load_json(VIDEOS_FILE)
        new_video = {
            "id": len(videos) + 1,
            "title": data["title"],
            "url": data["url"]
        }
        videos.append(new_video)
        save_json(VIDEOS_FILE, videos)

        return jsonify({"message": "Video uploaded successfully!"}), 201
    except Exception as e:
        print("Error during video upload:", e)
        return jsonify({"error": "Internal server error"}), 500

# Get all videos
@app.route("/videos", methods=["GET"])
def get_videos():
    try:
        videos = load_json(VIDEOS_FILE)
        return jsonify(videos), 200
    except Exception as e:
        print("Error fetching videos:", e)
        return jsonify({"error": "Internal server error"}), 500

# Record a vote
@app.route("/vote", methods=["POST"])
def vote():
    try:
        data = request.get_json()
        if not data or "video1_id" not in data or "video2_id" not in data or "preferred_video_id" not in data:
            return jsonify({"error": "Missing required vote fields"}), 400

        print("Received vote data:", data)

        votes = load_json(VOTES_FILE)
        votes.append(data)
        save_json(VOTES_FILE, votes)

        return jsonify({"message": "Vote recorded successfully!"}), 201
    except Exception as e:
        print("Error during voting:", e)
        return jsonify({"error": "Internal server error"}), 500

# Admin report for voting results
@app.route("/admin/report", methods=["GET"])
def admin_report():
    try:
        votes = load_json(VOTES_FILE)
        video_preferences = {}

        for vote in votes:
            pair_key = f"{vote['video1_id']}-{vote['video2_id']}"
            if pair_key not in video_preferences:
                video_preferences[pair_key] = {
                    "video1_id": vote["video1_id"],
                    "video2_id": vote["video2_id"],
                    "video1_votes": 0,
                    "video2_votes": 0,
                    "total_votes": 0,
                }

            if vote["preferred_video_id"] == vote["video1_id"]:
                video_preferences[pair_key]["video1_votes"] += 1
            elif vote["preferred_video_id"] == vote["video2_id"]:
                video_preferences[pair_key]["video2_votes"] += 1

            video_preferences[pair_key]["total_votes"] += 1

        return jsonify({"aggregated": video_preferences}), 200
    except Exception as e:
        print("Error generating report:", e)
        return jsonify({"error": "Internal server error"}), 500

# Run the app
if __name__ == "__main__":
    os.makedirs(DATA_DIR, exist_ok=True)  # Ensure data directory exists
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
