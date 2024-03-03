import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import GameContainer from './containers/GameContainer';
import GameForm from './GameForm';
import JoinForm from './JoinForm';
import Home from './Home';
import Rules from './Rule';
import ClientSocket from './utilities/ClientSocket';
import * as auth from './utilities/auth';
import LogInForm from './LoginForm';
import "./css/index.css";

class App extends Component {
    constructor(props) {
        super(props);

        auth.initFb(props.dispatch);
        auth.loadUser(props.dispatch);

        this.ClientSocket = new ClientSocket(this);
        this.ClientSocket.bindListeners();
    }

    render() {
        const socket = this.ClientSocket.getSocket();
        return (
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={Home} />
                    <Route
                        exact
                        path="/game/:gameId/play"
                        render={props => <GameContainer socket={socket} {...props} />}
                    />
                    <Route
                        exact
                        path="/game/start"
                        render={props => (
                            <GameForm socket={socket} {...props} />
                        )}
                    />
                    <Route
                        exact
                        path="/game/start/offline"
                        render={props => (
                            <GameForm socket={socket} {...props} offline={true} />
                        )}
                    />
                    <Route
                        exact
                        path="/login"
                        render={props => (
                            <LogInForm socket={socket} {...props} />
                        )}
                    />
                    <Route
                        exact
                        path="/game/:gameId/join"
                        render={props => (
                            <JoinForm socket={socket} {...props} />
                        )}
                    />
                    <Route exact path="/rules" component={Rules} />
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(App);
