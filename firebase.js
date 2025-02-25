// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { 
    getFirestore, collection, addDoc, getDocs, deleteDoc, doc, 
    query, orderBy, updateDoc 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCiPWigkqncSKOQZ_sjR3LfhfY3urgvrz0",
    authDomain: "buget-tracker-8fec3.firebaseapp.com",
    projectId: "buget-tracker-8fec3",
    storageBucket: "buget-tracker-8fec3.appspot.com",  // ✅ Fixed typo
    messagingSenderId: "85873973556",
    appId: "1:85873973556:web:d7856618db9e11e12f2d61",
    measurementId: "G-ZNE1XT193K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Firestore Collection Reference
const transactionsRef = collection(db, "transactions");

// Function to Add Transaction
export async function addTransaction(type, title, amount) {
    try {
        const transaction = { 
            type, 
            title, 
            amount: parseFloat(amount), 
            timestamp: new Date() 
        };
        await addDoc(transactionsRef, transaction);
        console.log("✅ Transaction successfully added!");
    } catch (error) {
        console.error("❌ Error adding transaction:", error);
    }
}

// Function to Fetch Transactions
export async function fetchTransactions() {
    try {
        const querySnapshot = await getDocs(query(transactionsRef, orderBy("timestamp", "desc")));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        return [];
    }
}

// Function to Delete Transaction
export async function deleteTransaction(id) {
    try {
        await deleteDoc(doc(db, "transactions", id));
        console.log("✅ Transaction successfully deleted!");
    } catch (error) {
        console.error("❌ Error deleting transaction:", error);
    }
}

// Function to Update Transaction
export async function updateTransaction(id, updatedEntry) {
    try {
        await updateDoc(doc(db, "transactions", id), updatedEntry);
        console.log("✅ Transaction successfully updated!");
    } catch (error) {
        console.error("❌ Error updating transaction:", error);
    }
}

// Authentication Functions
export async function signUpUser(email, password) {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("✅ Account created successfully!");
    } catch (error) {
        alert("❌ Error: " + error.message);
    }
}

export async function loginUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("✅ Welcome back!");
    } catch (error) {
        alert("❌ Error: " + error.message);
    }
}

export async function logoutUser() {
    try {
        await signOut(auth);
        alert("✅ Logged out successfully!");
    } catch (error) {
        alert("❌ Error logging out: " + error.message);
    }
}

// Track Authentication State
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        const userEmailEl = document.getElementById("user-email");
        if (user) {
            console.log(`✅ User signed in: ${user.email}`);
            if (userEmailEl) userEmailEl.textContent = `Logged in as: ${user.email}`;
        } else {
            console.log("❌ No user signed in");
            if (userEmailEl) userEmailEl.textContent = "Not logged in";
        }
    });
});

// Function to track authentication state in other files
export function trackAuthState(callback) {
    onAuthStateChanged(auth, callback);
}
