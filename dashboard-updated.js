//let apiUrl = "https://connatepeople.com/";

// Token check
function checkToken() {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    window.location.href = "login.html";
    return false;
  }
  return accessToken;
}

document.addEventListener("DOMContentLoaded", () => {
  // Fetch employee name from localStorage
  const userName = localStorage.getItem("employee_name");
  const userId = localStorage.getItem("employeeId");

  console.log("userName:", localStorage.getItem("employee_name"));
  console.log("userId:", localStorage.getItem("employeeId"));

  // Update the username display somewhere else on the page
  if (userName) {
    document.getElementById("user_name_display").textContent = userName;

    // Populate the Employee input field in expense form
    const employeeInput = document.querySelector(
      '#expenseForm input[name="employee"]'
    );
    if (employeeInput) {
      employeeInput.value = userName;
      employeeInput.readOnly = true; // Optional: prevent manual editing
    }
  } else {
    document.getElementById("user_name_display").textContent = "Guest";

    // If no logged-in user, keep employee field empty and editable
    const employeeInput = document.querySelector(
      '#expenseForm input[name="employee"]'
    );
    if (employeeInput) {
      employeeInput.value = "";
      employeeInput.readOnly = false;
    }
  }

  // Hide sections if needed
  document.getElementById("manage_unassignedtickets").style.display = "none";
  document.getElementById("manage_mytickets").style.display = "none";
  document.getElementById("manage-recent-tickets").style.display = "none";
  document.getElementById("expenseForm").style.display = "none";

  loadCaseCounts();
  fetchExpenses();
  fetchRecentTickets();
  fetchMyTickets();
  fetchUnassignedTickets();
});

let AssigneeEnum = {};
const StatusEnum = {
  NOT_STARTED: { id: 1, name: "Not Started" },
  IN_PROGRESS: { id: 2, name: "In Progress" },
  UAT: { id: 6, name: "UAT" },
  P2P: { id: 7, name: "P2P" },
  PROD_VALIDATION: { id: 8, name: "PROD - Validation" },
  ESCALATED: { id: 3, name: "Escalated" },
  RE_OPENED: { id: 4, name: "Re-Opened" },
  ON_HOLD: { id: 10, name: "ON HOLD" },
  DUPLICATE: { id: 9, name: "Duplicate" },
  CLOSED: { id: 5, name: "Closed" },
};
const PriorityEnum = {
  CRITICAL: { id: 4, name: "Critical" },
  HIGH: { id: 1, name: "High" },
  MEDIUM: { id: 2, name: "Medium" },
  LOW: { id: 3, name: "Low" },
};

function viewHome() {
  currentActiveSection = "home";
  document.getElementById("home-card").style.display = "inline-block";
  document.getElementById("manage-recent-tickets").style.display = "none";
  document.getElementById("manage_mytickets").style.display = "none";
  document.getElementById("manage_unassignedtickets").style.display = "none";
  document.getElementById("ticket-table-card").style.display = "none";
  document.getElementById("manage_ticket").style.display = "none";
  document.getElementById("expenseForm").style.display = "none";
  document.getElementById("grid-view-ticket").style.display = "none";
  const active_user = localStorage.getItem("active_user");
  // if (active_user == "Admin" || !active_user) {
  //   document.getElementById("manageRoleTile").style.visibility = "block";
  //   document.getElementById("newUserTile").style.visibility = "block";
  // } else {
  //   document.getElementById("manageRoleTile").style.display = "none";
  //   document.getElementById("newUserTile").style.display = "none";
  // }
  let user_name = localStorage.getItem("user_name");
}

function loadrecenttickets() {
  currentActiveSection = "recenttickets";
  document.getElementById("manage-recent-tickets").style.display =
    "inline-block";
  document.getElementById("ticket-table-card").style.display = "none";
  document.getElementById("manage_ticket").style.display = "none";
  document.getElementById("home-card").style.display = "none";
  document.getElementById("expenseForm").style.display = "none";
  document.getElementById("manage_mytickets").style.display = "none";
  document.getElementById("manage_unassignedtickets").style.display = "none";
  document.getElementById("grid-view-ticket").style.display = "none";

  // Ensure the recent tickets table card is visible
  document.getElementById("recentticket-table-card").style.display = "block";

  // Refresh the recent tickets data
  fetchRecentTickets();
}

