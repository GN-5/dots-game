import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import logo from './img/Dots_Logo.svg';
import Menu from './Menu';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase';
import { getAuth } from 'firebase/auth';

const Home = ({ gameStatus, gameId, user }) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const auth = getAuth();
        if (auth.currentUser) {
            fetchUserData(auth.currentUser.email);
        }
    }, []);

    const fetchUserData = (email) => {
        const userRef = ref(database, 'users');
        onValue(userRef, (snapshot) => {
            const users = snapshot.val();
            if (users) {
                const userData = Object.values(users).find(user => user.email === email);
                if (userData) {
                    setUsername(userData.username);
                }
            }
        });
    };

    return (
        <div>
            <img src={logo} alt="Dots" id='logo-home-page' style={{ maxWidth: 200 }} />
            <p className="subtitle has-text-grey">
                The classic Dots game re-imagined for the web.
            </p>
            <div className="subtitle has-text-grey">
                <p>Hello, {username}</p>
                <br />
                <br />
            </div>
            <Menu
                gameStatus={gameStatus}
                gameId={gameId}
                userId={user}
            />
            <div>
                <p className="footer-contact">
                    ©
                    &nbsp;
                    <a target="_blank" href="mailto:gaurab.neupane@deerwalk.edu.np">heptadroid</a>
                </p>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    gameStatus: state.gameStatus,
    gameId: state.gameId,
    availableGames: state.availableGames,
});

export default connect(mapStateToProps)(Home);
