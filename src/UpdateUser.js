import React, { useState, useEffect } from 'react';
import { auth } from './server/firebase';
import { getUsername, updateUsername } from './server/Storage';
import { useHistory } from "react-router-dom";


function UpdateUser() {
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const history = useHistory();

    // Fetch the current user's UID
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user.uid);
            } else {
                setCurrentUser(null);
            }
        });
        return unsubscribe;
    }, []);

    const handleChange = (e) => {
        setNewUsername(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newUsername.length < 3 || newUsername.length > 20) {
            setErrorMessage('Username must be between 3 and 20 characters long.');
            return;
        }

        try {
            // Update the username in the database
            await updateUsername(currentUser, newUsername);
            setSuccessMessage('Username updated successfully.');
        } catch (error) {
            setErrorMessage('Error updating username. Please try again.');
        }
    };

    async function fetchData(uid) {
        try {
            const fetchedUsername = await getUsername(uid);
            setUsername(fetchedUsername);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    fetchData(currentUser);
    const handleCancel = () => {
        history.goBack();
    };


    return (
        <div>
            <h2 className='is-black is-size-2'>Update Username</h2>
            {currentUser ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="currentUsername">Current Username:</label>
                        <input type="text" id="currentUsername" value={username} readOnly />
                    </div>
                    <div>
                        <label htmlFor="newUsername">New Username:</label>
                        <input type="text" id="newUsername" value={newUsername} onChange={handleChange} />
                    </div>
                    <div>
                        <button type="submit">Submit</button>

                    </div>
                    {errorMessage && <div className="error">{errorMessage}</div>}
                    {successMessage && <div className="success">{successMessage}</div>}
                </form>
            ) : (
                <div>Please log in to update your username.</div>
            )}
            <button type='button' onClick={() => handleCancel}>Cancel</button>
        </div>
    );
}

export default UpdateUser;