async function fetchRecentTickets() {
  const tbody = document.getElementById("recentticket-table-body");
  tbody.innerHTML = "";

  try {
    const response = await fetch("/api/user/recent-tickets/");
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const tickets = Array.isArray(data) ? data : [data];

    if (tickets.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center">No tickets found</td></tr>`;
      return;
    }

    const paginationId = "recentticket-pagination";
    localStorage.setItem(paginationId, JSON.stringify(tickets));
    currentPages[paginationId] = 1;

    // Use shared paginator
    paginateTickets(tickets, "recentticket-table-body", paginationId);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Unable to load tickets</td></tr>`;
  }
}

function loadmytickets() {
  currentActiveSection = "mytickets";
  document.getElementById("manage-recent-tickets").style.display = "none";
  document.getElementById("manage_unassignedtickets").style.display = "none";
  document.getElementById("ticket-table-card").style.display = "none";
  document.getElementById("manage_ticket").style.display = "none";
  document.getElementById("home-card").style.display = "none";
  document.getElementById("expenseForm").style.display = "none";
  document.getElementById("manage_mytickets").style.display = "inline-block";
  document.getElementById("grid-view-ticket").style.display = "none";

  // Ensure the my tickets table card is visible
  document.getElementById("myticket-table-card").style.display = "block";

  // Refresh the my tickets data
  fetchMyTickets();
}

// Fetch My Tickets
async function fetchMyTickets() {
  const tbody = document.getElementById("myticket-table-body");
  if (!tbody) {
    console.error("❌ myticket-table-body not found!");
    return;
  }

  tbody.innerHTML = "";

  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      window.location.href = "login.html";
      return;
    }

    const employeeId = localStorage.getItem("employeeId");
    if (!employeeId) {
      console.error("❌ Employee ID not found in localStorage");
      tbody.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Employee ID not found. Please log in again.</td></tr>`;
      return;
    }

    const response = await fetch("/api/user/mytickets/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ employeeId: employeeId }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    const tickets = Array.isArray(data) ? data : [data];

    if (tickets.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center">No tickets assigned to you</td></tr>`;
      return;
    }

    const paginationId = "myticket-pagination";
    localStorage.setItem(paginationId, JSON.stringify(tickets));
    currentPages[paginationId] = 1;

    // Use shared paginator
    paginateTickets(tickets, "myticket-table-body", paginationId);

    console.log("✅ My tickets loaded successfully");
  } catch (error) {
    console.error("❌ Error fetching my tickets:", error);
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Unable to load tickets: ${error.message}</td></tr>`;
  }
}
function loadunassignedtickets() {
  currentActiveSection = "unassignedtickets";
  document.getElementById("manage_unassignedtickets").style.display =
    "inline-block";
  document.getElementById("manage-recent-tickets").style.display = "none";
  document.getElementById("ticket-table-card").style.display = "none";
  document.getElementById("manage_ticket").style.display = "none";
  document.getElementById("home-card").style.display = "none";
  document.getElementById("expenseForm").style.display = "none";
  document.getElementById("manage_mytickets").style.display = "none";
  document.getElementById("grid-view-ticket").style.display = "none";

  // Ensure the unassigned tickets table card is visible
  document.getElementById("unassignedticket-table-card").style.display =
    "block";

  // Refresh the unassigned tickets data
  fetchUnassignedTickets();
}

// Fetch Unassigned Tickets
async function fetchUnassignedTickets() {
  const tbody = document.getElementById("unassignedticket-table-body");
  if (!tbody) {
    console.error("❌ unassignedticket-table-body not found!");
    return;
  }

  tbody.innerHTML = "";

  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      window.location.href = "login.html";
      return;
    }

    const response = await fetch("/api/user/unassigned-tickets/", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const tickets = Array.isArray(data) ? data : [data];

    if (tickets.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center">No unassigned tickets found</td></tr>`;
      return;
    }

    const paginationId = "unassignedticket-pagination";
    localStorage.setItem(paginationId, JSON.stringify(tickets));
    currentPages[paginationId] = 1;

    // Use shared paginator
    paginateTickets(tickets, "unassignedticket-table-body", paginationId);
  } catch (error) {
    console.error("❌ Error fetching unassigned tickets:", error);
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Unable to load tickets</td></tr>`;
  }
}

async function loadCaseCounts() {
  try {
    const response = await fetch("/api/user/case_count/"); // Django endpoint
    const data = await response.json();

    document.getElementById("high-count").textContent = data.high ?? 0;
    document.getElementById("medium-count").textContent = data.medium ?? 0;
    document.getElementById("low-count").textContent = data.low ?? 0;
  } catch (error) {
    console.error("Error loading case counts:", error);
  }
}

//Expense Form Start
function expenseReport() {
  document.getElementById("ticket-table-card").style.display = "none";
  document.getElementById("manage_ticket").style.display = "none";
  document.getElementById("home-card").style.display = "none";
  document.getElementById("expenseForm").style.display = "inline-block";
}

// Auto-fill today's date
// document.getElementById('todayDate').valueAsDate = new Date();

// Add new row
function addRow() {
  let table = document
    .getElementById("expenseTable")
    .getElementsByTagName("tbody")[0];
  let rowCount = table.rows.length;
  let row = table.insertRow();
  row.innerHTML = `
        <td>${rowCount + 1}</td>
        <td><input type="date" required></td>
        <td>
          <select required>
            <option value="">Select</option>
            <option>Travel</option>
            <option>Meals</option>
            <option>Supplies</option>
            <option>Other</option>
          </select>
        </td>
        <td><input type="text" value="USD"></td>
        <td><input type="number" step="0.01"></td>
        <td><input type="number" step="0.01"></td>
        <td><input type="number" step="1"></td>
        <td><button type="button" class="expense-btn expense-btn-danger" onclick="removeRow(this)">Delete</button></td>
      `;
}

// Remove row
function removeRow(button) {
  let row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);
  updateSerialNumbers();
}

// Update Sr. No after deleting rows
function updateSerialNumbers() {
  let rows = document.querySelectorAll("#expenseTable tbody tr");
  rows.forEach((row, index) => {
    row.cells[0].textContent = index + 1;
  });
}

// Reset form on Save (just as example)
// document.getElementById('expenseForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     alert('Form Saved!');
//     this.reset();
//     document.getElementById('todayDate').valueAsDate = new Date();
// });

document
  .getElementById("expenseForm")
  .addEventListener("submit", submitExpenseForm);

// ✅ Helper function to convert YYYY-MM-DD → YYYY-MM-DD (API format)
function formatDateToYMD(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${year}-${month}-${day}`;
}

async function submitExpenseForm(event) {
  event.preventDefault();

  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    window.location.href = "login.html";
    return;
  }

  const employeeId = localStorage.getItem("employeeId");
  if (!employeeId) {
    alert("Employee ID not found! Please log in again.");
    return;
  }

  // ✅ Collect form-level dates
  const trandateRaw = document.querySelector("input[name='date']").value;
  const postingDateRaw = document.querySelector(
    "input[name='posting_date']"
  ).value;

  const trandate = formatDateToYMD(trandateRaw);
  const postingDate = postingDateRaw
    ? formatDateToYMD(postingDateRaw)
    : trandate; // fallback to trandate if empty

  const currency = parseInt(
    document.querySelector("select[name='currency']").value
  );
  const exchangerate =
    parseFloat(document.querySelector("input[name='exchange_rate']").value) ||
    1;
  const postingPeriod = 209;

  // ✅ Collect expense rows
  const expenseRows = document.querySelectorAll("#expenseTable tbody tr");
  const expenses = [];

  expenseRows.forEach((row) => {
    const dateInput = row.querySelector("td:nth-child(2) input");
    const categorySelect = row.querySelector("td:nth-child(3) select");
    const expenseAccountSelect = row.querySelector("td:nth-child(4) select");
    const currencySelect = row.querySelector("td:nth-child(5) select");
    const amountInput = row.querySelector("td:nth-child(6) input");
    const rateInput = row.querySelector("td:nth-child(7) input");
    const quantityInput = row.querySelector("td:nth-child(8) input");

    // Skip invalid rows
    if (
      !dateInput.value ||
      !categorySelect.value ||
      !expenseAccountSelect.value ||
      !amountInput.value
    )
      return;

    expenses.push({
      categoryText: categorySelect.value, // ✅ API expects "categoryText"
      lineDate: formatDateToYMD(dateInput.value), // ✅ API expects "lineDate"
      amount: parseFloat(amountInput.value) || 0,
      quantity: parseInt(quantityInput.value) || 0,
      currencys: parseInt(currencySelect.value), // ✅ API expects int
      expenseaccount: parseInt(expenseAccountSelect.value), // ✅ API expects int
      rate: parseFloat(rateInput.value) || 0,
    });
  });

  // ✅ Prevent empty expense submissions
  if (expenses.length === 0) {
    alert("Please add at least one expense entry.");
    return;
  }

  // ✅ Final payload
  const payload = {
    entity: parseInt(employeeId),
    trandate: trandate, // ✅ YYYY-MM-DD
    postingdate: postingDate, // ✅ YYYY-MM-DD
    postingperiod: postingPeriod,
    currency: currency,
    exchangerate: exchangerate,
    expenses: expenses,
  };

  console.log("🚀 Final Payload:", payload);

  // ✅ Send API request
  try {
    const response = await fetch("/api/user/expense/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(payload),
    });

    console.log("📡 API Status:", response.status);

    if (!response.ok) {
      const errMsg = await response.text();
      console.error("❌ API Error:", errMsg);
      alert("API failed: " + errMsg);
      return;
    }

    const result = await response.json();
    console.log("✅ API Response:", result);

    alert("Expense submitted successfully!");
    document.getElementById("expenseForm").reset();
  } catch (error) {
    console.error("🔥 Fetch Error:", error);
    alert("Failed to submit expense. Please try again.");
  }
}

