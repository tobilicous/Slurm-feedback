import React, { useState, useEffect } from "react";
import "../styles/VideoPair.css";

const VideoPair = () => {
  const [videos, setVideos] = useState([]); // Stores video data
  const [currentPair, setCurrentPair] = useState(0); // Tracks the current video pair
  const user_email = localStorage.getItem("email"); // Get the user's email from localStorage

  // Fetch videos from the backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  // Handle voting logic
  const handleVote = (preferredVideoId, video1Rating, video2Rating) => {
    const voteData = {
      user_email, // User's email
      pair_id: `${videos[currentPair].id}-${videos[currentPair + 1].id}`, // Pair ID
      video1_id: videos[currentPair].id,
      video2_id: videos[currentPair + 1].id,
      video1_rating: video1Rating, // User-provided rating for video 1
      video2_rating: video2Rating, // User-provided rating for video 2
      preferred_video_id: preferredVideoId, // User-selected preferred video
    };

    fetch("http://127.0.0.1:5000/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voteData),
    })
      .then((res) => res.json())
      .then(() => {
        if (currentPair + 2 < videos.length) {
          setCurrentPair(currentPair + 2); // Move to the next pair
        } else {
          alert("Thank you for voting! All pairs are complete.");
        }
      })
      .catch((error) => console.error("Error submitting vote:", error));
  };

  if (videos.length < 2) return <h1>Loading videos...</h1>; // Ensure there are enough videos to display

  // State for ratings
  const [video1Rating, setVideo1Rating] = useState(0);
  const [video2Rating, setVideo2Rating] = useState(0);

  return (
    <div className="video-pair-container">
      <h1>Welcome, {user_email}</h1>
      <div className="video-container">
        {/* Video 1 */}
        <div className="video-wrapper">
          <video src={videos[currentPair].url} controls />
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Rate Video A (1-5)"
            value={video1Rating}
            onChange={(e) => setVideo1Rating(parseInt(e.target.value) || 0)}
            className="rating-input"
          />
          <button
            onClick={() =>
              handleVote(videos[currentPair].id, video1Rating, video2Rating)
            }
            className="video-button"
          >
            Select Video A
          </button>
        </div>

        {/* Video 2 */}
        <div className="video-wrapper">
          <video src={videos[currentPair + 1].url} controls />
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Rate Video B (1-5)"
            value={video2Rating}
            onChange={(e) => setVideo2Rating(parseInt(e.target.value) || 0)}
            className="rating-input"
          />
          <button
            onClick={() =>
              handleVote(videos[currentPair + 1].id, video1Rating, video2Rating)
            }
            className="video-button"
          >
            Select Video B
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPair;
