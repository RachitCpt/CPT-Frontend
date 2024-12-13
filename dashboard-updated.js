    
    // Function to handle "View" action
    let user_list_data = [];
    // let user_role = "";
    let user_access = "";
    let fromDate = "";
    let toDate = "";
	let apiUrl = "http://127.0.0.1:80/":
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
        CLOSED: { id: 5, name: "Closed" }
    };
    const PriorityEnum = {
        CRITICAL: { id: 4, name: "Critical" },
        HIGH: { id: 1, name: "High" },
        MEDIUM: { id: 2, name: "Medium" },
        LOW: { id: 3, name: "Low" }
    };
    
    let AssigneeEnum = {};

    function viewHome(){
        document.getElementById("manage-user-card").style.display = "none";
        document.getElementById("user-table-card").style.display = "none";
        document.getElementById("ticket-table-card").style.display = "none";
        // document.getElementById("grid-view-ticket").style.display = "block";
        document.getElementById("manage_ticket").style.display = "none";
        document.getElementById('grid-view').style.display = 'none';
        document.getElementById('home-card').style.display = 'inline-block';
        document.getElementById('manage_role').style.display='none';
        const active_user = localStorage.getItem('active_user');
        if (active_user == "Admin" || !active_user){
            document.getElementById('manageRoleTile').style.visibility='block';
            document.getElementById('newUserTile').style.visibility='block';
        }
        else{
            document.getElementById('manageRoleTile').style.display='none';
            document.getElementById('newUserTile').style.display='none';
        }
        let user_name = localStorage.getItem("user_name");
        

    }

    function viewUsers(){
        document.getElementById("manage-user-card").style.display = "block";
        document.getElementById("user-table-card").style.display = "block";
        document.getElementById("ticket-table-card").style.display = "none";
        // document.getElementById("grid-view-ticket").style.display = "block";
        document.getElementById("manage_ticket").style.display = "none";
        document.getElementById('grid-view').style.display = 'none';
        document.getElementById('home-card').style.display = 'none';
        document.getElementById('manage_role').style.display='none';
        
    }
    function enable_edit(){
        let user_id = document.getElementById('edit_buttons_v').getAttribute('user_id');
        editUser(user_id);
    }

    function showDetails(userId) {
    // Hide the table view
    
    // loadRolesDropdown(userId);
    document.getElementById('error-firstName').style.display = "none";
    document.getElementById('error-lastName').style.display = "none";
    document.getElementById('error-email').style.display = "none";
    document.getElementById('errorMobile').style.display='none';
    document.getElementById('user-table-card').style.display = 'none';
    document.getElementById('manage_role').style.display='none';
    // Show the grid view with user details
    document.getElementById('grid-view').style.display = 'block';
    document.getElementById('edit_buttons_v').setAttribute('user_id',userId);
    document.getElementById('edit_buttons_v').style.display = 'inline-block';
    document.getElementById('cancel_buttons_v').style.display = 'inline-block';
    document.getElementById('successMessage').style.display = 'none';
    
    const user = user_list_data.find(u => u.id === userId);
    toggleEditMode(false, user.id);
    console.log(user);
    
    if (user.roles.map(role => role.role_name) != ''){
        // document.getElementById('role').value = user.roles.map(role => role.role_name).join(", "); // replace with actual data
        selectedRoleId = user.roles.map(role => role.role_name); // replace with actual data
    }
    // Example: populate fields with dummy data
    document.getElementById('passwordField').style.display='none';
    document.getElementById('confirmPasswordField').style.display='none';

    document.getElementById('firstName').value = user.f_name; // replace with actual data
    document.getElementById('lastName').value = user.l_name; // replace with actual data
    // document.getElementById('employee_id').value = user.employee_id;
    document.getElementById('email').value = user.email; // replace with actual data
    document.getElementById('mobile').value = user.mobile_number; // replace with actual data
    document.getElementById("rolesDropdown").disabled=true;
    // document.getElementById('employee_id').disabled = true;
    loadRolesDropdown(selectedRoleId);
    
    }


    function addNewRole(){
        document.getElementById('manage_role').style.display='inline-block';
        document.getElementById("manage-user-card").style.display = "none";
        document.getElementById("grid-view").style.display = "none";
        document.getElementById("user-table-card").style.display = "none";
        document.getElementById("edit-buttons").style.display = 'block';
        document.getElementById('home-card').style.display = 'none';
        document.getElementById("ticket-table-card").style.display = "none";
        document.getElementById("manage_ticket").style.display = "none";
        document.getElementById('successMessageRole').style.display = 'none';
        

    }
    // Function to handle "Edit" action
    function editUser(userId) {
    // Hide the table view
        toggleEditMode(true, userId);
        document.getElementById('error-firstName').style.display = "none";
        document.getElementById('error-lastName').style.display = "none";
        document.getElementById('error-email').style.display = "none";
        document.getElementById('errorMobile').style.display='none';
        document.getElementById('user-table-card').style.display = 'none';
        document.getElementById('edit_buttons_v').style.display = 'none';
        document.getElementById('cancel_buttons_v').style.display = 'none';
        // Show the edit grid view
        document.getElementById('grid-view').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('passwordField').style.display = 'block';
        document.getElementById('confirmPasswordField').style.display='block';
        document.getElementById('manage_role').style.display='none';
        // Make fields editable for editing
        document.getElementById('firstName').removeAttribute('readonly');
        document.getElementById('lastName').removeAttribute('readonly');
        document.getElementById('email').removeAttribute('readonly');
        document.getElementById('mobile').removeAttribute('readonly');
        // document.getElementById('employee_id').removeAttribute('readonly');
        // document.getElementById('employee_id').disabled = false;
        // document.getElementById('role').removeAttribute('readonly');
        document.getElementById("rolesDropdown").disabled=false;

        // Pre-fill fields for editing

        const user = user_list_data.find(u => u.id === userId);
        console.log(user);

        document.getElementById('firstName').value = user.f_name; // replace with actual data
        document.getElementById('lastName').value = user.l_name; // replace with actual data
        document.getElementById('email').value = user.email; // replace with actual data
        document.getElementById('password').value = user.password
        document.getElementById('confirmPassword').value = user.password
        document.getElementById('mobile').value = user.mobile_number; // replace with actual data
        // document.getElementById('employee_id').value = user.employee_id; 
        if (user.roles.map(role => role.role_name) != ''){
            // document.getElementById('role').value = user.roles.map(role => role.role_name).join(", "); // replace with actual data
            selectedRoleId = user.roles.map(role => role.role_name); // replace with actual data
        }
        loadRolesDropdown(selectedRoleId);
    
    }

    function toggleEditMode(isEditMode, user_id) {
        const saveChangesBtn = document.getElementById("saveChangesBtn");
        const cancelBtn = document.getElementById("cancelBtn");
        const editModeBtn = document.getElementById("editModeBtn");
        
        if (isEditMode) {
            // Show "Save Changes" and "Cancel" buttons
            saveChangesBtn.style.display = "inline-block";
            cancelBtn.style.display = "inline-block";
            saveChangesBtn.setAttribute('user_id', user_id);
            // editModeBtn.style.display = "none";
        } else {
            // Hide "Save Changes" and "Cancel" buttons, show "Edit" button
            saveChangesBtn.style.display = "none";
            cancelBtn.style.display = "none";
            // editModeBtn.style.display = "inline-block";
        }
    }

    // Function to go back to the table view
    function backToTable() {
            // Show the table view
            document.getElementById('successMessage');
            document.getElementById('user-table-card').style.display = 'block';
            document.getElementById('manage_role').style.display='none';
            document.getElementById('errorMessage').style.display='none';
            // Hide the grid view
            document.getElementById('grid-view').style.display = 'none';
            // Reset fields to read-only for viewing mode
            document.getElementById('firstName').setAttribute('readonly', true);
            document.getElementById('lastName').setAttribute('readonly', true);
            document.getElementById('email').setAttribute('readonly', true);
            document.getElementById('mobile').setAttribute('readonly', true);
            document.getElementById('rolesDropdown').disabled=false;
            loadUserTable();
    }


