import React, { useState, useEffect } from "react";
import "../styles/VideoPair.css";

const VideoPair = () => {
  const [videos, setVideos] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  const handleVote = (preferredVideoId) => {
    const currentPair = videos.slice(currentPairIndex, currentPairIndex + 2);
    if (currentPair.length < 2) {
      setMessage("No more pairs to vote on.");
      return;
    }

    const voteData = {
      video1_id: currentPair[0].id,
      video2_id: currentPair[1].id,
      preferred_video_id: preferredVideoId,
    };

    fetch("http://localhost:5001/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voteData),
    })
      .then((res) => res.json())
      .then(() => {
        if (currentPairIndex + 2 < videos.length) {
          setCurrentPairIndex(currentPairIndex + 2);
        } else {
          setMessage("Thank you for voting!");
        }
      })
      .catch((error) => {
        console.error("Error submitting vote:", error);
        setMessage("An error occurred. Please try again.");
      });
  };

  if (videos.length === 0) return <h1>Loading videos...</h1>;

  const currentPair = videos.slice(currentPairIndex, currentPairIndex + 2);
  if (currentPair.length < 2) return <h1>{message || "No more pairs available."}</h1>;

  return (
    <div className="video-pair-container">
      <h1>Vote on Videos</h1>
      <div className="video-container">
        <div>
          <video src={currentPair[0].url} controls />
          <button
            onClick={() => handleVote(currentPair[0].id)}
            className="video-button"
          >
            Vote for Video A
          </button>
        </div>
        <div>
          <video src={currentPair[1].url} controls />
          <button
            onClick={() => handleVote(currentPair[1].id)}
            className="video-button"
          >
            Vote for Video B
          </button>
        </div>
      </div>
      {message && <p className="video-pair-message">{message}</p>}
    </div>
  );
};

export default VideoPair;
