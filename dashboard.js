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

// Chart initialization
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
                    `;
                    transactionsTableBody.appendChild(row);
                });
            } else {
                console.log(data.message);
            }
        })
        .catch(error => console.error("Error fetching transactions:", error));
};
