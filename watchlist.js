import React from "react";
import "./watchlist.css";

const Watchlist = ({ isWatched, setIsWatched, isToWatch, setIsToWatch, isAuthenticated, handleWatchlistUpdate }) => {
    return (
        <div className="watchlist">
            {isAuthenticated ? (
                <>
                    <button
                        onClick={() => {
                            setIsToWatch(!isToWatch);
                            handleWatchlistUpdate(isToWatch ? "removeToWatch" : "toWatch");
                        }}
                        className={`watchlist__button ${isToWatch ? "active" : ""}`}
                    >
                        {isToWatch ? "Remove from To Watch" : "Add to To Watch"}
                    </button>
                    <button
                        onClick={() => {
                            setIsWatched(!isWatched);
                            handleWatchlistUpdate(isWatched ? "removeWatched" : "watched");
                        }}
                        className={`watchlist__button ${isWatched ? "active" : ""}`}
                    >
                        {isWatched ? "Remove from Watched" : "Mark as Watched"}
                    </button>
                </>
            ) : (
                <p>Please sign in to manage your watchlist.</p>
            )}
        </div>
    );
};

export default Watchlist;