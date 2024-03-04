import React, { useEffect, useState } from 'react';
import { auth } from "./server/firebase";
import { signOut } from "firebase/auth";
import { useHistory } from "react-router-dom";

const SignOut = () => {
    const history = useHistory();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                // User is logged in
                setIsLoggedIn(true);
            } else {
                // User is not logged in
                setIsLoggedIn(false);
            }
        });

        // Clean up subscription
        return () => unsubscribe();
    }, []);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                console.log('User signed out');
                history.push("/");
            })
            .catch((error) => {
                // An error happened.
                console.error('Error signing out:', error);
            });
    }

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <p>Do you want to sign out?</p>
                    <button onClick={handleSignOut}>Yes</button>
                    <button onClick={() => history.push("/")}>No</button>
                </div>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    );
}

export default SignOut;
