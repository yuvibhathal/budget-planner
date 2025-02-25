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
const chatChart = document.getElementById('expense-chart'); // Ensure you have a <canvas> with this ID

// Variables
let transactions = [];
let totalIncome = 0;
let totalExpenses = 0;
let expenseCategories = {}; // Stores expenses by category

// Function to Update Budget Overview
function updateBudget() {
    totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    totalExpenses = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    let balance = totalIncome - totalExpenses;

    balanceEl.textContent = `$${balance}`;
    incomeEl.textContent = `$${totalIncome}`;
    expensesEl.textContent = `-$${totalExpenses}`;

    updateChart(); // Refresh chart when updating budget
}

// Function to Add Transaction
function addTransaction(type, title, amount) {
    if (!title || amount <= 0) {
        alert("Please enter a valid title and amount.");
        return;
    }
    
    let transaction = { type, title, amount: parseFloat(amount) };
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
        let listItem = document.createElement('li');
        listItem.innerHTML = `${transaction.title}: $${transaction.amount} 
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
    let removedTransaction = transactions.splice(index, 1)[0];

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

// Signup Functionality (Update this with Firebase Authentication if needed)
signupBtn.addEventListener("click", () => {
    if (signupEmail.value && signupPassword.value) {
        alert("Account created successfully! (Connect with Firebase for real auth)");
    } else {
        alert("Please enter a valid email and password.");
    }
});

// Login Functionality (Update this with Firebase Authentication if needed)
loginBtn.addEventListener("click", () => {
    if (loginEmail.value && loginPassword.value) {
        alert("Welcome back! (Connect with Firebase for real auth)");
    } else {
        alert("Please enter a valid email and password.");
    }
});

// Function to Update Chart
function updateChart() {
    let ctx = chatChart.getContext('2d');
    if (window.expenseChart) {
        window.expenseChart.destroy();
    }

    window.expenseChart = new Chart(ctx, {
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
            let maxCategory = Object.keys(expenseCategories).reduce((a, b) => expenseCategories[a] > expenseCategories[b] ? a : b);
            chatResponse.textContent = `Your biggest expense is on ${maxCategory} with $${expenseCategories[maxCategory]}.`;
        }
    } else if (userQuery.includes("total expenses")) {
        chatResponse.textContent = `Your total expenses so far are $${totalExpenses}.`;
    } else {
        chatResponse.textContent = "I'm here to assist you with your budget. Try asking about your biggest expense or total expenses!";
    }

    chatInput.value = "";
});
