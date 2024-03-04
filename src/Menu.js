import React from 'react';
import { Link } from 'react-router-dom';
import "./css/index.css";

const Menu = props => {
    const { gameStatus, gameId, userId, isAuthenticated } = props;
    return (
        <div className="box" style={{ background: `#11112a`, color: `#fff` }}>
            <ul className="menu-list">
                {!gameStatus.includes('not started') && (
                    <li>
                        <Link to={`/game/${gameId}/play`}>Go back to game</Link>
                    </li>
                )}
                <li>
                    <Link to="/game/start">Start a new game</Link>
                </li>
                <li>
                    <Link to="/game/start/offline">Play offline</Link>
                </li>
                <li>
                    <Link to={`/user/${userId}/games`}>My games</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/rules">Rules</Link>
                </li>
                {isAuthenticated && <li>
                    <Link to="/signout">Signout</Link>
                </li>}
            </ul>
        </div>
    );
};

export default Menu;
