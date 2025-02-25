// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { 
    getFirestore, collection, addDoc, getDocs, deleteDoc, doc, 
    query, orderBy, updateDoc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCiPWigkqncSKOQZ_sjR3LfhfY3urgvrz0",
    authDomain: "buget-tracker-8fec3.firebaseapp.com",
    projectId: "buget-tracker-8fec3",
    storageBucket: "buget-tracker-8fec3.appspot.com",
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
    if (!title || amount <= 0) {
        alert("Please enter a valid title and amount.");
        return;
    }

    try {
        const transaction = { 
            type, 
            title, 
            amount: parseFloat(amount), 
            timestamp: new Date(),
            userId: auth.currentUser.uid // Associate transaction with the logged-in user
        };
        await addDoc(transactionsRef, transaction);
        console.log("✅ Transaction successfully added!");
    } catch (error) {
        console.error("❌ Error adding transaction:", error);
        alert("Failed to add transaction. Please try again.");
    }
}

// Function to Fetch Transactions
export async function fetchTransactions() {
    try {
        const q = query(transactionsRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        alert("Failed to fetch transactions. Please try again.");
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
        alert("Failed to delete transaction. Please try again.");
    }
}

// Function to Update Transaction
export async function updateTransaction(id, updatedEntry) {
    try {
        await updateDoc(doc(db, "transactions", id), updatedEntry);
        console.log("✅ Transaction successfully updated!");
    } catch (error) {
        console.error("❌ Error updating transaction:", error);
        alert("Failed to update transaction. Please try again.");
    }
}

// Function to Listen for Real-Time Transaction Updates
export function listenForTransactions(callback) {
    const q = query(transactionsRef, orderBy("timestamp", "desc"));
    return onSnapshot(q, (querySnapshot) => {
        const transactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(transactions);
    });
}

// Authentication Functions
export async function signUpUser(email, password) {
    if (!email || !password) {
        alert("Please enter a valid email and password.");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("✅ Account created successfully!");
    } catch (error) {
        console.error("❌ Error signing up:", error);
        alert(`Failed to create account: ${error.message}`);
    }
}

export async function loginUser(email, password) {
    if (!email || !password) {
        alert("Please enter a valid email and password.");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("✅ Welcome back!");
    } catch (error) {
        console.error("❌ Error logging in:", error);
        alert(`Failed to log in: ${error.message}`);
    }
}

export async function logoutUser() {
    try {
        await signOut(auth);
        alert("✅ Logged out successfully!");
    } catch (error) {
        console.error("❌ Error logging out:", error);
        alert("Failed to log out. Please try again.");
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