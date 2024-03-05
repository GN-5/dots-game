import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createGame, getUsername } from './server/Storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './server/firebase';

const GameForm = (props) => {
  const [redirect, setRedirect] = useState(false);
  const [gameId, setGameId] = useState('');
  const [uid, setUid] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const firstmove = form.firstmove.value;
    const xIsNext = (firstmove === 'Random' ? Math.random() > .5 : firstmove === 'You');

    const players = {
      x: form.x.value.trim(),
      o: form.o.value.trim(),
    };
    const size = {
      r: Number(form.r.value),
      c: Number(form.c.value),
    };
    const gameData = {
      gameId: Math.random().toString(36).substr(2, 5),
      size: size,
      step: 0,
      lastClicked: null,
      xIsNext: xIsNext,
      isX: true,
      score: {
        x: 0,
        o: 0,
      },
      players: players,
      users: {
        x: props.user.id,
        o: null,
      },
      connected: {
        x: true,
        o: false,
      },
      gameStatus: `${xIsNext ? players.x : players.o}'s Turn`,
      status: 'waiting_for_opponent',
      gridNodes: Array(size.r)
        .fill()
        .map(() =>
          Array(size.c)
            .fill()
            .map(() => ({
              right: false,
              down: false,
              owner: null,
            }))
        ),
    };

    if (props.offline) {
      gameData.status = 'started';
      gameData.connected.o = true;
      gameData.offline = true;
      gameData.public = false;
    }

    props.socket.emit('NEW_GAME', gameData);
    props.dispatch({
      type: 'UPDATE_STATE',
      data: gameData,
    });

    setRedirect(true);
    setGameId(gameData.gameId);
    createGame(uid, gameData);
  };

  if (redirect) {
    const path = `/game/${gameId}/play`;
    return <Redirect to={path} />;
  }

  let xName = props.user.name;
  xName = xName.startsWith('Guest') ? 'X' : xName;
  const oName = props.offline ? 'Computer' : 'O';
  const maxSize = props.offline ? 20 : 1000;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label"> Players </label>
          <div className="field has-addons has-addons-centered">
            <p className="control">
              <input className="input" type="text" name="x" required defaultValue={xName} placeholder="You" />
            </p>
            <p className="control">
              <a className="button is-static">VS</a>
            </p>
            <p className="control">
              <input className="input" type="text" name="o" required defaultValue={oName} placeholder="Opponent" />
            </p>
          </div>
        </div>
        <div className="field">
          <label className="label"> Size </label>
          <div className="field has-addons has-addons-centered">
            <p className="control">
              <input className="input" type="number" max={maxSize} min="2" required name="r" defaultValue="5" />
            </p>
            <p className="control">
              <a className="button is-static">X</a>
            </p>
            <p className="control">
              <input className="input" type="number" max={maxSize} min="2" required name="c" defaultValue="5" />
            </p>
          </div>
        </div>
        <div className="field">
          <label className="label"> First move </label>
          <div className="field is-grouped is-grouped-centered">
            <div className="control">
              <div className="select">
                <select type="select" name="firstmove">
                  <option> You </option>
                  <option> Opponent </option>
                  <option> Random </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <label className="checkbox">
          <input type="checkbox" name="public" defaultChecked />
          Enable Multiplayer
        </label>
        <div className="field is-grouped is-grouped-centered">
          <div className="control">
            <button className="button is-dark back" type="submit">Go</button>
          </div>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(GameForm);