//Expense form end

//Fetch recent Vendors start
document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#vendor-table tbody");

  fetch("/api/user/recent-vendors/") // Call your Django API
    .then((response) => response.json())
    .then((data) => {
      tableBody.innerHTML = ""; // Clear loading row

      if (data.vendors && data.vendors.length > 0) {
        data.vendors.forEach((vendor) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${vendor.vendorId}</td>
              <td>${vendor.companyName}</td>
              <td>${vendor.primarySubsidiary}</td>
              <td>${vendor.createdDate}</td>
            `;
          tableBody.appendChild(row);
        });
      } else {
        tableBody.innerHTML = '<tr><td colspan="4">No vendors found</td></tr>';
      }
    })
    .catch((error) => {
      tableBody.innerHTML = `<tr><td colspan="4">Error loading vendors: ${error}</td></tr>`;
      console.error("Error fetching vendors:", error);
    });
});

//Fetch recent Vendors end

//Fetch recent expenses start
async function fetchExpenses() {
  const employeeId = localStorage.getItem("employeeId");
  if (!employeeId) {
    console.warn("Employee ID missing!");
    showNoExpensesMessage("Please log in to view your expense reports.");
    return;
  }

  try {
    const response = await fetch("/api/user/uiexpenses/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch expenses: ${response.status}`);
    }

    const data = await response.json();
    const tbody = document.querySelector("#expenseReportsTable tbody");

    if (!tbody) {
      console.error("Expense reports table body not found!");
      return;
    }

    // Clear the table
    tbody.innerHTML = "";

    // Check if data is empty or no expenses found
    if (!data || data.length === 0) {
      showNoExpensesMessage();
      return;
    }

    // Populate the table with expense data
    data.forEach((exp) => {
      const row = `<tr>
        <td>${exp.id || "N/A"}</td>
        <td>${exp.tranid || "N/A"}</td>
        <td>${exp.status || "N/A"}</td>
        <td>${exp.date || "N/A"}</td>
        <td>${exp.amount || "0.00"}</td>
      </tr>`;
      tbody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    showNoExpensesMessage("Error loading expense reports. Please try again.");
  }
}

// Function to show "no expenses" message
function showNoExpensesMessage(message = "No expense reports found.") {
  const tbody = document.querySelector("#expenseReportsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="text-center no-expenses-message">
        <div style="padding: 40px 20px; color: #6c757d;">
          <i class="fas fa-file-invoice-dollar" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
          <p style="font-size: 16px; margin: 0;">${message}</p>
          <p style="font-size: 14px; margin: 10px 0 0 0; opacity: 0.7;">
            You haven't submitted any expense reports yet.
          </p>
        </div>
      </td>
    </tr>
  `;
}
//Fetch recent expenses end

document.addEventListener("DOMContentLoaded", () => {
  fetchCustomersSetupFilterDropdown("filterCustomer");
});

// Open form filter
function open_form_filter() {
  currentActiveSection = "viewalltickets";
  localStorage.removeItem("tickets");
  localStorage.removeItem("fromDate");
  localStorage.removeItem("toDate");

  const ticketsBody = document.getElementById("ticket-table-body");
  if (ticketsBody) ticketsBody.innerHTML = "";

  const showIds = [
    "filter-section",
    "fromDateFilter",
    "toDateFilter",
    "ticket-table-card",
    "manage_ticket",
  ];
  const hideIds = [
    "manage-user-card",
    "user-table-card",
    "grid-view-ticket",
    "home-card",
    "manage_role",
    "applyFilterButton",
    "filterCondition",
    "ticketTableFilter",
    "expenseForm",
    "manage-recent-tickets",
    "manage_mytickets",
    "manage_unassignedtickets",
  ];

  showIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
  });

  hideIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

// Attach event listener after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check token
  if (!checkToken()) return;

  // Attach click handler to all "View Ticket" links
  document.querySelectorAll(".view-ticket").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default link behavior
      open_form_filter();
    });
  });
});

function paginateMainTickets(tickets, filter_data = false) {
  localStorage.setItem("ticket-pagination", JSON.stringify(tickets));
  paginateTickets(
    tickets,
    "ticket-table-body",
    "ticket-pagination",
    filter_data
  );
}

async function showTicket() {
  document.getElementById("filterCondition").style.display = "none";
  document.getElementById("error-message").style.display = "none";
  document.getElementById("fromDate").classList.remove("input-error");
  document.getElementById("toDate").classList.remove("input-error");

  let fromDate = localStorage.getItem("fromDate");
  let toDate = localStorage.getItem("toDate");
  let customerId = localStorage.getItem("customerId"); // previous stored value

  // Read current input values if not in localStorage
  if (!fromDate || !toDate) {
    fromDate = document.getElementById("fromDate").value;
    toDate = document.getElementById("toDate").value;
  }

  // Always read current dropdown value
  const dropdown = document.getElementById("filterCustomer");
  if (dropdown) {
    customerId = dropdown.value; // <-- get selected customer
  }

  localStorage.setItem("fromDate", fromDate);
  localStorage.setItem("toDate", toDate);
  localStorage.setItem("customerId", customerId);

  if (!fromDate || !toDate) {
    document.getElementById("error-message").style.display = "block";
    if (!fromDate)
      document.getElementById("fromDate").classList.add("input-error");
    if (!toDate) document.getElementById("toDate").classList.add("input-error");
    return;
  }

  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("loader-overlay").style.display = "block";

  try {
    const response = await fetch("/api/user/getCases/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ fromDate, toDate, customerId }), // include customerId
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }
    if (!response.ok) throw new Error("Network response was not ok");

    const tickets = await response.json();
    if (!Array.isArray(tickets))
      throw new TypeError("Data received is not an array.");

    localStorage.setItem("tickets", JSON.stringify(tickets));

    currentPages["ticket-pagination"] = 1;
    paginateMainTickets(tickets);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  } finally {
    document.getElementById("loader-overlay").style.display = "none";
  }

  document.getElementById("manage-recent-tickets").style.display = "none";
  document.getElementById("ticket-table-card").style.display = "block";
  document.getElementById("grid-view-ticket").style.display = "none";
  document.getElementById("manage_ticket").style.display = "block";
  document.getElementById("fromDateFilter").style.display = "none";
  document.getElementById("toDateFilter").style.display = "none";
  document.getElementById("filter-section").style.display = "none";
  document.getElementById("ticketTableFilter").style.display = "block";

  const ticketData = JSON.parse(localStorage.getItem("tickets"));
  const assignees = [...new Set(ticketData.map((ticket) => ticket.AssignedTo))];
  fetchAssigneesSetupFilterDropdown("filterAssignedTo", assignees, "");
  fetchCustomersSetupFilterDropdown("filterCustomer", customerId); // pre-select the customer
}

function showFilter(filterType) {
  const assignedToContainer = document.getElementById(
    "filterAssignedToContainer"
  );
  const ticketNumberContainer = document.getElementById(
    "filterTicketNumberContainer"
  );
  const assignedToLink = document.getElementById("filterByAssignedToLink");
  const ticketNumberLink = document.getElementById("filterByTicketNumberLink");

  // Reset visibility
  assignedToContainer.style.display = "none";
  ticketNumberContainer.style.display = "none";
  assignedToLink.classList.remove("active");
  ticketNumberLink.classList.remove("active");

  // Show selected filter and highlight link
  if (filterType === "assignedTo") {
    assignedToContainer.style.display = "block";
    assignedToLink.classList.add("active");
  } else if (filterType === "ticketNumber") {
    ticketNumberContainer.style.display = "block";
    ticketNumberLink.classList.add("active");
  }

  // Display the filter row
  document.getElementById("filterCondition").style.display = "flex";
  document.getElementById("applyFilterButton").style.display = "block";
}

async function applyTableFilters() {
  const assignedToFilter = document.getElementById("filterAssignedTo").value;
  const ticketNumberFilter = document
    .getElementById("filterTicketNumber")
    .value.toLowerCase();
  const ticketData = JSON.parse(localStorage.getItem("tickets")) || [];

  // Fetch assignees for name mapping
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    window.location.href = "login.html";
    return;
  }

  let assignees = [];
  try {
    const response = await fetch("/api/user/getAssignee/", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch assignees. Status: ${response.status}`);
    }

    assignees = await response.json();
  } catch (error) {
    console.error("Error fetching assignees:", error);
  }

  // Start with all tickets and apply filters cumulatively
  let filteredTickets = ticketData;

  // Apply ticket number filter if value exists
  if (ticketNumberFilter) {
    filteredTickets = filteredTickets.filter((ticket) => {
      const ticketNumber = ticket.TicketNumber || ticket.ticketNumber || "";
      return ticketNumber.toLowerCase().includes(ticketNumberFilter);
    });
    console.log(
      `After ticket number filter: ${filteredTickets.length} tickets`
    );
  }

  // Apply assigned-to filter if value exists (not empty/not "All")
  if (assignedToFilter) {
    // Map selected assignee ID to its name
    const selectedAssignee = assignees.find((a) => a.id === assignedToFilter);
    const selectedAssigneeName = selectedAssignee?.assignee || assignedToFilter;

    filteredTickets = filteredTickets.filter((ticket) => {
      const assignedTo = ticket.AssignedTo || ticket.assignedTo || "";
      return assignedTo === selectedAssigneeName;
    });
    console.log(`After assignee filter: ${filteredTickets.length} tickets`);
  }

  // Store filtered tickets
  localStorage.setItem("filter_tickets", JSON.stringify(filteredTickets));

  // Reset pagination for the main tickets table
  currentPages["ticket-pagination"] = 1;

  // Refresh table view - use the correct pagination function
  paginateTickets(
    filteredTickets,
    "ticket-table-body",
    "ticket-pagination",
    true
  );

  // Update UI
  document.getElementById("ticket-table-card").style.display = "block";
  document.getElementById("grid-view-ticket").style.display = "none";
  document.getElementById("manage_ticket").style.display = "block";
  document.getElementById("ticketTableFilter").style.display = "block";
  document.getElementById("clearFilterButton").style.display = "block";

  // Debug logs
  console.log("AssignedTo Filter Value (ID):", assignedToFilter);
  console.log(
    "Mapped Assignee Name:",
    assignees.find((a) => a.id === assignedToFilter)?.assignee || "Not found"
  );
  console.log("Ticket Number Filter:", ticketNumberFilter);
  console.log("Original Tickets:", ticketData.length);
  console.log("Filtered Tickets:", filteredTickets.length);
  console.log("Filtered Tickets Data:", filteredTickets);
}

