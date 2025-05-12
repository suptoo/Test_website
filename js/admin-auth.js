// Admin Authentication Script
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// Get auth instance from the app that's already initialized
const auth = getAuth();

// Check if user is logged in
export function checkAuth() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Check if the user is the admin
                if (user.email === "tuhad2003@gmail.com") {
                    resolve(user);
                } else {
                    // Not the admin, sign them out and reject
                    signOut(auth).then(() => {
                        reject(new Error("Unauthorized access"));
                    });
                }
            } else {
                // No user is signed in, redirect to login
                reject(new Error("Not authenticated"));
            }
        });
    });
}

// Sign out function
export function adminSignOut() {
    return signOut(auth);
}