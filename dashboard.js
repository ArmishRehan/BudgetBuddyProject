//theme toggle functionality
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
const saveTheme = localStorage.getItem("theme") || "light";
if (saveTheme === "dark") {
  html.classList.remove("light");
  html.classList.add("dark");
  themeIcon.classList.remove("fa-moon");
  themeIcon.classList.add("fa-sun");
}

themeToggle.addEventListener("click", toggleTheme);

//sidebar function
const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const closeSidebar = document.querySelector(".sidebar-close");

sidebarToggle.addEventListener("click", ()=>{
    if(sidebar.classList.contains("sidebar-active")){
        sidebar.classList.remove("sidebar-active");
    }
    else{
        sidebar.classList.add("sidebar-active");
    }
});

closeSidebar.addEventListener("click", ()=>{
    sidebar.classList.remove("sidebar-active");
});

// Chart implementation
const ctx = document.getElementById("expensesChart").getContext("2d");
let expensesChart;

function initChart() {
  console.log("Chart initialization started");
  const isDark = html.classList.contains("dark");
  const textColor = isDark ? "#94a3b8" : "#64784b";
  const gradientFill = ctx.createLinearGradient(0, 0, 0, 4000);

  gradientFill.addColorStop(
    0,
    isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.2)"
  );
  gradientFill.addColorStop(
    1,
    isDark ? "rgba(99,102,241,0)" : "rgba(99,102,241,0)"
  );

  // Update data for total expenses = 3000
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Expenses",
        data: [
          250, 300, 200, 250, 300, 200, 250, 300, 200, 250, 300, 200,
        ], // Adjusted data to sum up to 3000
        borderColor: "#6366f1",
        backgroundColor: gradientFill,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: isDark ? "#1e293b" : "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Chart configuration
  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          titleColor: isDark ? "#ffffff" : "#1e293b",
          bodyColor: isDark ? "#ffffff" : "#1e293b",
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return "Rs " + context.parsed.y.toLocaleString();
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: isDark
              ? "rgba(148, 163, 184, 0.1)"
              : "rgba(100, 116, 139, 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: textColor,
            padding: 10,
            callback: function (value) {
              return "Rs " + value.toLocaleString();
            },
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: textColor,
            padding: 10,
          },
        },
      },
    },
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


//active meni items
const menuItems = document.querySelectorAll(".menu-items");

menuItems.forEach((item) =>{
  item.addEventListener("click", (e) =>{
    e.preventDefault();
    menuItems.forEach((i)=> i.classList.remove("active"));
    item.classList.add("active");
  });
});



//window resize handler
window.addEventListener("resize", () => {
    if(window.innerWidth > 1024) {
        document.querySelector(".sidebar").classList.remove
        ("sidenar-active");
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

//EXPENSE OR INCOME
document.addEventListener('DOMContentLoaded', function () {
  // Initial values for Total Income, Total Expenses, and Total Balance
  let totalBalance = 0;
  let totalIncome = 0;
  let totalExpenses = 0;
  let expenseTransactionIdCounter = 1; // For expenses
  let incomeTransactionIdCounter = 1; // For income transactions

  // Function to add a new transaction
  function addTransaction(event) {
      event.preventDefault();

      const category = document.getElementById("category").value;
      const amount = parseFloat(document.getElementById("amount").value);
      const description = document.getElementById("description").value;
      const type = document.querySelector('input[name="type"]:checked').value;
      const date = document.getElementById("transaction-date").value;

      if (isNaN(amount) || amount <= 0) {
          alert("Please enter a valid amount.");
          return;
      }

      if (!date) {
          alert("Please select a valid date.");
          return;
      }

      // Update totals based on the transaction type
      if (type === "expense") {
          totalExpenses += amount; // Increase expenses for expense type
      } else if (type === "income") {
          totalIncome += amount; // Increase income for income type
      }

      // Calculate total balance as the difference between income and expenses
      totalBalance = totalIncome - totalExpenses;

      // Update the stats values on the page
      const totalBalanceElem = document.getElementById("total-balance");
      const totalExpensesElem = document.getElementById("total-expenses");
      const totalIncomeElem = document.getElementById("total-income");

      if (totalBalanceElem && totalExpensesElem && totalIncomeElem) {
          totalBalanceElem.textContent = `${totalBalance} Rs`;
          totalExpensesElem.textContent = `${totalExpenses} Rs`;
          totalIncomeElem.textContent = `${totalIncome} Rs`;
      }

      // Add the transaction to the Recent Transactions table (for expenses)
      if (type === "expense") {
          const transactionTable = document.querySelector(".transactions-table tbody");

          // Ensure the table exists before appending
          if (transactionTable) {
              // Create a new row for the recent expense transaction
              const newRow = document.createElement("tr");
              newRow.innerHTML = `
                  <td>${expenseTransactionIdCounter}</td>
                  <td>${date}</td>
                  <td style="font-weight: 600;">Rs ${amount}</td>
                  <td>${description}</td>
              `;
              transactionTable.appendChild(newRow);
          }

          // Add the transaction to the Expenses Breakdown table
          const expenseBreakdownTable = document.querySelector(".expenses-breakdown .transactions-table tbody");

          // Ensure the table exists before appending
          if (expenseBreakdownTable) {
              // Create a new row for the expense breakdown
              const newExpenseRow = document.createElement("tr");
              newExpenseRow.innerHTML = `
                  <td>${expenseTransactionIdCounter}</td>
                  <td>${date}</td>
                  <td style="font-weight: 600;">Rs ${amount}</td>
                  <td>${category}</td>
              `;
              expenseBreakdownTable.appendChild(newExpenseRow);
          }

          // Increment the expense transaction ID counter for the next expense
          expenseTransactionIdCounter++;
      }

      // Add the transaction to the Income Breakdown table (for incomes)
      if (type === "income") {
          const incomeTable = document.querySelector(".income-breakdown .transactions-table tbody");

          // Ensure the table exists before appending
          if (incomeTable) {
              // Create a new row for the recent income transaction
              const newIncomeRow = document.createElement("tr");
              newIncomeRow.innerHTML = `
                  <td>${incomeTransactionIdCounter}</td>
                  <td>${date}</td>
                  <td style="font-weight: 600;">Rs ${amount}</td>
                  <td>${category}</td>
              `;
              incomeTable.appendChild(newIncomeRow);
          }

          // Increment the income transaction ID counter for the next income
          incomeTransactionIdCounter++;
      }

      // Clear the form after submitting
      document.getElementById("category").value = "";
      document.getElementById("amount").value = "";
      document.getElementById("description").value = "";
      document.querySelector('input[name="type"]:checked').checked = false;
      document.getElementById("transaction-date").value = "";
  }

  // Attach event listener to form
  document.getElementById("transaction-form").addEventListener("submit", addTransaction);
});

  