async function fetchAssigneesSetupFilterDropdown(
  dropdownId,
  selectedAssigneeName = ""
) {
  const $dropdown = $("#" + dropdownId);

  try {
    // Clear dropdown and add default option
    $dropdown.empty().append('<option value="">Select Assignee</option>');

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.warn("Access token missing, redirecting to login...");
      window.location.href = "login.html";
      return;
    }

    // Fetch assignees from API
    const response = await fetch("/api/user/getAssignee/", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      window.location.href = "login.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch assignees. Status: ${response.status}`);
    }

    const assignees = await response.json();

    // Populate dropdown
    assignees.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id; // Use ID as value
      option.textContent = item.assignee; // Use name as display text

      // Set selected if the name matches
      if (selectedAssigneeName && item.assignee === selectedAssigneeName) {
        option.selected = true;
      }

      $dropdown[0].appendChild(option);
    });
  } catch (error) {
    console.error("Error while fetching or populating assignees:", error);

    // Add a fallback option if API fails
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Error loading assignees";
    $dropdown[0].appendChild(option);
  }
}

async function fetchCustomersSetupFilterDropdown(
  dropdownId,
  selectedCustomerId = "",
  selectedCustomerLabel = ""
) {
  const $dropdown = $("#" + dropdownId);
  $dropdown.empty().append('<option value="">Select Customer</option>');

  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("/api/user/getCustomers/", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      data.data.forEach((item) => {
        $dropdown.append(
          $("<option>", { value: String(item.id), text: item.name })
        );
      });
    }

    // Show the original customer even if it doesn’t exist in API results
    if (
      selectedCustomerLabel &&
      !$dropdown.find(`option:contains('${selectedCustomerLabel}')`).length
    ) {
      $dropdown.prepend(
        $("<option>", {
          value: selectedCustomerId || "",
          text: selectedCustomerLabel,
        })
      );
    }

    // Select the current customer
    if (selectedCustomerId || selectedCustomerLabel) {
      $dropdown.val(selectedCustomerId || selectedCustomerLabel);
    }

    $dropdown.trigger("change"); // for select2 or UI refresh
  } catch (err) {
    console.error("Failed to populate customers:", err);
  }
}