async function saveChanges(event) {
// Implement save functionality here
    // backToTable(); // Optionally, go back to table view after saving
    // event.preventDefault(); // Prevent default form submission
    // console.log(roles_resp);
    // user_id = document.getAttribute('user_id');
    
    const user_ele = document.getElementById("saveChangesBtn");
    const ele = document.getElementById("rolesDropdown");

    document.getElementById('errorMessage').style.display='none';
    const selectedRoles = Array.from(ele.selectedOptions).map(option => option.value);
    // const selectedOption = ele.options[ele.selectedIndex];
    // const role_name = selectedOption.getAttribute('value')
    // const user_id = selectedOption.getAttribute('user_id')

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // const employee_id = document.getElementById("employee_id").value;
    const mobile = document.getElementById("mobile").value;
    
    const confirmPassword = document.getElementById('confirmPassword').value;
    // const user = roles_resp.find(u => u.f_name === role_name);
    // console.log(user);
    if (password !== confirmPassword) {
        var error_message = document.getElementById('errorMessage');
        // error_message.textContent = "User Created Successfully";
        error_message.style.display = 'block';
        return;
    }
    const request_data = {   
        f_name: firstName,
        l_name: lastName,
        email: email,
        mobile_number: mobile,
        // employee_id: employee_id,
        password:password,
        roles: selectedRoles
    };
    let arr = [];
    // arr.push(role_name)
    // const roleAssignmentData = {
        
    //     role_id: role_name

        
    // };
    console.log(request_data);
    let accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            window.location.href = 'login.html';
            return;
        }
        const user_id = event.getAttribute("user_id");
        if (user_id === null || user_id === undefined || user_id === ""){
            console.log(user_id);
            console.log("Added New User");
            try {
            const response = await fetch(apiUrl+'api/user/create-user/', { // Replace with actual API URL
                method: 'POST', // Use PUT for updates
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(request_data)
            });

            if (response.status === 401) {
                console.warn("Access token expired. Redirecting to login...");
                window.location.href = 'login.html';
                return;
            }

            if (response.ok) {
                var successMessage = document.getElementById('successMessage');
                successMessage.textContent = "User Created Successfully";
                successMessage.style.display = 'block';
                 // Hide modal on success
                // backToTable();
                // showDetails(); // Refresh the user list
                // loadUserTable();
            } else {
                throw new Error("Failed to update role");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            alert("There was an error creating new user. Please try again.");
        }
        }
        else {   
    try {
        
        console.log("Updated Existing User");
        const response = await fetch(apiUrl+'api/user/users/'+user_id+'/role/', { // Replace with actual API URL
            method: 'PUT', // Use PUT for updates
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(request_data)
        });


        if (response.status === 401) {
            console.warn("Access token expired. Redirecting to login...");
            window.location.href = 'login.html';
            return;
        }

        if (response.ok) {
            var successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';
             // Hide modal on success
            // backToTable();
            // showDetails(); // Refresh the user list
            // loadUserTable();
        } else {
            throw new Error("Failed to update role");
        }
    } catch (error) {
        console.error("Error updating role:", error);
        alert("There was an error updating the role. Please try again.");
    }
}
}

