import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import logo from './img/Dots_Logo.svg'
import { GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { set, ref } from "firebase/database";
import { auth, database } from "./server/firebase";
import { useHistory } from 'react-router-dom';


const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const LogInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const history = useHistory();

    const handleLogIn = (e) => {
        e.preventDefault();

        // Login
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User logged in successfully
                const username = email.split("@")[0];
                setUsername(username);
                console.log('User logged in:', username);
                history.push('/'); // Redirect to home page after successful login

            })
            .catch((error) => {
                // Handle errors
                console.error('Error logging in:', error.message);
            });
    }

    const handleLogInWithGoogle = (e) => {
        e.preventDefault();
        signInWithPopup(auth, provider)
            .then((result) => {
                // // This gives you a Google Access Token. 
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // // The signed-in user info.
                const user = result.user;
                const username = user.email.split("@")[0];
                setUsername(username);
                history.push('/'); // Redirect to home page after successful login

            }).catch((error) => {
                // Errors
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                if (errorCode, errorMessage, email, credential !== '') {
                    alert(errorCode, errorMessage, email, credential);
                }
            });
    }

    const handleSignUp = (e) => {
        e.preventDefault();
        // Sign up
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User signed up successfully
                const user = userCredential.user;
                const username = email.split("@")[0]; // Parse username from email
                setUsername(username);
                console.log('User signed up:', user);

                // Create user data in the database
                set(ref(database, 'User/' + user.uid), {
                    email: user.email,
                    username: username, // Set the username in the database
                });

                history.push('/'); // Redirect to home page after successful signup
            })
            .catch((error) => {
                // Handle errors
                console.error('Error signing up:', error.message);
            });
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user + "is signed in");
        } else {
            console.log(user + "is signed out");
        }
    });
    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                console.log('User signed out');
                // Redirect or update state as needed
            })
            .catch((error) => {
                // An error happened.
                console.error('Error signing out:', error);
            });
    }

    return (
        <div className="login-container">
            <img src={logo} className="Login-logo" alt="logo" />
            <h3> Welcome Back! </h3>
            <form>
                <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder='Username'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />


                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />


                <button type="submit" onClick={handleLogIn}>Log In</button>
                <button type="submit" onClick={handleSignUp}>Sign Up</button>

                {/* Google Sign-In Button */}
                <button className="google-button" onClick={handleLogInWithGoogle}>Sign in with Google</button>

            </form>
        </div>
    );
}


export default LogInForm;