function clearFilter() {
  document.getElementById("filterAssignedTo").value = "";
  document.getElementById("filterTicketNumber").value = "";

  // Refresh the ticket table and dropdown
  showTicket();
  const ticketData = JSON.parse(localStorage.getItem("tickets")) || [];
  const assignees = [...new Set(ticketData.map((ticket) => ticket.AssignedTo))];
  fetchAssigneesSetupFilterDropdown("filterAssignedTo", assignees, "");
  fetchCustomersSetupFilterDropdown("filterCustomer", "", "");
}

// const itemsPerPage = 5;
// let currentPages = {}; // Track current page per table

function paginateTickets(
  tickets,
  tableBodyId,
  paginationId,
  filter_data = false
) {
  if (!currentPages[paginationId]) currentPages[paginationId] = 1;
  const currentPage = currentPages[paginationId];

  const paginatedTickets = tickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  displayTickets(paginatedTickets, tableBodyId);
  updatePagination(tickets.length, tableBodyId, paginationId, filter_data);
}

function displayTickets(tickets, tableBodyId) {
  if (!Array.isArray(tickets)) {
    console.error("displayTickets received non-array data:", tickets);
    return;
  }

  const ticketsBody = document.getElementById(tableBodyId);
  if (!ticketsBody) return;
  ticketsBody.innerHTML = "";

  tickets.forEach((ticket) => {
    const row = document.createElement("tr");

    // Normalize fields from both main and recent tickets API
    const customer = ticket.Customer ?? ticket.customer ?? "";
    const ticketNumber = ticket.TicketNumber ?? ticket.ticketNumber ?? "";
    const raisedDate = ticket.RaisedDate ?? ticket.raisedDate ?? "";
    const description = ticket.Description ?? ticket.description ?? "";
    const assignedTo = ticket.AssignedTo ?? ticket.assignedTo ?? "";
    const inboundEmail =
      ticket.InboundEmail ??
      ticket.inboundEmail ??
      ticket.inboundemail ?? // recent tickets API
      ticket.inbound_email ??
      "";
    const priority = ticket.Priority ?? ticket.priority ?? "";
    const status = ticket.Status ?? ticket.status ?? "";
    const customerId =
      ticket.CustomerId ?? ticket.customerId ?? ticket.customer_id ?? "";

    const makeTd = (text, className = "") => {
      const td = document.createElement("td");
      if (className) td.className = className;
      td.textContent = text ?? "";
      return td;
    };

    // Build cells
    row.appendChild(makeTd(customer));
    row.appendChild(makeTd(ticketNumber));
    row.appendChild(makeTd(raisedDate));

    const descTd = makeTd(description, "description-cell");
    if (description) descTd.title = description;
    row.appendChild(descTd);

    row.appendChild(makeTd(assignedTo));
    row.appendChild(makeTd(priority));

    // Always show inbound email for both tables
    row.appendChild(makeTd(inboundEmail));

    row.appendChild(makeTd(status));

    // ACTION buttons
    const actionTd = document.createElement("td");
    actionTd.className = "action-buttons";

    const createButton = (text, className, clickHandler) => {
      const btn = document.createElement("button");
      btn.className = className;
      btn.textContent = text;

      // Set normalized attributes
      btn.setAttribute("customer", customer);
      btn.setAttribute("ticketNumber", ticketNumber);
      btn.setAttribute("raisedDate", raisedDate);
      btn.setAttribute("description", description);
      btn.setAttribute("assignedTo", assignedTo);
      btn.setAttribute("inboundEmail", inboundEmail);
      btn.setAttribute("priority", priority);
      btn.setAttribute("status", status);
      if (customerId) btn.setAttribute("customerId", customerId);

      btn.addEventListener("click", clickHandler);
      return btn;
    };

    // View button
    actionTd.appendChild(
      createButton("View", "btn btn-info btn-sm me-2", function () {
        viewTicket(this);
      })
    );

    // Edit button
    actionTd.appendChild(
      createButton("Edit", "btn btn-warning btn-sm", function () {
        if (typeof editTicket === "function") editTicket(this);
        else console.warn("editTicket is not defined.");
      })
    );

    row.appendChild(actionTd);
    ticketsBody.appendChild(row);
  });
}

const itemsPerPage = 5;
const maxVisiblePages = 10; // Show only 10 page buttons at a time
let currentPages = {};