// Function to add a new user
function addNewUser() {
    console.log("adding new user");
    document.getElementById('error-firstName').style.display = "none";
    document.getElementById('error-lastName').style.display = "none";
    document.getElementById('error-email').style.display = "none";
    document.getElementById("successMessage").style.display = "none";
    document.getElementById("manage-user-card").style.display = "block";
    document.getElementById("grid-view").style.display = "block";
    document.getElementById("user-table-card").style.display = "none";
    document.getElementById("edit-buttons").style.display = 'block';
    document.getElementById('home-card').style.display = 'none';
    document.getElementById('passwordField').style.display = 'block';
    document.getElementById('confirmPasswordField').style.display = 'block';
    document.getElementById('manage_role').style.display='none';
    

    
    document.getElementById("manage_ticket").style.display = "none";
    // document.getElementById('grid-view').style.display = 'none';
    

    const submit_buttons = document.getElementById('saveChangesBtn');
    submit_buttons.setAttribute("user_id", '');
    // Clear all form fields
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    // document.getElementById("employee_id").value = "";
    // document.getElementById("rolesDropdown").value = "";
    
    document.getElementById('firstName').removeAttribute('readonly');
    document.getElementById('lastName').removeAttribute('readonly');
    document.getElementById('email').removeAttribute('readonly');
    document.getElementById('mobile').removeAttribute('readonly');
    // document.getElementById('employee_id').removeAttribute('readonly');
    // document.getElementById('role').removeAttribute('readonly');
    document.getElementById("rolesDropdown").disabled=false;
    // document.getElementById('employee_id').disabled=false;

    // Clear roles dropdown selections
    const roleDropdown = document.getElementById("roleDropdown");
    loadRolesDropdown([]);
    // if (roleDropdown) {
    //     Array.from(roleDropdown.options).forEach(option => option.selected = false);
    // }
}

function open_form_filter(){
    
    
    // Reset invalid classes if valid
    

    localStorage.removeItem('tickets');
    localStorage.removeItem('fromDate');
    localStorage.removeItem('toDate');
    const ticketsBody = document.getElementById('ticket-table-body');
    ticketsBody.innerHTML = '';
    document.getElementById('filter-section').style.display = 'block';
    document.getElementById('fromDateFilter').style.display = 'block';
    document.getElementById('toDateFilter').style.display = 'block';
    document.getElementById("manage-user-card").style.display = "none";
    document.getElementById("user-table-card").style.display = "none";
    
    document.getElementById("ticket-table-card").style.display = "block";
    document.getElementById("grid-view-ticket").style.display = "none";
    document.getElementById("manage_ticket").style.display = "block";
    document.getElementById('home-card').style.display = 'none';
    document.getElementById('manage_role').style.display='none';
    document.getElementById('applyFilterButton').style.display = 'none';
    document.getElementById('filterCondition').style.display = 'none';
    document.getElementById('applyFilterButton').style.display = 'none';
    document.getElementById('ticketTableFilter').style.display = 'none';
    
    
    
    // document.getElementById('pagination').style.display='none';

    
    
    // fetchAssigneesAndSetupDropdown('assignedToFilter','');
    // Clear existing options
    
    // document.getElementById('date-selection-grid').style.display='inline-block';
}
async function showTicket() {
    // Hide the ticket table and show the grid view
    
    document.getElementById('filterCondition').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('fromDate').classList.remove('input-error');
    document.getElementById('toDate').classList.remove('input-error');
    
    
    // document.getElementById('pagination').style.display='inline-block';
   
    fromDate = localStorage.getItem('fromDate');
    toDate = localStorage.getItem('toDate');
    
    
    if (fromDate && fromDate.trim() !== "" && toDate && toDate.trim() !== "") {
        console.log("Both fromDate and toDate exist and have values.");
    } else {
        fromDate = document.getElementById('fromDate').value;
        toDate = document.getElementById('toDate').value;
    }
    

    localStorage.setItem('fromDate',fromDate);
    localStorage.setItem('toDate',toDate);

    // Check if dates are selected
    if (!fromDate || !toDate) {
        // Show error message
        document.getElementById('error-message').style.display = 'block';
        // Add error styling
        if (!fromDate) {
            document.getElementById('fromDate').classList.add('input-error');
        }
        if (!toDate) {
            document.getElementById('toDate').classList.add('input-error');
        }
        return; // Exit the function if dates are not selected
    }
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        window.location.href = 'login.html'; // Redirect to login if no token
    }
    console.log("user_id");
    document.getElementById('loader-overlay').style.display = 'block';
    
    try {
        // Make an API call (replace 'your-api-endpoint' with actual URL)
        const response = await fetch(apiUrl+'api/user/getCases/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,

            },

            body: JSON.stringify({
                "fromDate": document.getElementById('fromDate').value,
                "toDate": document.getElementById('toDate').value
            })
        })

        // Check if the response is ok

        if (response.status === 401) {
            console.warn("Access token expired. Redirecting to login...");
            window.location.href = 'login.html';
            return;
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the response JSON
        const tickets = await response.json();
        let user_name = localStorage.getItem('user_name');
        let user_role = JSON.parse(localStorage.getItem('user_role'));
        console.log(user_name);
        if (user_access == ''){
            user_access = user_role.map(role => role.role_name);
        }
        if (user_access.includes('Admin')){
            
        
            cachedData = tickets;
            localStorage.setItem('tickets', JSON.stringify(tickets));
            
            fetchAssigneesAndSetupDropdown('ticketAssignTo', tickets.AssignedTo)
            currentPage = 1;
            paginateTickets(tickets);
        }
        else {
            const user_tickets = tickets.filter(ticket => 
                ticket.AssignedTo.includes(user_name)
            );
            console.log(user_tickets);
            cachedData = user_tickets;
            localStorage.setItem('tickets', JSON.stringify(user_tickets));
            fetchAssigneesAndSetupDropdown('ticketAssignTo', user_tickets.AssignedTo)
            currentPage = 1;
            paginateTickets(user_tickets);
        }
        
        if (!Array.isArray(tickets)) {
            console.error("Expected an array but received:", tickets);
            throw new TypeError("Data received is not an array.");
        }
        // localStorage.setItem('tickets', JSON.stringify(user_tickets));
        // Log the response to ensure data structure is correct
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    } finally {
        // Hide loader after the API call
        console.log("final_entry");
        document.getElementById('loader-overlay').style.display = 'none';
    }

    document.getElementById("manage-user-card").style.display = "none";
    document.getElementById("user-table-card").style.display = "none";
    document.getElementById("ticket-table-card").style.display = "block";
    document.getElementById("grid-view-ticket").style.display = "none";
    document.getElementById("manage_ticket").style.display = "block";
    document.getElementById('manage_role').style.display='none';
    document.getElementById('fromDateFilter').style.display='none';
    document.getElementById('toDateFilter').style.display='none';
    // document.getElementById('filterCondition').style.display='block';
    document.getElementById('ticketTableFilter').style.display='block';
    // document.getElementById('asiggnedFilter').style.display='block';
    // document.getElementById('ticketFilter').style.display='block';
    
    // document.getElementById("filter-section").style.display = "block";
    const ticketData = JSON.parse(localStorage.getItem('tickets'));
    const assignees = [...new Set(ticketData.map(ticket => ticket.AssignedTo))];
    // console.log(assignees);
    fetchAssigneesSetupFilterDropdown('filterAssignedTo', assignees,'');
    // fetchAssigneesAndSetupDropdown('filterAssignedTo','');

}
const itemsPerPage = 5;
let currentPage = 1;

