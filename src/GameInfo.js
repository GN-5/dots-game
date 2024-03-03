import React from 'react';
import { connect } from 'react-redux'
import './css/index.css';
import icon from "./img/icons8-male-user-90.png";


const GameInfo = (props) => (
  <div className="game-info" style={{ marginBottom: 50 }}>
    <div className="box is-text is-centered is-size-5 has-background-dark has-text-white-bis" style={{ marginBottom: 20 }}>{props.gameStatus}</div>
    <div className="score tags has-addons">
      <div className="tag" style={{ color: props.connected.x ? '#111112' : 'grey', marginTop: 100 }}>
        <figure className="image is-50x50">
          <img src={icon} alt="X Avatar" />
          <br />
          <p className="is-text is-centered is-size-4">{props.x}</p>
        </figure>

      </div>

      <div className="box is-text is-centered is-size-3  has-background-info has-text-white-bis" style={{ padding: 10, marginTop: 80, marginRight: 30 }}> {props.xScore}</div>
      <div className="box is-text is-centered is-size-3 has-background-info has-text-white-bis" style={{ padding: 10, marginTop: 80, marginLeft: 30 }}>{props.oScore}</div>

      <div className="tag" style={{ color: props.connected.o ? '#301934' : 'grey', marginTop: 100 }}>
        <figure className="image is-50x50">
          <img src={icon} alt="O Avatar" />
          <br />
          <p className="text is-centered is-size-4">{props.o}</p>
        </figure>
      </div>
    </div>
  </div >
);

const mapStateToProps = state => ({
  gameStatus: state.gameStatus,
  x: state.players.x,
  o: state.players.o,
  xScore: state.score.x,
  oScore: state.score.o,
  connected: state.connected,
})

export default connect(mapStateToProps)(GameInfo)
