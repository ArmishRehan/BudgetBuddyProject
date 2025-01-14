// Theme toggle functionality
const themeToggle = document.querySelector(".theme-toggle");
const html = document.documentElement;
const themeIcon = themeToggle.querySelector("i");

function toggleTheme() {
  if (html.classList.contains("light")) {
    html.classList.remove("light");
    html.classList.add("dark");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
    localStorage.setItem("theme", "dark");
  } else {
    html.classList.remove("dark");
    html.classList.add("light");
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
    localStorage.setItem("theme", "light");
  }
  updateChart();
}

// Check saved theme
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") {
  html.classList.remove("light");
  html.classList.add("dark");
  themeIcon.classList.remove("fa-moon");
  themeIcon.classList.add("fa-sun");
}

themeToggle.addEventListener("click", toggleTheme);

// Sidebar functionality
const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const closeSidebar = document.querySelector(".sidebar-close");

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-active");
});

closeSidebar.addEventListener("click", () => {
  sidebar.classList.remove("sidebar-active");
});

const ctx = document.getElementById("expensesChart").getContext("2d");
let expensesChart;

function initChart() {
  const isDark = html.classList.contains("dark");
  const textColor = isDark ? "#94a3b8" : "#64784b";
  const gradientFill = ctx.createLinearGradient(0, 0, 0, 4000);
  gradientFill.addColorStop(0, isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.2)");
  gradientFill.addColorStop(1, isDark ? "rgba(99,102,241,0)" : "rgba(99,102,241,0)");

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Expenses",
      data: [250, 300, 200, 250, 300, 200, 250, 300, 200, 250, 300, 200],
      borderColor: "#6366f1",
      backgroundColor: gradientFill,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#6366f1",
      pointBorderColor: isDark ? "#1e293b" : "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    }]
  };

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          titleColor: isDark ? "#ffffff" : "#1e293b",
          bodyColor: isDark ? "#ffffff" : "#1e293b",
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return "Rs " + context.parsed.y.toLocaleString();
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(100, 116, 139, 0.1)", drawBorder: false },
          ticks: { color: textColor, padding: 10, callback: function (value) { return "Rs " + value.toLocaleString(); } }
        },
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { color: textColor, padding: 10 }
        }
      }
    }
  };

  if (expensesChart) {
    expensesChart.destroy();
  }
  expensesChart = new Chart(ctx, config);
}

function updateChart() {
  initChart();
}

// Initialize chart
initChart();


// Active menu items
const menuItems = document.querySelectorAll(".menu-items");
menuItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    menuItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});

// Window resize handler
window.addEventListener("resize", () => {
  if (window.innerWidth > 1024) {
    document.querySelector(".sidebar").classList.remove("sidebar-active");
  }
});