function paginateTickets(tickets, filter_data=false) {
    const paginatedTickets = tickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    displayTickets(paginatedTickets);
    updatePagination(tickets.length, filter_data);
}

function updatePagination(totalItems, filter_data) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear existing pagination

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPageButtons = 5; // Number of page buttons to display
    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    // Adjust start and end if we are at the edge
    if (endPage - startPage < maxPageButtons - 1) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    // Previous button
    console.log(filter_data);
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            currentPage--;
            if (filter_data){
                console.log("inside filter");
                paginateTickets(JSON.parse(localStorage.getItem('filter_tickets')),true);    
            }
            else{

                paginateTickets(JSON.parse(localStorage.getItem('tickets')));
            }
            
        });
        pagination.appendChild(prevButton);
    }

    // Numbered page buttons
    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === currentPage ? 'active' : '';
        button.addEventListener('click', () => {
            currentPage = i;
            if (filter_data){
                console.log("inside filter");
                paginateTickets(JSON.parse(localStorage.getItem('filter_tickets')), true);    
            }
            else{

                paginateTickets(JSON.parse(localStorage.getItem('tickets')));
            }
        });
        pagination.appendChild(button);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            currentPage++;
            if (filter_data){
                console.log("inside filter");
                paginateTickets(JSON.parse(localStorage.getItem('filter_tickets')), true);    
            }
            else{

                paginateTickets(JSON.parse(localStorage.getItem('tickets')));
            }
        });
        pagination.appendChild(nextButton);
    }
}
function displayTickets(tickets) {
    // Handle non-array input
    if (!Array.isArray(tickets)) {
        console.error("displayTickets received non-array data:", tickets);
        return;
    }
    
    
    const ticketsBody = document.getElementById('ticket-table-body');
    ticketsBody.innerHTML = ''; // Clear existing data

    tickets.forEach(ticket => {

        const row = document.createElement('tr');


        row.innerHTML = `
    <td>${ticket.Customer}</td>
    <td>${ticket.TicketNumber}</td>
    <td>${ticket.RaisedDate}</td>
    <td class="description-cell" title='${ticket.Description}'>${ticket.Description}</td>
    <td>${ticket.AssignedTo}</td>
    <td>${ticket.Priority}</td>
    <td>${ticket.Status}</td>
    <td class="action-buttons" >
        <button class="btn btn-info btn-sm me-2" customer=${JSON.stringify(ticket.Customer)} ticketNumber=${JSON.stringify(ticket.TicketNumber)}  raisedDate=${JSON.stringify(ticket.RaisedDate)} description=${JSON.stringify(ticket.Description)} assignedTo=${JSON.stringify(ticket.AssignedTo)} priority=${ticket.Priority} status=${JSON.stringify(ticket.Status)} onclick="viewTicket(this)">View</button>
        <button class="btn btn-warning btn-sm" customer=${JSON.stringify(ticket.Customer)} ticketNumber=${JSON.stringify(ticket.TicketNumber)}  raisedDate=${JSON.stringify(ticket.RaisedDate)} description=${JSON.stringify(ticket.Description)} assignedTo=${JSON.stringify(ticket.AssignedTo)} priority=${ticket.Priority} status=${JSON.stringify(ticket.Status)} onclick="editTicket(this)">Edit</button>
        
    </td>
`;
        ticketsBody.appendChild(row);
        document.getElementById('filter-section').style.display = 'none';
    });

    // document.getElementById('tickets-section').style.display = 'block';
}
function viewTicket(tickets) {
    // Hide the ticket table and show the grid view
    
    // document.getElementById("manage-user-card").style.display = "none";
    // document.getElementById("user-table-card").style.display = "none";

    document.getElementById('successTicketMessage').style.display = 'none';
    document.getElementById("ticket-table-card").style.display = "none";
    document.getElementById("grid-view-ticket").style.display = "block";
    document.getElementById("grid-view-ticket").style.display = "flex";
    document.getElementById('manage_role').style.display='none';
    // document.getElementById("manage_ticket").style.display = "block";
    
    document.getElementById('ticketCustomer').value = tickets.getAttribute('customer');
    document.getElementById('ticket-ticketNumber').value = tickets.getAttribute('ticketNumber');
    document.getElementById('ticketRaisedDate').value = tickets.getAttribute('raisedDate');
    document.getElementById('ticketDescription').value = tickets.getAttribute('description');
    document.getElementById('ticketAssignTo').value = tickets.getAttribute('assignedTo');
    document.getElementById('ticketPriority').value = tickets.getAttribute('priority');
    document.getElementById('ticketStatus').value = tickets.getAttribute('status');

    // Populate grid view with ticket details (this would usually come from an API)
    // if (ticketId === 1) {
    //     document.getElementById("ticketTitle").value = "Server Issue";
    //     document.getElementById("description").value = "Server down in the data center.";
    //     document.getElementById("status").value = "Open";
    // } else if (ticketId === 2) {
    //     document.getElementById("ticketTitle").value = "Login Issue";
    //     document.getElementById("description").value = "User unable to login.";
    //     document.getElementById("status").value = "Resolved";
    // }
    // fetchAssigneesAndSetupDropdown('ticketAssignTo', tickets.getAttribute('assignedTo'))
    populateDropdownAssignee('ticketAssignTo',tickets.getAttribute('assignedTo'));
    populateStatusDropdown(tickets.getAttribute('status'));
    populatePriorityDropdown(tickets.getAttribute('priority'));
    document.getElementById('ticketCustomer').readOnly = true;
    document.getElementById('ticket-ticketNumber').readOnly = true;
    document.getElementById('ticketRaisedDate').readOnly = true;
    document.getElementById('ticketDescription').readOnly = true;
    document.getElementById('ticketAssignTo').disabled = true;
    document.getElementById('ticketPriority').disabled = true;
    document.getElementById('ticketStatus').disabled = true;
    document.getElementById("edit-buttons").style.display = "none";
    document.getElementById("editButton").style.display = "block";
}
function enableEdit(ticketId) {
    // Enable edit mode: make fields editable and show save/cancel buttons
    console.log(ticketId);
    document.getElementById('successTicketMessage').style.display = 'none';
    document.getElementById("ticket-table-card").style.display = "none";
    document.getElementById("grid-view").style.display = "block";
    document.getElementById("grid-view-ticket").style.display = "block";
    document.getElementById("editButton").style.display = "none";
    document.getElementById("edit-buttons").style.display = "block";

    document.getElementById('ticketCustomer').readOnly = true;
    document.getElementById('ticket-ticketNumber').readOnly = true;
    document.getElementById('ticketRaisedDate').readOnly = true;
    document.getElementById('ticketDescription').readOnly = false;


    document.getElementById("edit-buttons").style.display = "block";
    document.getElementById("editButton").style.display = "none";

    let user_role = JSON.parse(localStorage.getItem('user_role'));
    if (user_access == ''){
        user_access = user_role.map(role => role.role_name);
    }
    
    if (user_access.includes('Admin')){
        document.getElementById('ticketAssignTo').disabled = false;
        document.getElementById('ticketPriority').disabled = false;
    }
    document.getElementById('ticketStatus').disabled = false;
}
function editTicket(tickets) {
    // Hide the ticket table and show the grid view
    document.getElementById('successTicketMessage').style.display = 'none';
    document.getElementById("ticket-table-card").style.display = "none";
    document.getElementById("grid-view").style.display = "block";
    document.getElementById("grid-view-ticket").style.display = "block";
    document.getElementById("editButton").style.display = "none";
    document.getElementById("edit-buttons").style.display = "block";

    document.getElementById('ticketCustomer').value = tickets.getAttribute('customer');
    document.getElementById('ticket-ticketNumber').value = tickets.getAttribute('ticketNumber');
    document.getElementById('ticketRaisedDate').value = tickets.getAttribute('raisedDate');
    document.getElementById('ticketDescription').value = tickets.getAttribute('description');
    document.getElementById('ticketAssignTo').value = tickets.getAttribute('assignedTo');
    document.getElementById('ticketPriority').value = tickets.getAttribute('priority');
    document.getElementById('ticketStatus').value = tickets.getAttribute('status');

    // Populate grid view with ticket details (sample data, typically from an API)
    document.getElementById('ticketCustomer').readOnly = true;
    document.getElementById('ticket-ticketNumber').readOnly = true;
    document.getElementById('ticketRaisedDate').readOnly = true;
    document.getElementById('ticketDescription').readOnly = false;
    let user_role = JSON.parse(localStorage.getItem('user_role'));
    
     
     if (user_access == ''){
        user_access = user_role.map(role => role.role_name);
    }
    if (user_access.includes('Admin')){
        document.getElementById('ticketAssignTo').disabled = false;
        document.getElementById('ticketPriority').disabled = false;
    }

    // document.getElementById('ticketAssignTo').disabled = false;
    // document.getElementById('ticketPriority').disabled = false;
    document.getElementById('ticketStatus').disabled = false;
    populateDropdownAssignee('ticketAssignTo',tickets.getAttribute('assignedTo'));
    populateStatusDropdown(tickets.getAttribute('status'));
    populatePriorityDropdown(tickets.getAttribute('priority'));
    
    // document.getElementById("editButton").style.display = "none";

}
async function saveTicketChanges(){
    document.getElementById('successTicketMessage').style.display= 'none';
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        window.location.href = 'login.html'; // Redirect to login if no token
    }
    const body_data = {
        "number": document.getElementById('ticket-ticketNumber').value,
        "status": document.getElementById('ticketStatus').value,
        "message": document.getElementById('ticketDescription').value,
        "priority": document.getElementById('ticketPriority').value,
        "assignedto": document.getElementById('ticketAssignTo').value
    }
    console.log(body_data);

    try {
        // Make an API call (replace 'your-api-endpoint' with actual URL)
        const response = await fetch(apiUrl+ 'api/user/updateTicket/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,

            },

            body: JSON.stringify(body_data)
        })

        // Check if the response is ok

        if (response.status === 401) {
            console.warn("Access token expired. Redirecting to login...");
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the response JSON
        console.log(response);
        const apiResponse = await response.json();
        if (apiResponse.status == "success") {
            var successMessage = document.getElementById('successTicketMessage');
            // successMessage.textContent = "User Created Successfully";
            successMessage.style.display = 'block';
            

        }
        // storeInLocalStorage("ticket_response", cachedData);
        // Log the response to ensure data structure is correct
        console.log(apiResponse);


        // Call a function to populate the table
        // backToTable();
        // populateTable(1);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
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

function backToTicket() {
    // Show ticket table and hide the grid view
    showTicket();
    document.getElementById("ticket-table-card").style.display = "block";
    document.getElementById("manage_ticket").style.display = "block";
    document.getElementById("grid-view-ticket").style.display = "none";
    document.getElementById('manage_role').style.display='none';
    // document.getElementById("grid-view").style.display = "none";
}


function cancelEdit() {
    // Reload original details, disable editing, and hide save/cancel buttons
    alert("Edit cancelled. Original data reloaded.");
    document.getElementById("ticketTitle").readOnly = true;
    document.getElementById("description").readOnly = true;
    document.getElementById("status").readOnly = true;
    document.getElementById("edit-buttons").style.display = "none";
    document.getElementById('manage_role').style.display='none';
    document.getElementById("editButton").style.display = "inline-block";
}


function logout() {
    localStorage.clear();
    localStorage.removeItem('tickets');
    localStorage.removeItem('access_token'); // Remove token
    localStorage.removeItem('refresh_token'); // Optionally remove refresh token
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('fromDate');
    localStorage.removeItem('toDate');
    

    // localStorage.removeItem('AssigneeEnum');

    window.location.href = 'login.html';
}






async function loadRolesDropdown(selectedRoleIds = []) {
    try {


        let accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            window.location.href = 'login.html';
            return;
        }
        const response = await fetch(apiUrl + 'api/user/roles/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            }
    }); // Replace with your actual API endpoint for fetching roles

    if (response.status === 401) {
        console.warn("Access token expired. Redirecting to login...");
        window.location.href = 'login.html';
        return;
    }
        const roles = await response.json();
        
        // console.log(roles_resp)
        const rolesDropdown = document.getElementById('rolesDropdown');
        rolesDropdown.innerHTML = ''; // Clear existing options

        roles.forEach(role => {
            const option = document.createElement('option');
            
            option.value = role.id;
            option.text = role.role_name;
            option.setAttribute('role_id', role.id);
            // option.setAttribute('user_id', user_id);
            if (selectedRoleIds.includes(role.role_name)) {
                // selectedRoleIds.setAttribute('role_id', role.id);
                option.selected = true;
            }
            rolesDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading roles:', error);
    }
}

async function showAdminMenu(){
    let user_role = JSON.parse(localStorage.getItem('user_role'));

    if (user_access == ''){
        user_access = user_role.map(role => role.role_name);
    }
     

    console.log(user_access);
    console.log(user_access.includes('Admin'));
    if (user_access.includes('Admin')) {
        // Hide the "Manage Roles" and "New User" menu items
        document.getElementById('manageRolesMenu').style.display = 'inline-block';
        document.getElementById('newUserMenu').style.display = 'inline-block';
    }
    else{
        document.getElementById('manageRolesMenu').style.display = 'none';
        document.getElementById('newUserMenu').style.display = 'none';
    }
}

function setActiveRole(obj){
    user_access = obj.id;
    localStorage.setItem("active_user", obj.id);
    console.log(user_access);
    // location.reload();
    showAdminMenu();
    loadUserTable();
    
    if (user_access == 'Admin'){
        window.location.reload()
    }
    else{
        localStorage.removeItem('tickets');
        localStorage.removeItem('fromDate');
        localStorage.removeItem('toDate');
    }
    // open_form_filter();

}

document.addEventListener("DOMContentLoaded", async function() {
    
    await showUserProfile();
    await showAdminMenu();
    // loadUserTable();
    document.getElementById("manage-user-card").style.display = "none";
    
    // document.getElementById("user-table-card").style.display = this.hidden;
    
    document.getElementById("loader-overlay").style.display = "none";
    const users_role = JSON.parse(localStorage.getItem('user_role'));
    user_access = users_role.map(role => role.role_name);
    console.log(user_access);
    const rolesDropdownUser = document.getElementById('rolesDropdownUser');
    rolesDropdownUser.innerHTML = '';
    user_access.forEach(role => {
        const roleOption = document.createElement('li');
        roleOption.innerHTML = `<a class="dropdown-item" href="#" id="${role}" onClick="setActiveRole(this)">${role}</a>`;
        rolesDropdownUser.appendChild(roleOption);

    });
    
});

// window.onload = function() {
//     showUserProfile();
//     document.getElementById("loader").style.display = "none";
//     loadUserTable();
//     // showUserProfile();
    
// };

async function showUserProfile() {
    let accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
        window.location.href = 'login.html'; // Redirect to login if no token
        return;
    }

    try {
        const response = await fetch(apiUrl+ 'api/user/profile/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        if (data.roles && data.roles.length > 0) {
            localStorage.setItem('user_role', JSON.stringify(data.roles));
            localStorage.setItem('user_name', data.f_name+' '+data.l_name);
        } else {
            console.warn('No roles found in user profile');
            localStorage.setItem('user_role', ''); // Set to an empty string or handle accordingly
        }

        const userShowName = document.getElementById('user_name_display');
        userShowName.textContent = `${data.f_name[0].toUpperCase()}${data.f_name.slice(1).toLowerCase()} ${data.l_name[0].toUpperCase()}${data.l_name.slice(1).toLowerCase()}`;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        window.location.href = 'login.html'; // Redirect if token is invalid
    }
}

