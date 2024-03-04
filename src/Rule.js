import React from 'react';
import { Link } from 'react-router-dom';


const Rules = () => (
  <div>
    <p>
      A local or online multiplayer game where players compete to fill out a dot-grid matrix in turns.
      Each player can connect two adjacent dots to form a line on each turn.
      A player gets a point once they connect the final vertex to make a square.
      The player with the most points at the end wins.
    </p>
    <button className="button is-dark back">
      <Link to="/"> Go Back </Link>
    </button>
  </div>
)

export default Rules
