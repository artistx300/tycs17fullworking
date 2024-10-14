import React, { useEffect, useState } from 'react';
import './Profile.css';
import Cards from '../../components/card/card';

const Profile = () => {
    const [toWatch, setToWatch] = useState([]);
    const [watched, setWatched] = useState([]);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('toWatch');

    useEffect(() => {
        const fetchUserMovies = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('You need to sign in to view your profile.');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5000/user/movies', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }

                const data = await response.json();
                setToWatch(data.toWatch);
                setWatched(data.watched);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserMovies();
    }, []);

    const renderMovieCards = (movies) => {
        return movies.map((movie) => (
            <Cards key={movie.id} movie={movie} />
        ));
    };

    return (
        <div className="profile">
            <h1>Your Profile</h1>
            {error && <p className="error">{error}</p>}
            {!error && (
                <div className="profile__tabs">
                    <button onClick={() => setActiveTab('toWatch')} className={activeTab === 'toWatch' ? 'active' : ''}>To Watch</button>
                    <button onClick={() => setActiveTab('watched')} className={activeTab === 'watched' ? 'active' : ''}>Watched</button>

                    <div className="profile__content">
                        {activeTab === 'toWatch' && renderMovieCards(toWatch)}
                        {activeTab === 'watched' && renderMovieCards(watched)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;