function updatePagination(
  totalItems,
  tableBodyId,
  paginationId,
  filter_data = false
) {
  const pagination = document.getElementById(paginationId);
  if (!pagination) return;
  pagination.innerHTML = "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = currentPages[paginationId];

  // Don't show pagination if only one page
  if (totalPages <= 1) {
    return;
  }

  // Calculate the range of pages to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Previous button
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "« Previous";
    prevButton.className = "pagination-btn";
    prevButton.addEventListener("click", () => {
      currentPages[paginationId]--;
      const tickets = JSON.parse(localStorage.getItem(paginationId)) || [];
      paginateTickets(tickets, tableBodyId, paginationId, filter_data);
    });
    pagination.appendChild(prevButton);
  }

  // First page button (if not in current range)
  if (startPage > 1) {
    const firstButton = document.createElement("button");
    firstButton.textContent = "1";
    firstButton.className = "pagination-btn";
    firstButton.addEventListener("click", () => {
      currentPages[paginationId] = 1;
      const tickets = JSON.parse(localStorage.getItem(paginationId)) || [];
      paginateTickets(tickets, tableBodyId, paginationId, filter_data);
    });
    pagination.appendChild(firstButton);

    // Add ellipsis if there's a gap
    if (startPage > 2) {
      const ellipsis = document.createElement("span");
      ellipsis.textContent = "...";
      ellipsis.className = "pagination-ellipsis";
      pagination.appendChild(ellipsis);
    }
  }

  // Page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.className = `pagination-btn ${i === currentPage ? "active" : ""}`;
    button.addEventListener("click", () => {
      currentPages[paginationId] = i;
      const tickets = JSON.parse(localStorage.getItem(paginationId)) || [];
      paginateTickets(tickets, tableBodyId, paginationId, filter_data);
    });
    pagination.appendChild(button);
  }

  // Last page button (if not in current range)
  if (endPage < totalPages) {
    // Add ellipsis if there's a gap
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement("span");
      ellipsis.textContent = "...";
      ellipsis.className = "pagination-ellipsis";
      pagination.appendChild(ellipsis);
    }

    const lastButton = document.createElement("button");
    lastButton.textContent = totalPages;
    lastButton.className = "pagination-btn";
    lastButton.addEventListener("click", () => {
      currentPages[paginationId] = totalPages;
      const tickets = JSON.parse(localStorage.getItem(paginationId)) || [];
      paginateTickets(tickets, tableBodyId, paginationId, filter_data);
    });
    pagination.appendChild(lastButton);
  }

  // Next button
  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next »";
    nextButton.className = "pagination-btn";
    nextButton.addEventListener("click", () => {
      currentPages[paginationId]++;
      const tickets = JSON.parse(localStorage.getItem(paginationId)) || [];
      paginateTickets(tickets, tableBodyId, paginationId, filter_data);
    });
    pagination.appendChild(nextButton);
  }

  // Page info (optional - shows current page and total pages)
  const pageInfo = document.createElement("span");
  pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;
  pageInfo.className = "pagination-info";
  pagination.appendChild(pageInfo);
}

// Common function to set view mode (all fields disabled/readonly)
function setViewMode() {
  // Set text inputs and textareas to read-only
  [
    "ticket-ticketNumber",
    "ticketRaisedDate",
    "ticketDescription",
    "start-date-hours",
    "end-date-hours",
    "ticket-inboundemail",
  ].forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.readOnly = true;
      element.style.backgroundColor = "#f8f9fa"; // Light gray background for readonly
    }
  });

  // Set dropdowns and other inputs to disabled
  [
    "ticketCustomer",
    "ticketAssignTo",
    "ticketPriority",
    "ticketStatus",
    "hours-spent",
    "task-done-by",
  ].forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.disabled = true;
      element.style.backgroundColor = "#f8f9fa"; // Light gray background for disabled
    }
  });

  // Hide edit buttons, show "Edit Ticket" button
  document.getElementById("edit-buttons").style.display = "none";
  document.getElementById("editButton").style.display = "block";
}

// Common function to enable editing mode (only specific fields editable)
function enableEditingMode() {
  // Fields that should ALWAYS be readonly (even in edit mode)
  const alwaysReadonly = [
    "ticket-ticketNumber",
    "ticketRaisedDate",
    "start-date-hours",
    "end-date-hours",
    "task-done-by",
    "ticket-inboundemail",
  ];

  alwaysReadonly.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.readOnly = true;
      element.style.backgroundColor = "#f8f9fa";
    }
  });

  // Fields that should be EDITABLE in edit mode
  const editableFields = ["ticketDescription", "hours-spent"];

  editableFields.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.readOnly = false;
      element.disabled = false;
      element.style.backgroundColor = "#ffffff"; // White background for editable
    }
  });

  // Dropdowns that should be ENABLED in edit mode
  const enabledDropdowns = [
    "ticketCustomer",
    "ticketAssignTo",
    "ticketPriority",
    "ticketStatus",
  ];

  enabledDropdowns.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.disabled = false;
      element.style.backgroundColor = "#ffffff"; // White background for enabled
    }
  });

  // Update button states
  document.getElementById("edit-buttons").style.display = "block";
  document.getElementById("editButton").style.display = "none";
}

async function viewTicket(ticket) {
  // Hide all section containers
  document.getElementById("home-card").style.display = "none";
  document.getElementById("manage-recent-tickets").style.display = "none";
  document.getElementById("manage_mytickets").style.display = "none";
  document.getElementById("manage_unassignedtickets").style.display = "none";
  document.getElementById("manage_ticket").style.display = "none";
  document.getElementById("expenseForm").style.display = "none";

  // Show the grid view
  document.getElementById("grid-view-ticket").style.display = "flex";

  const currentCustomerId = ticket.getAttribute("customerId");
  const currentCustomerLabel = ticket.getAttribute("customer") || "";
  const assignedTo = ticket.getAttribute("assignedTo") || "";

  // Populate customer dropdown
  await fetchCustomersSetupFilterDropdown(
    "ticketCustomer",
    currentCustomerId,
    currentCustomerLabel
  );

  // Populate assignee dropdown
  await fetchAssigneesSetupFilterDropdown("ticketAssignTo", assignedTo);

  // Populate all form fields
  document.getElementById("ticket-ticketNumber").value =
    ticket.getAttribute("ticketNumber") || "";
  document.getElementById("ticketRaisedDate").value =
    ticket.getAttribute("raisedDate") || "";
  document.getElementById("ticketDescription").value =
    ticket.getAttribute("description") || "";
  document.getElementById("ticketAssignTo").value = assignedTo;
  document.getElementById("task-done-by").value =
    localStorage.getItem("employee_name") || "";
  document.getElementById("ticket-inboundemail").value =
    ticket.getAttribute("inboundEmail") || "";

  // Set priority and status dropdowns properly
  const currentPriority = ticket.getAttribute("priority");
  const currentStatus = ticket.getAttribute("status");

  populatePriorityDropdown(currentPriority);
  populateStatusDropdown(currentStatus);

  const currentDate = new Date();
  const formatDate = (date) => date.toISOString().split("T")[0];
  document.getElementById("start-date-hours").value = formatDate(currentDate);
  document.getElementById("end-date-hours").value = formatDate(currentDate);
  document.getElementById("hours-spent").value = ""; // Clear hours spent in view mode

  // IMPORTANT: Set VIEW mode (disable all fields)
  setViewMode();
}

