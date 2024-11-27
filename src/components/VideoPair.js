

const handleVote = (preferredVideoId) => {
  const voteData = {
    user_email: localStorage.getItem("email"), // User's email
    pair_id: `${videos[currentPair].id}-${videos[currentPair + 1].id}`, // Pair ID
    video1_id: videos[currentPair].id,
    video2_id: videos[currentPair + 1].id,
    preferred_video_id: preferredVideoId,
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
        alert("Thank you for voting!");
      }
    })
    .catch((error) => console.error("Error:", error));
};