function loadUserTable() {
    // Fetch data from your API endpoint
    const users_role = JSON.parse(localStorage.getItem('user_role'));
    const accessToken = localStorage.getItem('access_token');
    document.getElementById("manage-user-card").style.display = "block";
    
    
    document.getElementById("user-table-card").style.display = "block";
    
    
    document.getElementById("ticket-table-card").style.display = "none";
    // document.getElementById("grid-view-ticket").style.display = "block";
    document.getElementById("manage_ticket").style.display = "none";
    document.getElementById('grid-view').style.display = 'none';
    document.getElementById('home-card').style.display = 'none';
    document.getElementById('manage_role').style.display='none';
    if (!accessToken) {
        window.location.href = 'login.html'; // Redirect to login if no token
    }
    const actionsHeader = document.getElementById('actions-header');
    console.log(users_role);
    if (user_access == ''){
        user_access = users_role.map(role => role.role_name);
    }
    
    

    if (user_access.includes('Admin')){
    actionsHeader.style.display = '';
    fetch(apiUrl + "api/user/users/",{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        }
    }
    )  // Replace with your actual API endpoint
        .then(response => response.json())
        
        .then(data => {
            const userTableBody = document.getElementById("user-table-body");
            userTableBody.innerHTML = "";  // Clear any existing rows
            user_list_data = data;
            let count = 1;
            // Loop through each user and create table rows
            data.forEach(user => {
                const row = document.createElement("tr");
                if (user.roles.length > 0){
                row.innerHTML = `
                    <td>${count}</td>
                    <td>${user.f_name}</td>
                    <td>${user.l_name}</td>
                    <td>${user.email}</td>
                    <td>${user.mobile_number}</td>
                    <td>${user.roles.map(role => role.role_name).join(", ")}</td>
                    <td class="action-buttons">
                        <a href="#" class="btn btn-info btn-sm me-2" onclick="showDetails(${user.id})">View</a>
                        <a href="#" class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Edit</a>
                    </td>
                `;
                count=count+1;
                userTableBody.appendChild(row);
                }
            });
        })
        .catch(error => {
            if (response.status === 401) {
                console.warn("Access token expired. Redirecting to login...");
                window.location.href = 'login.html';
                return;
            }
            console.error("Error fetching user data:", error);
        });
    }
    else{
        actionsHeader.style.display = 'none';
        fetch(apiUrl+'api/user/profile/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            }
        })
        .then(response => response.json())
        .then(data => {
            const userTableBody = document.getElementById("user-table-body");
            userTableBody.innerHTML = "";

            const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${data.id}</td>
                    <td>${data.f_name}</td>
                    <td>${data.l_name}</td>
                    <td>${data.email}</td>
                    <td>${data.mobile_number}</td>
                    <td>${data.roles.map(role => role.role_name).join(", ")}</td>
                    
                `;
                userTableBody.appendChild(row);
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.href = 'login.html'; // Redirect if token is invalid
        });
    }
}



// creating assignee dropdown and status and priorities
function fetchAssigneesAndSetupDropdown(dropdown_id, selected_id) {

    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        window.location.href = 'login.html'; // Redirect to login if no token
    }

    fetch(apiUrl + "api/user/getAssignee/", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            }
        }) // Replace with the actual API endpoint
        .then(response => response.json())
        .then(data => {
            // Assuming `data.assignees` contains the list of assignees
            const assignees = data; // Adjust according to your API response
            // const selectedAssigneeId = selectedAssigneeId; // ID to be pre-selected

            // Create the enum and populate dropdown
            
            createAssigneeEnum(assignees, dropdown_id, selected_id);

            // populateDropdownAssigne('editAssignedTo', selectedAssigneeId);
        })
        .catch(error => console.error("Error fetching assignees:", error));
}

function createAssigneeEnum(asigneeData, dropdown_id, selected_id) {
    AssigneeEnum = asigneeData.reduce((enumObj, item) => {
        enumObj[item.assignee.toUpperCase().replace(/\s+/g, '_')] = {
            id: item.id,
            name: item.assignee
        };
        return enumObj;
    }, {});

    localStorage.setItem("AssigneeEnum", JSON.stringify(AssigneeEnum));
    
    populateDropdownAssignee(dropdown_id, selected_id);
}




function loadAssigneeEnum() {
    const storedEnum = localStorage.getItem("AssigneeEnum");
    if (storedEnum) {
        AssigneeEnum = JSON.parse(storedEnum);
    }
}



function populateDropdownAssignee(dropdownId, selectedId) {
    const dropdown = document.getElementById(dropdownId);

    // Clear existing options
    dropdown.innerHTML = '<option value="">Select Assignee</option>';

    // Loop through the AssigneeEnum to create dropdown options
    
    for (const key in AssigneeEnum) {
        if (AssigneeEnum.hasOwnProperty(key)) {
            const option = document.createElement("option");
            option.value = AssigneeEnum[key].id; // Use id as the option value
            option.text = AssigneeEnum[key].name; // Use name as the display text

            // Set the selected option if it matches selectedAssigneeId
            
            if (AssigneeEnum[key].name === selectedId) {
                
                option.selected = true;
            }
            dropdown.appendChild(option);
        }
    }
}




function cancelEditTicketChanges(){
    backToTicket();
}


async function saveRoles(ele){
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        window.location.href = 'login.html'; // Redirect to login if no token
    }
    const roleName = document.getElementById("roleName").value;
    
  
    const request_data = {   
       "role_name": roleName,
        "page_ids": []
    };
    try {
        const response = await fetch(apiUrl + 'api/user/create-role/', { // Replace with actual API URL
            method: 'POST', // Use PUT for updates
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(request_data)
        });

        if (response.status === 401) {
            console.warn("Access token expired. Redirecting to login...");
            window.location.href = 'login.html';
            return;
        }

        if (response.ok) {
            // alert("successfully create Role")
            var successMessage = document.getElementById('successMessageRole');
            // successMessage.textContent = "User Created Successfully";
            successMessage.style.display = 'block';
            document.getElementById("roleName").value="";

             // Hide modal on success
            // backToTable();
            // showDetails(); // Refresh the user list
            // loadUserTable();
        } else {
            throw new Error("Failed to update role");
        }
    } catch (error) {
        console.error("Error creating user:", error);
        alert("There was an error creating new user. Please try again.");
    }
}


function backToHome(){
    localStorage.removeItem('tickets');
    document.getElementById('errorMessage').style.display='none';
    viewHome();
    
}

function validateField(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorField = document.getElementById(`error-${fieldId}`);
    if (!field.value.trim()) {
        errorField.style.display = 'block'; // Show error message
    } else {
        errorField.style.display = 'none'; // Hide error message
    }
}


function validatePassword() {
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorField = document.getElementById('errorMessage');
    if (password == '' && confirmPassword == ''){
        
        errorField.style.display = 'block';
        errorField.style.content = 'password should not blank';
    }
    else{
        errorField.style.display = 'none';
    }
    if (password && confirmPassword && password !== confirmPassword) {
        errorField.style.display = 'block'; // Show error message
    } else {
        errorField.style.display = 'none'; // Hide error message
    }
}

function validateMobile(inputtxt) {
    document.getElementById('errorMobile').style.display='none';
    console.log(inputtxt.value);
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(inputtxt.value.match(phoneno))
          {
        return true;
          }
        else
          {
          document.getElementById('errorMobile').style.display='block';
          return false;
          }
}
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if ((charCode < 48 || charCode > 57))
        return false;

    return true;
}

function showFilter(filterType) {
    const assignedToContainer = document.getElementById("filterAssignedToContainer");
    const ticketNumberContainer = document.getElementById("filterTicketNumberContainer");
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
    document.getElementById('applyFilterButton').style.display = 'block';
}



function applyTableFilters() {
    const assignedToFilter = document.getElementById("filterAssignedTo").value;
    const ticketNumberFilter = document.getElementById("filterTicketNumber").value.toLowerCase();
    const ticketData = JSON.parse(localStorage.getItem('tickets'));
    const assignees = [...new Set(ticketData.map(ticket => ticket.AssignedTo))];
    console.log(assignees);
    fetchAssigneesSetupFilterDropdown('filterAssignedTo', assignees, assignedToFilter);
    
    if(document.getElementById("filterTicketNumberContainer").style.display === 'block'){
        const user_tickets = ticketData.filter(ticket => 
            ticket.TicketNumber.includes(ticketNumberFilter)
        );
        
        localStorage.setItem('filter_tickets', JSON.stringify(user_tickets));
    // fetchAssigneesAndSetupDropdown('ticketAssignTo', user_tickets.AssignedTo)
        currentPage = 1;
        paginateTickets(user_tickets, true);
    }
    else{
        const user_tickets = ticketData.filter(ticket => 
            ticket.AssignedTo.includes(assignedToFilter)
        );
        localStorage.setItem('filter_tickets', JSON.stringify(user_tickets));
    // fetchAssigneesAndSetupDropdown('ticketAssignTo', user_tickets.AssignedTo)
        currentPage = 1;
        paginateTickets(user_tickets, true);
    }
    
    // Set up ticket filtering logic if needed
    // document.getElementById('filterAssignedTo').addEventListener('change', () => {
    //     const selectedAssignee = document.getElementById('filterAssignedTo').value;
    //     const filteredByAssignee = selectedAssignee
    //         ? ticketData.filter(ticket => ticket.AssignedTo === selectedAssignee)
    //         : ticketData;

    //     paginateTickets(filteredByAssignee);
    // });

  
    document.getElementById("manage-user-card").style.display = "none";
    document.getElementById("user-table-card").style.display = "none";
    document.getElementById("ticket-table-card").style.display = "block";
    document.getElementById("grid-view-ticket").style.display = "none";
    document.getElementById("manage_ticket").style.display = "block";
    document.getElementById('manage_role').style.display = 'none';
    document.getElementById('ticketTableFilter').style.display = 'block';
    document.getElementById('clearFilterButton').style.display = 'block';
}


async function fetchAssigneesSetupFilterDropdown(dropdownId, assignees = [], selectedAssignee ){

    const dropdown = document.getElementById(dropdownId);

    // Clear any existing options
    dropdown.innerHTML = '<option value="">All</option>'; // Default option

    try {
        // If assignees are not provided, fetch them from the API
        if (!assignees.length) {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                window.location.href = 'login.html'; // Redirect if no token
                return;
            }

            const response = await fetch(apiUrl + 'api/user/getAssignees/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 401) {
                window.location.href = 'login.html'; // Redirect if unauthorized
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch assignees.');
            }

            // Parse the response JSON
            assignees = await response.json();
        }

        // Populate the dropdown with assignee names
        assignees.forEach(assignee => {
            const option = document.createElement('option');
            option.value = assignee;
            option.textContent = assignee;
            if (assignee === selectedAssignee) {
                option.selected = true;
            }

            dropdown.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching or populating assignees:', error);
    }
}

function clearFilter(){
    
    document.getElementById('filterAssignedTo').value = '';
    document.getElementById('filterTicketNumber').value = '';

    // Refresh the dropdown without a selected assignee
    showTicket();
    fetchAssigneesAndSetupDropdown('filterAssignedTo','');
    
}

// Navigation functionality
function navigateTo(page) {
    switch (page) {
        case 'manageUsers':
            loadUserTable();
            break;
        case 'newUser':
            addNewUser();
            break;
        case 'manageRoles':
            addNewRole();
            break;
        case 'viewTicket':
            open_form_filter();
            break;
        default:
            console.error("Unknown navigation action:", page);
    }
}