// JavaScript for tab switching in the Transaction Overview section

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get all the tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Get all the tab content containers
    const tabContents = document.querySelectorAll('.tab-content');
  
    // Function to show the tab content and activate the clicked tab
    const switchTab = (tabId) => {
        // Hide all tab content and remove active class from all tab buttons
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active');
        });
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
  
        // Show the content of the clicked tab and activate the clicked tab button
        document.getElementById(tabId).classList.add('active');
        const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
        activeButton.classList.add('active');
    };
  
    // Attach click event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tabId = e.target.getAttribute('data-tab');
            switchTab(tabId); // Switch to the clicked tab
        });
    });
  
    // Initialize by showing the daily tab by default
    switchTab('daily');
  });
  
  
  function showTab(tabName) {
    // Get all category grids and tabs
    const grids = document.querySelectorAll('.category-grid');
    const tabs = document.querySelectorAll('.tab');
  
    // Loop through grids and tabs to toggle the active class
    grids.forEach(grid => {
      if (grid.id === tabName) {
        grid.classList.add('active');
      } else {
        grid.classList.remove('active');
      }
    });
  
    tabs.forEach(tab => {
      if (tab.innerText === tabName.toUpperCase()) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  
    // If "INCOME" is selected, scroll to the last row
    if (tabName === 'income') {
      const incomeGrid = document.getElementById('income');
      const lastCategory = incomeGrid.querySelector('.category:last-child'); // Get the last category
      if (lastCategory) {
        lastCategory.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }



//yaha se form wali js agayi ha jo server wali hugi
// Function to handle form submission
function handleTransactionSubmit(event) {
  event.preventDefault();

  // Collect form data
  const type = document.querySelector("#type").value;
  const date = document.querySelector("#date").value;
  const amount = document.querySelector("#amount").value;
  const category = document.querySelector("#category").value;
  const description = document.querySelector("#description").value;

  // Point 2: Log the data (debugging purpose)
  console.log({ type, date, amount, category, description });

  // Point 3: Form validation before submission
  if (!type || !date || !amount || !category || !description) {
    alert("Please fill in all fields.");
    return; // Prevent form submission
  }

  // Proceed with form submission (sending data to server)
  const transactionData = {
    type,
    date,
    amount,
    category,
    description,
  };

  // Send the data (you can use fetch to send it to the server)
  fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData)
  })
  .then(response => response.json())
  .then(data => {
    console.log("Response from server:", data); // Log the server response
    if (data.success) {
      alert('Transaction added successfully');
    } else {
      alert('Failed to add transaction');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error saving transaction');
  });

  // Reset form after submission
  event.target.reset();
}

// Add event listener to form
const form = document.querySelector("#transaction-form");
form.addEventListener("submit", handleTransactionSubmit);


//eman wala code
// Fetch the data from the server
fetch('/api/stats')
    .then(response => response.json())
    .then(data => {
        // Update the HTML elements with the fetched data
        document.getElementById('total-balance').textContent = data.total_balance + ' Rs';
        document.getElementById('total-expenses').textContent = data.total_expenses + ' Rs';
        document.getElementById('total-income').textContent = data.total_income + ' Rs';
    })
    .catch(error => {
        console.error('Error fetching stats:', error);
    });


    //recent wala
    // Fetch recent expense transactions when the page loads
window.onload = function() {
    // Fetch financial stats
    fetch("/api/stats")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("total-balance").textContent = data.total_balance + " Rs";
                document.getElementById("total-income").textContent = data.total_income + " Rs";
                document.getElementById("total-expenses").textContent = data.total_expenses + " Rs";
            } else {
                console.log(data.message);
            }
        })
        .catch(error => console.error("Error fetching stats:", error));

    // Fetch recent expense transactions
    fetch("/api/recent-transactions")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const transactionsTableBody = document.querySelector(".transactions-table tbody");

                // Clear the existing table rows
                transactionsTableBody.innerHTML = '';

                // Loop through the fetched transactions and populate the table
                data.transactions.forEach(transaction => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${transaction.transaction_id}</td>
                        <td>${transaction.date}</td>
                        <td>${transaction.amount} Rs</td>
                        <td>${transaction.category}</td>
                        <td>${transaction.description}</td>
                    `;
                    transactionsTableBody.appendChild(row);
                });
            } else {
                console.log(data.message);
            }
        })
        .catch(error => console.error("Error fetching transactions:", error));
};

// Select the table bodies for recent transactions, income breakdown, and expenses breakdown
const recentTransactionsTableBody = document.querySelector(".recent-transactions tbody");
const incomeBreakdownTableBody = document.querySelector(".income-breakdown tbody");
const expensesBreakdownTableBody = document.querySelector(".expenses-breakdown tbody");

// Select the table bodies for daily, weekly, monthly, and yearly transactions
const dailyTransactionsTableBody = document.querySelector("#daily-transactions");
const weeklyTransactionsTableBody = document.querySelector("#weekly-transactions");
const monthlyTransactionsTableBody = document.querySelector("#monthly-transactions");
const yearlyTransactionsTableBody = document.querySelector("#yearly-transactions");

fetch('/api/recent-transactions')
    .then(response => response.json())
    .then(data => {
        console.log("Fetched Data:", data); // Debug: Log the data from the API response

        if (data.success) {
            // Clear previous rows in all tables
            recentTransactionsTableBody.innerHTML = '';
            incomeBreakdownTableBody.innerHTML = '';
            expensesBreakdownTableBody.innerHTML = '';

            // Clear previous rows in all tables
            dailyTransactionsTableBody.innerHTML = '';
            weeklyTransactionsTableBody.innerHTML = '';
            monthlyTransactionsTableBody.innerHTML = '';
            yearlyTransactionsTableBody.innerHTML = '';

            // Loop through the transactions and populate the tables
            data.transactions.forEach(transaction => {
                console.log("Processing Transaction:", transaction); // Debug: Log each transaction

               // Parse the transaction date
               const transactionDate = new Date(transaction.date);
               const today = new Date();
            const todayString = today.toDateString(); // Get today's date as string

            // Get the start and end of the current week
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay()); // Set to the start of the week (Sunday)
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6); // Set to the end of the week (Saturday)

            // Get the current month and year
            const year = today.getFullYear();
            const month = today.getMonth();
              
              

                 // Create a new row for the transaction
                 const row = document.createElement("tr");
                 row.innerHTML = `
                     <td>${transaction.category}</td>
                     <td>${transaction.amount}</td>
                 `;
                
                // Populate the row with transaction details
                row.innerHTML = `
                   <td>${transaction.transaction_id}</td>
                   <td>${transaction.date}</td>
                   <td>${transaction.amount}</td>
                   <td>${transaction.category}</td>
                   <td>${transaction.description}</td>
`;
                // Categorize the transaction based on the date
                if (transactionDate.toDateString() === today.toDateString()) {
                  // Daily Transaction
                  dailyTransactionsTableBody.appendChild(row.cloneNode(true));
              }

              if (transactionDate >= weekStart && transactionDate <= weekEnd) {
                  // Weekly Transaction
                  weeklyTransactionsTableBody.appendChild(row.cloneNode(true));
              }

              if (transactionDate.getFullYear() === year && transactionDate.getMonth() === month) {
                  // Monthly Transaction
                  monthlyTransactionsTableBody.appendChild(row.cloneNode(true));
              }

              if (transactionDate.getFullYear() === year) {
                  // Yearly Transaction
                  yearlyTransactionsTableBody.appendChild(row.cloneNode(true));
              }

                // Append the row to the Recent Transactions table
                recentTransactionsTableBody.appendChild(row.cloneNode(true));

                // If the transaction is an expense, append to the Expenses Breakdown table
                if (transaction.type === 'Expense') {
                    console.log("Appending to Expenses Breakdown:", transaction); // Debug
                    expensesBreakdownTableBody.appendChild(row.cloneNode(true));
                }
                // If the transaction is an income, append to the Income Breakdown table
                if (transaction.type === 'Income') {
                    console.log("Appending to Income Breakdown:", transaction); // Debug
                    incomeBreakdownTableBody.appendChild(row.cloneNode(true));
                }
            });
        } else {
            console.log("Error:", data.message);
        }
    })
    
    .catch(error => {
        console.error("Error fetching transactions:", error);
    });