function debugViewTicket(ticket) {
  console.log("=== DEBUG viewTicket ===");
  console.log("AssignedTo attribute:", ticket.getAttribute("assignedTo"));
  console.log("Customer attribute:", ticket.getAttribute("customer"));
  console.log("TicketNumber attribute:", ticket.getAttribute("ticketNumber"));

  // Check if dropdown exists
  const assignToDropdown = document.getElementById("ticketAssignTo");
  console.log("ticketAssignTo dropdown exists:", !!assignToDropdown);
  console.log(
    "ticketAssignTo options:",
    assignToDropdown ? assignToDropdown.options.length : 0
  );
}

function populateDropdownAssignee(dropdownId, selectedId) {
  const dropdown = document.getElementById(dropdownId);

  // Clear existing options
  dropdown.innerHTML = '<option value="">Select Assignee</option>';

  // Determine if AssigneeEnum is an array or object
  if (Array.isArray(AssigneeEnum)) {
    // Loop through array
    AssigneeEnum.forEach((assignee) => {
      const option = document.createElement("option");
      option.value = assignee.id;
      option.text = assignee.name;
      if (assignee.name === selectedId) {
        option.selected = true;
      }
      dropdown.appendChild(option);
    });
  } else {
    // Loop through object
    for (const key in AssigneeEnum) {
      if (AssigneeEnum.hasOwnProperty(key)) {
        const assignee = AssigneeEnum[key];
        const option = document.createElement("option");
        option.value = assignee.id;
        option.text = assignee.name;
        if (assignee.name === selectedId) {
          option.selected = true;
        }
        dropdown.appendChild(option);
      }
    }
  }
}

function populateStatusDropdown(selectedStatusId = null) {
  const statusDropdown = document.getElementById("ticketStatus");

  // Clear existing options
  statusDropdown.innerHTML = '<option value="">Select Status</option>';

  // Add options from StatusEnum
  for (const key in StatusEnum) {
    const option = document.createElement("option");
    option.value = StatusEnum[key].id;
    option.textContent = StatusEnum[key].name;

    // Set selected option based on response
    if (selectedStatusId && selectedStatusId === StatusEnum[key].name) {
      option.selected = true;
    }

    statusDropdown.appendChild(option);
  }
}

function populatePriorityDropdown(selectedStatusId = null) {
  const priorityDropdown = document.getElementById("ticketPriority");

  // Clear existing options
  priorityDropdown.innerHTML = '<option value="">Select Priority</option>';

  // Add options from StatusEnum
  for (const key in PriorityEnum) {
    const option = document.createElement("option");
    option.value = PriorityEnum[key].id;
    option.textContent = PriorityEnum[key].name;

    // Set selected option based on response
    if (selectedStatusId === PriorityEnum[key].name) {
      option.selected = true;
    }

    priorityDropdown.appendChild(option);
  }
}

function enableEdit() {
  // Hide "Edit this ticket" button and show Save/Cancel buttons
  document.getElementById("editButton").style.display = "none";
  document.getElementById("edit-buttons").style.display = "block";

  // Enable EDIT mode (only specific fields)
  enableEditingMode();
}

async function editTicket(ticket) {
  // Hide all section containers
  document.getElementById("home-card").style.display = "none";
  document.getElementById("manage-recent-tickets").style.display = "none";
  document.getElementById("manage_mytickets").style.display = "none";
  document.getElementById("manage_unassignedtickets").style.display = "none";
  document.getElementById("manage_ticket").style.display = "none";
  document.getElementById("expenseForm").style.display = "none";

  // Show the grid view
  document.getElementById("grid-view-ticket").style.display = "flex";

  const currentCustomerId = ticket.getAttribute("customerId");
  const currentCustomerLabel = ticket.getAttribute("customer") || "";
  const assignedTo = ticket.getAttribute("assignedTo") || "";

  // Populate customer dropdown
  await fetchCustomersSetupFilterDropdown(
    "ticketCustomer",
    currentCustomerId || currentCustomerLabel,
    currentCustomerLabel
  );

  // Populate assignee dropdown
  await fetchAssigneesSetupFilterDropdown("ticketAssignTo", assignedTo);

  // Populate all form fields
  document.getElementById("ticket-ticketNumber").value =
    ticket.getAttribute("ticketNumber") || "";
  document.getElementById("ticketRaisedDate").value =
    ticket.getAttribute("raisedDate") || "";
  document.getElementById("ticketDescription").value =
    ticket.getAttribute("description") || "";
  document.getElementById("task-done-by").value =
    localStorage.getItem("employee_name") || "";
  document.getElementById("ticket-inboundemail").value =
    ticket.getAttribute("inboundEmail") || "";

  const currentDate = new Date();
  const formatDate = (date) => date.toISOString().split("T")[0];
  document.getElementById("start-date-hours").value = formatDate(currentDate);
  document.getElementById("end-date-hours").value = formatDate(currentDate);
  document.getElementById("hours-spent").value = ""; // Clear or set default value

  // Set priority and status dropdowns
  populateStatusDropdown(ticket.getAttribute("status"));
  populatePriorityDropdown(ticket.getAttribute("priority"));

  // Set EDIT mode (enable specific fields)
  enableEditingMode();
}

