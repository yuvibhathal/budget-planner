// Select Elements
const balanceEl = document.getElementById("balance-value");
const incomeEl = document.getElementById("addmoney");
const expensesEl = document.getElementById("submoney");
const incomeList = document.getElementById("income-list");
const expensesList = document.getElementById("expenses-list");
const incomeText = document.getElementById("income-text");
const incomeAmount = document.getElementById("income-amount");
const btnIncome = document.getElementById("btn-income");
const expensesText = document.getElementById("expenses-text");
const expensesAmount = document.getElementById("expenses-amount");
const btnExpenses = document.getElementById("btn-expenses");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const chatInput = document.getElementById("chat-input");
const chatBtn = document.getElementById("send-chat");
const chatResponse = document.getElementById("chat-response");
const chatChart = document.getElementById("expenses-chart");
const pdfBtn = document.getElementById("pdf-btn");
const loadingIndicator = document.getElementById("loading-indicator");
const chatbotBtn = document.getElementById("chatbot-btn");
const chatbotContainer = document.getElementById("chatbot-container");

// Variables
let transactions = [];
let totalIncome = 0;
let totalExpenses = 0;
let expenseCategories = {}; // Stores expenses by category
let expenseChart = null; // Holds the Chart.js instance

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiPWigkqncSKOQZ_sjR3LfhfY3urgvrz0",
  authDomain: "buget-tracker-8fec3.firebaseapp.com",
  projectId: "buget-tracker-8fec3",
  storageBucket: "buget-tracker-8fec3.appspot.com",
  messagingSenderId: "85873973556",
  appId: "1:85873973556:web:d7856618db9e11e12f2d61",
  measurementId: "G-ZNE1XT193K",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Firestore Collection Reference
const transactionsRef = collection(db, "transactions");

// Function to Update Budget Overview
function updateBudget() {
  totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  balanceEl.textContent = `$${balance.toFixed(2)}`;
  incomeEl.textContent = `$${totalIncome.toFixed(2)}`;
  expensesEl.textContent = `-$${totalExpenses.toFixed(2)}`;

  updateChart(); // Refresh chart when updating budget
}

// Function to Add Transaction
async function addTransaction(type, title, amount) {
  if (!auth.currentUser) {
    alert("You must be logged in to add a transaction.");
    return;
  }

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
      userId: auth.currentUser.uid, // Associate transaction with the logged-in user
    };
    await addDoc(transactionsRef, transaction);
    console.log("✅ Transaction added successfully!");
  } catch (error) {
    console.error("❌ Error adding transaction:", error);
    alert("Failed to add transaction. Please try again.");
  }
}

