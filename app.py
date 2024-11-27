from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow all cross-origin requests


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
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)

# Default route
@app.route("/", methods=["GET"])
def home():
    return """
    <h1>Welcome to the Voting System API</h1>
    <p>Available endpoints:</p>
    <ul>
        <li><strong>GET /videos</strong> - Retrieve all video data</li>
        <li><strong>POST /vote</strong> - Submit a vote for a video pair</li>
        <li><strong>GET /admin/report</strong> - Retrieve voting report (Admin only)</li>
    </ul>
    <p>This is the default route for the API.</p>
    """
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    print("Received data:", data)  # Debug log

    # Load existing users
    users = load_json(USERS_FILE)

    # Check if user already exists
    if any(user["email"] == data["email"] for user in users):
        return jsonify({"message": "User already exists"}), 400

    # Add the new user
    new_user = {"name": data["name"], "email": data["email"], "votes": []}
    users.append(new_user)
    save_json(USERS_FILE, users)

    return jsonify({"message": "User registered successfully!"})
# Load videos
@app.route("/videos", methods=["GET"])
def get_videos():
    videos = load_json(VIDEOS_FILE)
    return jsonify(videos)

# Record a vote
@app.route("/vote", methods=["POST"])
def vote():
    data = request.json
    votes = load_json(VOTES_FILE)

    # Add new vote data
    votes.append(data)
    save_json(VOTES_FILE, votes)

    return jsonify({"message": "Vote recorded successfully!"})

# Admin report
@app.route("/admin/report", methods=["GET"])
def admin_report():
    votes = load_json(VOTES_FILE)
    video_preferences = {}

    # Aggregate results for each pair
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

        # Count the votes
        if vote["preferred_video_id"] == vote["video1_id"]:
            video_preferences[pair_key]["video1_votes"] += 1
        elif vote["preferred_video_id"] == vote["video2_id"]:
            video_preferences[pair_key]["video2_votes"] += 1

        video_preferences[pair_key]["total_votes"] += 1

    return jsonify({
        "votes": votes,  # Individual votes
        "aggregated": video_preferences  # Aggregated results by pair
    })

if __name__ == "__main__":
    app.run(debug=True)
