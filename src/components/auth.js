import { ref, set, get } from "firebase/database";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";

import { auth, db } from "./firebase";

// Register a new user
export const register = async (email, password, name) => {
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with name
        await updateProfile(user, { displayName: name });

        // Store additional user data in Realtime Database
        await set(ref(db, 'users/' + user.uid), {
            name: name,
            email: email,
            createdAt: new Date().toISOString()
        });

        console.log("User registered successfully:", user);
        return user;
    } catch (error) {
        console.error("Error registering user:", error.message);
        throw error;
    }
};

// Login user
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Fetch additional user data from Realtime Database
        const userData = await getUserData(user.uid);
        console.log("User logged in successfully:", { ...user, ...userData });
        return { ...user, ...userData };
    } catch (error) {
        console.error("Error logging in:", error.message);
        throw error;
    }
};

// Logout user
export const logout = async () => {
    try {
        await signOut(auth);
        console.log("User signed out successfully");
    } catch (error) {
        console.error("Error signing out:", error.message);
        throw error;
    }
};

// Save auth state to local storage
const saveAuthState = (user) => {
    localStorage.setItem('authUser', JSON.stringify(user));
};

// Retrieve auth state from local storage
const getAuthState = () => {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
};

// Retrieve the auth state on app load
export const loadAuthState = () => {
    return getAuthState();
};

// Listen to auth state changes
export const checkAuthState = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (user) {
                // User is signed in
                const userData = await getUserData(user.uid);
                const fullUser = { ...user, ...userData };
                saveAuthState(fullUser);
                resolve(fullUser);
            } else {
                // No user is signed in
                resolve(null);
            }
        }, reject);
    });
};

// Get user data from Realtime Database
const getUserData = async (userId) => {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : {};
};
