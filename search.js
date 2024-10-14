import React, { useEffect, useState } from "react";
import './search.css'; // Add this at the top of your Search.js
import Cards from "../../components/card/card";

const Search = () => {
    const [query, setQuery] = useState("");  // State for search query
    const [movies, setMovies] = useState([]); // State for storing fetched movies
    const [topRatedMovies, setTopRatedMovies] = useState([]); // State for storing top-rated movies

    // Fetch top-rated movies on initial load
    useEffect(() => {
        fetchTopRatedMovies();
    }, []);

    // Fetch top-rated movies
    const fetchTopRatedMovies = () => {
        fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=02e33712ab12fff420e384b4d66c169a&language=en-US")
            .then(res => res.json())
            .then(data => setTopRatedMovies(data.results))
            .catch(error => console.error("Error fetching top-rated movies:", error));
    };

    // Search for movies based on the query
    const searchMovies = () => {
        if (query) {
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=02e33712ab12fff420e384b4d66c169a&language=en-US&query=${query}`)
                .then(res => res.json())
                .then(data => setMovies(data.results))
                .catch(error => console.error("Error fetching movies:", error));
        } else {
            setMovies(topRatedMovies); // Reset to top-rated movies if the query is empty
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setQuery(e.target.value); // Update the query state on input change
        searchMovies(); // Call the search function on input change
    };

    return (
        <div className="search__page">
            <h2 className="list__title"></h2>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="I'm here to help you find movies..."
                className="search__input"
            />
            <div className="list__cards">
                {(movies.length > 0 ? movies : topRatedMovies).map(movie => (
                    <Cards key={movie.id} movie={movie} />
                ))}
                {movies.length === 0 && query && <p>No movies found.</p>}
            </div>
        </div>
    );
};

export default Search;