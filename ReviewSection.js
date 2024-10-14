// frontend/src/components/reviewsec/ReviewSection.js

import React, { useState, useEffect } from "react";
import "./ReviewSection.css";
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode

const ReviewSection = ({ reviews, setReviews, movieId }) => {
    const [reviewText, setReviewText] = useState("");
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [reportCounts, setReportCounts] = useState([]);
    const [spoilerVisible, setSpoilerVisible] = useState([]);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Add admin state

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsSignedIn(true);
            try {
                const decoded = jwtDecode(token); // Correct function call
                console.log("Decoded Token:", decoded); // Debugging token

                // Check if the user is an admin based on the decoded token
                if (decoded && decoded.sub && decoded.sub.role === "admin") {
                    console.log("User is an admin");
                    setIsAdmin(true);
                } else {
                    console.log("User is not an admin");
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                setIsSignedIn(false);
                setIsAdmin(false); // Ensure isAdmin is false on invalid token
            }
        } else {
            setIsSignedIn(false);
            setIsAdmin(false); // Ensure isAdmin is false when not signed in
        }

        // Load saved reviews from local storage
        const savedReviews = localStorage.getItem(`reviews_${movieId}`);
        if (savedReviews) {
            const parsedReviews = JSON.parse(savedReviews);
            setReviews(parsedReviews);
            setReportCounts(Array(parsedReviews.length).fill(0));
            setSpoilerVisible(Array(parsedReviews.length).fill(false));
        }
    }, [movieId, setReviews]);

    const handleReviewSubmit = () => {
        if (reviewText.trim() === "") return;

        const newReview = { text: reviewText, spoiler: isSpoiler, reports: 0 };
        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        setReportCounts([...reportCounts, 0]);
        setSpoilerVisible([...spoilerVisible, false]);

        // Save updated reviews to local storage
        localStorage.setItem(`reviews_${movieId}`, JSON.stringify(updatedReviews));

        setReviewText("");
        setIsSpoiler(false);
    };

    const handleReportReview = (index) => {
        const updatedReports = [...reportCounts];
        updatedReports[index] += 1; // Increment report count for the review
        setReportCounts(updatedReports);

        // Delete review if report count reaches 50
        if (updatedReports[index] >= 50) {
            deleteReview(index);
        }
    };

    const deleteReview = (index) => {
        const updatedReviews = reviews.filter((_, i) => i !== index);
        const updatedReportCounts = reportCounts.filter((_, i) => i !== index);
        const updatedSpoilerVisibility = spoilerVisible.filter((_, i) => i !== index);

        setReviews(updatedReviews);
        setReportCounts(updatedReportCounts);
        setSpoilerVisible(updatedSpoilerVisibility);

        // Save updated reviews to local storage
        localStorage.setItem(`reviews_${movieId}`, JSON.stringify(updatedReviews));
    };

    const toggleSpoilerVisibility = (index) => {
        const updatedVisibility = [...spoilerVisible];
        updatedVisibility[index] = !updatedVisibility[index];
        setSpoilerVisible(updatedVisibility);
    };

    // Clear local storage on logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem(`reviews_${movieId}`); // Clear movie-specific reviews
        setReviews([]); // Optionally clear the reviews from state
        setIsSignedIn(false);
        setIsAdmin(false);
    };

    return (
        <div className="reviewSection">
            <div className="reviewText">Reviews</div>

            {isSignedIn ? (
                <>
                    <textarea
                        className="reviewInput"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                    />
                    <div className="spoilerOption">
                        <label>
                            <input
                                type="checkbox"
                                checked={isSpoiler}
                                onChange={() => setIsSpoiler(!isSpoiler)}
                            />
                            Mark as Spoiler
                        </label>
                    </div>
                    <button className="submitReview" onClick={handleReviewSubmit}>
                        Submit
                    </button>
                </>
            ) : (
                <div className="loginPrompt">
                    Please <a href="/sign-in">sign in</a> to write and submit reviews.
                </div>
            )}

            <div className="reviewsList">
                {reviews.map((review, index) => (
                    reportCounts[index] < 50 && ( // Only render if report count is less than 50
                        <div key={index} className="reviewItem">
                            <div className={review.spoiler && !spoilerVisible[index] ? "spoilerBlur" : ""}>
                                {review.text}
                            </div>
                            {review.spoiler && !spoilerVisible[index] && (
                                <button className="showSpoilerButton" onClick={() => toggleSpoilerVisibility(index)}>
                                    Show Spoiler
                                </button>
                            )}

                            {isSignedIn && (
                                <>
                                    <button
                                        className="reportButton"
                                        onClick={() => handleReportReview(index)}
                                    >
                                        Report
                                    </button>
                                    {isAdmin && ( // Show delete button only for admins
                                        <button
                                            className="deleteButton"
                                            onClick={() => deleteReview(index)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </>
                            )}

                            <span className="reportCount">Reports: {reportCounts[index]}</span>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default ReviewSection;
