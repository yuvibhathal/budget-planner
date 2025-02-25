# Budget-Tracker
live : https://yuvibhathal.github.io/budget-planner/

A web application to help users track their income, expenses, and overall budget. Built with **Firebase** for authentication and database, **Chart.js** for visualizations, and **OpenAI API** for an AI-powered chatbot.

## Features

- **User Authentication**: Sign up, log in, and log out using Firebase Authentication.
- **Budget Overview**: View your balance, total income, and total expenses.
- **Add Transactions**: Add income and expense transactions with a title and amount.
- **Transaction History**: View a list of all transactions with the ability to delete them.
- **Expense Breakdown**: Visualize expenses by category using a pie chart.
- **Download Report**: Generate and download a PDF report of your budget.
- **AI Chatbot**: Ask questions about your budget and get AI-powered responses.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase (Authentication, Firestore)
- **Libraries**:
  - [Chart.js](https://www.chartjs.org/): For expense breakdown visualization.
  - [jsPDF](https://parall.ax/products/jspdf): For generating PDF reports.
  - [html2canvas](https://html2canvas.hertzen.com/): For capturing the chart as an image.
- **APIs**:
  - [OpenAI API](https://openai.com/api/): For AI-powered chatbot responses.

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge).
- A Firebase project with Authentication and Firestore enabled.
- An OpenAI API key (for the chatbot).

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yuvibhathal/budget-tracker.git
   cd budget-tracker
