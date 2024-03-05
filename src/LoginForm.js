import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import logo from './img/Dots_Logo.svg'
import { GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { auth } from "./server/firebase";
import { useHistory } from 'react-router-dom';
import { createUser } from "./server/Storage";


const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const LogInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleLogIn = (e) => {
        e.preventDefault();

        // Login
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User logged in successfully
                console.log('User logged in:', email);
                history.push('/'); // Redirect to home page after successful login

            })
            .catch((error) => {
                // Handle errors
                console.error('Error logging in:', error.message);
                alert('Invalid credentials. Please check your email and password.');
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
                createUser(user);
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
                console.log('User signed up:', user);

                // Create user data in the database
                createUser(user.uid, user.email);

                history.push('/'); // Redirect to home page after successful signup
            })
            .catch((error) => {
                // Handle errors
                console.error('Error signing up:', error.message);
                // Check if the error is due to an invalid email address
                if (error.code === 'auth/invalid-email') {
                    alert('Invalid email address. Please enter a valid email.');
                } else {
                    alert('Error signing up:', error.message);
                }
            });
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user + "is signed in");
        } else {
            console.log(user + "is signed out");
        }
    });


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
