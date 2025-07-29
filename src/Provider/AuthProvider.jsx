import React, { useEffect, useState } from 'react';
import { GoogleAuthProvider, GithubAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from './firebase.init';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';

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
            const response = await api.get(`/auth/check-user/${uid}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking user existence:', error);
            return false;
        }
    }

        // Save user to database after successful authentication
    const saveUserToDatabase = async (userData, isFirstTime = false) => {
        try {
            const response = await api.post('/auth/save-user', {
                uid: userData.uid,
                displayName: userData.displayName,
                email: userData.email,
                photoURL: userData.photoURL,
                role: 'user',
                isFirstTime
            });
            return response.data;
        } catch (error) {
            console.error('Error saving user to database:', error);
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