async function saveTicketChanges() {
  document.getElementById("successTicketMessage").style.display = "none";
  document.getElementById("task-done-by").value =
    localStorage.getItem("employeeId");

  const currentDate = new Date();
  const formatDateForInput = (date) => date.toISOString().split("T")[0];
  const formatDateForAPI = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Set input fields
  document.getElementById("start-date-hours").value =
    formatDateForInput(currentDate);
  document.getElementById("end-date-hours").value =
    formatDateForInput(currentDate);

  let accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    window.location.href = "login.html";
    return;
  }

  // Get the displayed customer name and find its internal ID
  const customerSelect = document.getElementById("ticketCustomer");
  const displayedCustomerName =
    customerSelect.options[customerSelect.selectedIndex]?.text;

  console.log("Displayed customer name:", displayedCustomerName);

  // Extract just the name part if it's in "ID Name" format
  let cleanCustomerName = displayedCustomerName;
  if (displayedCustomerName && displayedCustomerName.includes(" ")) {
    // If it's "5 Accion Labs", extract "Accion Labs"
    const parts = displayedCustomerName.split(" ");
    // Check if first part is a number (ID)
    if (!isNaN(parts[0])) {
      cleanCustomerName = parts.slice(1).join(" ");
    }
  }

  console.log("Clean customer name:", cleanCustomerName);

  // Fetch customers to find the matching internal ID
  let customerId = "";
  try {
    const response = await fetch("/api/user/getCustomers/", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      // Find the customer by clean name
      const customer = data.data.find(
        (item) =>
          item.name.trim().toLowerCase() ===
          cleanCustomerName.trim().toLowerCase()
      );

      if (customer) {
        customerId = customer.id;
        console.log(
          `✅ Found customer ID: ${customerId} for name: ${cleanCustomerName}`
        );
      } else {
        console.warn(`❌ Customer not found: ${cleanCustomerName}`);
        // Fallback: try to find by displayed name
        const fallbackCustomer = data.data.find(
          (item) =>
            item.name.trim().toLowerCase() ===
            displayedCustomerName.trim().toLowerCase()
        );
        if (fallbackCustomer) {
          customerId = fallbackCustomer.id;
          console.log(`✅ Found customer ID using fallback: ${customerId}`);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error fetching customers:", error);
  }

  const body_data = {
    customer: customerId, // Send the internal ID we found
    customer_name: cleanCustomerName, // Send the clean name
    number: document.getElementById("ticket-ticketNumber").value,
    status: document.getElementById("ticketStatus").value,
    message: document.getElementById("ticketDescription").value,
    priority: document.getElementById("ticketPriority").value,
    assignedto: document.getElementById("ticketAssignTo").value,
    startdate: formatDateForAPI(currentDate),
    enddate: formatDateForAPI(currentDate),
    hours_spent: document.getElementById("hours-spent").value,
    task_doneby: document.getElementById("task-done-by").value,
  };

  console.log("💾 Saving ticket changes:", body_data);

  try {
    const response = await fetch("/api/user/updateTicket/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(body_data),
    });

    if (response.status === 401) {
      console.warn("Access token expired. Redirecting to login...");
      window.location.href = "login.html";
      return;
    }

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const apiResponse = await response.json();
    console.log("✅ Save response:", apiResponse);

    if (apiResponse.status == "success") {
      const successMessage = document.getElementById("successTicketMessage");
      successMessage.style.display = "block";

      // Refresh the appropriate section based on where we came from
      await refreshCurrentSection();

      // Optional: Auto-hide success message after 3 seconds
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 3000);
    } else {
      throw new Error(apiResponse.message || "Failed to save ticket");
    }
  } catch (error) {
    console.error("❌ There was a problem saving ticket changes:", error);
    alert("Error saving ticket: " + error.message);
  }
}

async function refreshCurrentSection() {
  console.log("🔄 Refreshing current section:", currentActiveSection);

  switch (currentActiveSection) {
    case "recenttickets":
      await fetchRecentTickets();
      console.log("✅ Recent tickets refreshed");
      break;

    case "mytickets":
      await fetchMyTickets();
      console.log("✅ My tickets refreshed");
      break;

    case "unassignedtickets":
      await fetchUnassignedTickets();
      console.log("✅ Unassigned tickets refreshed");
      break;

    case "viewalltickets":
      // For "View All Tickets", we need to re-fetch with the same filters
      await showTicket();
      console.log("✅ All tickets refreshed");
      break;

    default:
      console.log("ℹ️ No specific section to refresh");
  }
}

function backToTicket() {
  // Hide grid view
  document.getElementById("grid-view-ticket").style.display = "none";

  // Show the appropriate section based on where we came from
  switch (currentActiveSection) {
    case "recenttickets":
      loadrecenttickets();
      break;
    case "mytickets":
      loadmytickets();
      break;
    case "unassignedtickets":
      loadunassignedtickets();
      break;
    case "viewalltickets":
      // For "View All Tickets", show the filter section and ticket table
      document.getElementById("filter-section").style.display = "block";
      document.getElementById("fromDateFilter").style.display = "block";
      document.getElementById("toDateFilter").style.display = "block";
      document.getElementById("ticket-table-card").style.display = "block";
      document.getElementById("manage_ticket").style.display = "block";
      document.getElementById("ticketTableFilter").style.display = "block";

      // Hide other sections
      document.getElementById("home-card").style.display = "none";
      document.getElementById("manage-recent-tickets").style.display = "none";
      document.getElementById("manage_mytickets").style.display = "none";
      document.getElementById("manage_unassignedtickets").style.display =
        "none";
      document.getElementById("expenseForm").style.display = "none";
      break;
    default:
      // Fallback to home
      viewHome();
  }
}
function cancelEdit() {
  // Reload original details, disable editing, and hide save/cancel buttons
  alert("Edit cancelled. Original data reloaded.");
  document.getElementById("ticketTitle").readOnly = true;
  document.getElementById("description").readOnly = true;
  document.getElementById("status").readOnly = true;
  document.getElementById("edit-buttons").style.display = "none";
  document.getElementById("manage_role").style.display = "none";
  document.getElementById("editButton").style.display = "inline-block";
}

// Navigation functionality
function navigateTo(page) {
  switch (page) {
    case "recenttickets":
      loadrecenttickets();
      break;
    case "mytickets":
      loadmytickets();
      break;
    case "unassignedtickets":
      loadunassignedtickets();
      break;
    case "viewTicket":
      open_form_filter();
      break;
    default:
      console.error("Unknown navigation action:", page);
  }
}

function logout() {
  localStorage.clear();
  localStorage.removeItem("tickets");
  localStorage.removeItem("access_token"); // Remove token
  localStorage.removeItem("refresh_token"); // Optionally remove refresh token
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_name");
  localStorage.removeItem("fromDate");
  localStorage.removeItem("toDate");

  // localStorage.removeItem('AssigneeEnum');

  // window.location.href = "https://connatepeople.com/cpt_develop/";
  window.location.href = "http://127.0.0.1/login.html";
}
