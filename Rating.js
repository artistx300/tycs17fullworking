import React, { useState } from "react";
import "./Rating.css";

const Rating = ({ userRating, setUserRating, isAuthenticated, movieId }) => {
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleEmojiClick = (rating) => {
        if (isAuthenticated) {
            const newRating = userRating === rating ? 0 : rating;
            setUserRating(newRating);

            // Store the rating in local storage
            localStorage.setItem(`rating_movie_${movieId}`, newRating);
        } else {
            alert("Please sign in to rate this movie.");
            window.location.href = "/sign-in"; // Redirect to sign-in page
        }
    };

    const renderEmojis = () => {
        const emojiUrl = "https://static-00.iconduck.com/assets.00/popcorn-emoji-327x512-4wgylinf.png";
        return (
            <div className="emojiRating">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <img
                        key={rating}
                        src={emojiUrl}
                        alt={`Rate ${rating}`}
                        className={`emoji ${userRating >= rating ? "selected" : ""}`}
                        style={{
                            opacity: userRating === 0 ? 0.3 : userRating >= rating ? 1 : hoveredRating >= rating ? 0.7 : 0.3,
                            cursor: isAuthenticated ? "pointer" : "not-allowed",
                        }}
                        onMouseEnter={() => isAuthenticated && setHoveredRating(rating)}
                        onMouseLeave={() => isAuthenticated && setHoveredRating(0)}
                        onClick={() => handleEmojiClick(rating)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="userRatingSection">
            <div className="ratingTitle">Rate this Movie:</div>
            {renderEmojis()}
        </div>
    );
};

export default Rating;
