import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import logo from './img/Dots_Logo.svg';
import Menu from './Menu';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './server/firebase';

const Home = ({ gameStatus, gameId }) => {
    const [username, setUsername] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {

                const uid = user.uid;
                const username = user.email.split("@")[0];
                setUsername(username);
                console.log("username", username);
                console.log("uid", uid)
                setIsAuthenticated(true);
            } else {

                console.log("user is logged out")
            }
        });


    }, [])

    return (
        <div>
            <img src={logo} alt="Dots" id='logo-home-page' style={{ maxWidth: 200 }} />
            <p className="subtitle has-text-grey">
                The classic Dots game re-imagined for the web.
            </p>
            <div className="subtitle has-text-grey">
                {username && <p>Hello, {username}</p>}
                <br />
                <br />
            </div>
            <Menu
                gameStatus={gameStatus}
                gameId={gameId}
                userId={username}
                isAuthenticated={isAuthenticated}
            />
            <div>
                <p className="footer-contact">
                    ©
                    &nbsp;
                    <a target="#" href="mailto:gaurab.neupane@deerwalk.edu.np">heptadroid</a>
                </p>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    gameStatus: state.gameStatus,
    gameId: state.gameId
});

export default connect(mapStateToProps)(Home);
