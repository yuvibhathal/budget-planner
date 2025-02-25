// Select Elements
const balanceEl = document.getElementById('balance-value');
const incomeEl = document.getElementById('addmoney');
const expensesEl = document.getElementById('submoney');
const incomeList = document.getElementById('income-list');
const expensesList = document.getElementById('expenses-list');
const incomeText = document.getElementById('income-text');
const incomeAmount = document.getElementById('income-amount');
const btnIncome = document.getElementById('btn-income');
const expensesText = document.getElementById('expenses-text');
const expensesAmount = document.getElementById('expenses-amount');
const btnExpenses = document.getElementById('btn-expenses');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const chatInput = document.getElementById('chat-input');
const chatBtn = document.getElementById('send-chat');
const chatResponse = document.getElementById('chat-response');
const chatChart = document.getElementById('expenses-chart'); // Ensure this matches your <canvas> ID

// Variables
let transactions = [];
let totalIncome = 0;
let totalExpenses = 0;
let expenseCategories = {}; // Stores expenses by category
let expenseChart = null; // Holds the Chart.js instance

// Initialize Firebase (Add your Firebase config here)
// import { initializeApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";

// const firebaseConfig = {
//     apiKey: "your-api-key",
//     authDomain: "your-auth-domain",
//     projectId: "your-project-id",
//     storageBucket: "your-storage-bucket",
//     messagingSenderId: "your-messaging-sender-id",
//     appId: "your-app-id"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// Function to Update Budget Overview
function updateBudget() {
    totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    totalExpenses = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    balanceEl.textContent = `$${balance.toFixed(2)}`;
    incomeEl.textContent = `$${totalIncome.toFixed(2)}`;
    expensesEl.textContent = `-$${totalExpenses.toFixed(2)}`;

    updateChart(); // Refresh chart when updating budget
}

// Function to Add Transaction
function addTransaction(type, title, amount) {
    if (!title || amount <= 0) {
        alert("Please enter a valid title and amount.");
        return;
    }

    const transaction = { type, title, amount: parseFloat(amount) };
    transactions.push(transaction);

    if (type === "expense") {
        expenseCategories[title] = (expenseCategories[title] || 0) + transaction.amount;
    }

    renderTransactions();
    updateBudget();
}

// Function to Render Transactions in the List
function renderTransactions() {
    incomeList.innerHTML = "";
    expensesList.innerHTML = "";

    transactions.forEach((transaction, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${transaction.title}: $${transaction.amount.toFixed(2)} 
            <button onclick="removeTransaction(${index})">X</button>`;

        if (transaction.type === "income") {
            incomeList.appendChild(listItem);
        } else {
            expensesList.appendChild(listItem);
        }
    });
}

// Function to Remove a Transaction
function removeTransaction(index) {
    const removedTransaction = transactions.splice(index, 1)[0];

    if (removedTransaction.type === "expense") {
        expenseCategories[removedTransaction.title] -= removedTransaction.amount;
        if (expenseCategories[removedTransaction.title] <= 0) {
            delete expenseCategories[removedTransaction.title];
        }
    }

    renderTransactions();
    updateBudget();
}

// Event Listeners for Transactions
btnIncome.addEventListener("click", () => {
    addTransaction("income", incomeText.value, incomeAmount.value);
    incomeText.value = "";
    incomeAmount.value = "";
});

btnExpenses.addEventListener("click", () => {
    addTransaction("expense", expensesText.value, expensesAmount.value);
    expensesText.value = "";
    expensesAmount.value = "";
});

// Signup Functionality (Integrate with Firebase)
signupBtn.addEventListener("click", async () => {
    const email = signupEmail.value;
    const password = signupPassword.value;

    if (!email || !password) {
        alert("Please enter a valid email and password.");
        return;
    }

    // Example Firebase signup
    // try {
    //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //     alert("Account created successfully!");
    // } catch (error) {
    //     alert(`Error: ${error.message}`);
    // }
});

// Login Functionality (Integrate with Firebase)
loginBtn.addEventListener("click", async () => {
    const email = loginEmail.value;
    const password = loginPassword.value;

    if (!email || !password) {
        alert("Please enter a valid email and password.");
        return;
    }

    // Example Firebase login
    // try {
    //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //     alert("Welcome back!");
    // } catch (error) {
    //     alert(`Error: ${error.message}`);
    // }
});

// Function to Update Chart
function updateChart() {
    const ctx = chatChart.getContext('2d');
    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(expenseCategories),
            datasets: [{
                label: 'Expense Breakdown',
                data: Object.values(expenseCategories),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Expenses Breakdown'
                }
            }
        }
    });
}

// Chatbot Functionality
chatBtn.addEventListener("click", () => {
    const userQuery = chatInput.value.trim().toLowerCase();
    if (userQuery === "") {
        chatResponse.textContent = "Please type a question.";
        return;
    }

    if (userQuery.includes("biggest expense")) {
        if (Object.keys(expenseCategories).length === 0) {
            chatResponse.textContent = "You have no recorded expenses.";
        } else {
            const maxCategory = Object.keys(expenseCategories).reduce((a, b) => expenseCategories[a] > expenseCategories[b] ? a : b);
            chatResponse.textContent = `Your biggest expense is on ${maxCategory} with $${expenseCategories[maxCategory].toFixed(2)}.`;
        }
    } else if (userQuery.includes("total expenses")) {
        chatResponse.textContent = `Your total expenses so far are $${totalExpenses.toFixed(2)}.`;
    } else {
        chatResponse.textContent = "I'm here to assist you with your budget. Try asking about your biggest expense or total expenses!";
    }

    chatInput.value = "";
});

// Initialize the app
function init() {
    updateBudget();
    renderTransactions();
}

init();