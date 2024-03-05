import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import logo from './img/Dots_Logo.svg';
import Menu from './Menu';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './server/firebase';
import { getUsername } from './server/Storage';

const Home = ({ gameStatus, gameId }) => {
    const [uid, setUid] = useState(null);
    const [username, setUsername] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUid(uid);
                console.log(user.email);
                setIsAuthenticated(true);
            } else {

                console.log("user is logged out")
            }
        });


    }, []);

    async function fetchData(uid) {
        try {
            const fetchedUsername = await getUsername(uid);
            setUsername(fetchedUsername);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    fetchData(uid);

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
                userId={uid}
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
