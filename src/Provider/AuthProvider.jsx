import React, { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, GithubAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from './firebase.init';
import { showSuccess, showError, showLoading, closeSwal } from '../utils/notifications';

export const AuthContext = createContext()
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authError, setAuthError] = useState(null)

    const createUser = (email, password) => {
        setLoading(true)
        setAuthError(null)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const googleLogin = () => {
        setLoading(true)
        setAuthError(null)
        return signInWithPopup(auth, googleProvider);
    }

    const githubLogin = () => {
        setLoading(true)
        setAuthError(null)
        return signInWithPopup(auth, githubProvider);
    }

    const login = (email, password) => {
        setLoading(true)
        setAuthError(null)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        setLoading(true)
        setAuthError(null)
        localStorage.removeItem('access_token')
        return signOut(auth)
    }

    const updateUserProfile = (userInfo) => {
        return updateProfile(auth.currentUser, userInfo)
    }

    // Check if user exists in database
    const checkUserExists = async (uid) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/check-user/${uid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const result = await response.json();
                return result.exists;
            }
            return false;
        } catch (error) {
            console.error('Error checking user existence:', error);
            return false;
        }
    }

    // Save user to database after successful authentication
    const saveUserToDatabase = async (userData, isFirstTime = false) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/save-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    isFirstTime
                }),
            });
            
            if (response.ok) {
                const result = await response.json();
                // Store JWT token
                if (result.access_token) {
                    localStorage.setItem('access_token', result.access_token);
                }
                
                // Show appropriate message
                if (isFirstTime) {
                    showSuccess('Welcome to PetConnect!', 'Your account has been created successfully.');
                } else {
                    showSuccess('Welcome back!', 'You have been logged in successfully.');
                }
                
                return result;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save user data');
            }
        } catch (error) {
            console.error('Error saving user to database:', error);
            showError('Database Error', 'Failed to save user information. Please try again.');
            throw error;
        }
    }

    useEffect(() => {
        const observer = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser)
            
            if (currentUser) {
                try {
                    // Check if this is the first time this user is logging in
                    const userExists = await checkUserExists(currentUser.uid);
                    const isFirstTime = !userExists;
                    
                    // Prepare user data
                    const userData = {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        displayName: currentUser.displayName || '',
                        photoURL: currentUser.photoURL || '',
                        provider: currentUser.providerData[0]?.providerId || 'password'
                    };
                    
                    // Save user to database and get JWT token
                    await saveUserToDatabase(userData, isFirstTime);
                } catch (error) {
                    console.error('Error in auth state change:', error);
                }
            }
            
            setLoading(false)
        })

        return () => {
            observer()
        }
    }, [])

    const authData = {
        user,
        setUser,
        createUser,
        logout,
        login,
        loading,
        setLoading,
        updateUserProfile,
        googleLogin,
        githubLogin,
        authError,
        setAuthError,
        saveUserToDatabase,
        checkUserExists
    }

    return (
        <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
    );
};
export default AuthProvider;