// Function to Render Transactions in the List
function renderTransactions() {
  incomeList.innerHTML = "";
  expensesList.innerHTML = "";

  transactions.forEach((transaction) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${transaction.title}: $${transaction.amount.toFixed(
      2
    )} 
            <button onclick="deleteTransaction('${transaction.id}')">X</button>`;

    if (transaction.type === "income") {
      incomeList.appendChild(listItem);
    } else {
      expensesList.appendChild(listItem);
    }
  });
}

// Function to Delete Transaction
async function deleteTransaction(id) {
  try {
    await deleteDoc(doc(db, "transactions", id));
    console.log("✅ Transaction deleted successfully!");
  } catch (error) {
    console.error("❌ Error deleting transaction:", error);
    alert("Failed to delete transaction. Please try again.");
  }
}

// Function to Listen for Real-Time Transaction Updates
function listenForTransactions() {
  const q = query(transactionsRef, orderBy("timestamp", "desc"));
  onSnapshot(q, (querySnapshot) => {
    transactions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    renderTransactions();
    updateBudget();
  });
}

// Function to Update Chart
function updateChart() {
  expenseCategories = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.title] = (acc[t.title] || 0) + t.amount;
      return acc;
    }, {});

  const ctx = chatChart.getContext("2d");
  if (expenseChart) {
    expenseChart.destroy();
  }

  expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(expenseCategories),
      datasets: [
        {
          label: "Expense Breakdown",
          data: Object.values(expenseCategories),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Expenses Breakdown",
        },
      },
    },
  });
}

// Signup Functionality
signupBtn.addEventListener("click", async () => {
  const email = signupEmail.value;
  const password = signupPassword.value;

  if (!email || !password) {
    alert("Please enter a valid email and password.");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("✅ Account created successfully!");
    signupEmail.value = ""; // Clear email field
    signupPassword.value = ""; // Clear password field
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
});

// Login Functionality
loginBtn.addEventListener("click", async () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  if (!email || !password) {
    alert("Please enter a valid email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("✅ Welcome back!");
    loginEmail.value = ""; // Clear email field
    loginPassword.value = ""; // Clear password field
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
});

// Logout Functionality
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("✅ Logged out successfully!");
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
});

// Track Authentication State
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ User signed in:", user.email);
    document.getElementById("user-email").textContent = `Logged in as: ${user.email}`;
    listenForTransactions(); // Start listening for transactions
  } else {
    console.log("❌ No user signed in");
    document.getElementById("user-email").textContent = "Not logged in";
  }
});

// Chatbot Functionality
chatBtn.addEventListener("click", async () => {
  const userQuery = chatInput.value.trim();
  if (userQuery === "") {
    chatResponse.textContent = "Please type a question.";
    return;
  }

  // Show loading indicator
  loadingIndicator.style.display = "block";
  chatResponse.textContent = "";

  try {
    // Call the OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Replace with your API key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Use the GPT-3.5 model
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for a budget tracking app.",
          },
          {
            role: "user",
            content: userQuery,
          },
        ],
      }),
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    // Display the bot's reply
    chatResponse.textContent = botReply;
  } catch (error) {
    console.error("❌ Error calling OpenAI API:", error);
    chatResponse.textContent = "Sorry, I couldn't process your request. Please try again.";
  } finally {
    // Hide loading indicator
    loadingIndicator.style.display = "none";
  }

  // Clear the chat input
  chatInput.value = "";
});

// Event Listeners for Transactions
btnIncome.addEventListener("click", () => {
  const title = incomeText.value.trim();
  const amount = incomeAmount.value.trim();

  if (!title || !amount) {
    alert("Please enter a valid title and amount.");
    return;
  }

  addTransaction("income", title, amount);
  incomeText.value = ""; // Clear income text field
  incomeAmount.value = ""; // Clear income amount field
});

btnExpenses.addEventListener("click", () => {
  const title = expensesText.value.trim();
  const amount = expensesAmount.value.trim();

  if (!title || !amount) {
    alert("Please enter a valid title and amount.");
    return;
  }

  addTransaction("expense", title, amount);
  expensesText.value = ""; // Clear expense text field
  expensesAmount.value = ""; // Clear expense amount field
});

// Download Report Functionality
pdfBtn.addEventListener("click", () => {
  const doc = new jspdf.jsPDF();

  // Add Budget Overview
  doc.setFontSize(18);
  doc.text("Budget Overview", 10, 20);
  doc.setFontSize(12);
  doc.text(`Balance: $${(totalIncome - totalExpenses).toFixed(2)}`, 10, 30);
  doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 10, 40);
  doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 10, 50);

  // Add Transaction History
  doc.setFontSize(18);
  doc.text("Transaction History", 10, 70);
  doc.setFontSize(12);
  let yPos = 80;
  transactions.forEach((transaction) => {
    doc.text(
      `${transaction.type === "income" ? "Income" : "Expense"}: ${
        transaction.title
      } - $${transaction.amount.toFixed(2)}`,
      10,
      yPos
    );
    yPos += 10;
  });

  // Add Expense Breakdown
  doc.setFontSize(18);
  doc.text("Expense Breakdown", 10, yPos + 10);
  doc.setFontSize(12);
  yPos += 20;
  Object.keys(expenseCategories).forEach((category) => {
    doc.text(`${category}: $${expenseCategories[category].toFixed(2)}`, 10, yPos);
    yPos += 10;
  });

  // Save the PDF
  doc.save("budget-report.pdf");
});

// Toggle Chatbox Visibility
chatbotBtn.addEventListener("click", () => {
  if (chatbotContainer.style.display === "none" || chatbotContainer.style.display === "") {
    chatbotContainer.style.display = "block"; // Show chatbox
    chatInput.focus(); // Focus on the input field
  } else {
    chatbotContainer.style.display = "none"; // Hide chatbox
  }
});

// Initialize the app
function init() {
  updateBudget();
  renderTransactions();
}

init();