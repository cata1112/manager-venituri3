// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0VZg3J4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4",
    authDomain: "store-income-tracker.firebaseapp.com",
    databaseURL: "https://store-income-tracker.firebaseio.com",
    projectId: "store-income-tracker",
    storageBucket: "store-income-tracker.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:1234567890123456789012"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// DOM Elements
const authSection = document.getElementById('authSection');
const appContent = document.getElementById('appContent');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const incomeForm = document.getElementById('incomeForm');
const editIncomeForm = document.getElementById('editIncomeForm');
const incomeTableBody = document.getElementById('incomeTableBody');
const todayIncome = document.getElementById('todayIncome');
const monthIncome = document.getElementById('monthIncome');
const lastUpdated = document.getElementById('lastUpdated');
const monthComparison = document.getElementById('monthComparison');
const weeklyChart = document.getElementById('weeklyChart');
const monthlyChart = document.getElementById('monthlyChart');
const loadingSpinner = document.getElementById('loadingSpinner');

// Chart Instances
let weeklyChartInstance;
let monthlyChartInstance;

// Current User Data
let currentUser = null;
let userIncomeData = [];

// Initialize App
function initApp() {
    // Firebase Auth State Listener
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            showAppContent();
            loadUserData();
        } else {
            showAuthSection();
        }
    });

    // Event Listeners
    setupEventListeners();
    initializeCharts();
}

// Show Authentication Section
function showAuthSection() {
    authSection.classList.remove('d-none');
    appContent.classList.add('d-none');
}

// Show App Content
function showAppContent() {
    authSection.classList.add('d-none');
    appContent.classList.remove('d-none');
    updateDashboard();
}

// Setup Event Listeners
function setupEventListeners() {
    // Login Form
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        loginUser(email, password);
    });

    // Register Form
    registerForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerPasswordConfirm').value;
        if (password === confirmPassword) {
            registerUser(email, password);
        } else {
            alert('Passwords do not match');
        }
    });

    // Reset Password Link
    document.getElementById('resetPasswordLink').addEventListener('click', e => {
        e.preventDefault();
        new bootstrap.Modal(document.getElementById('resetPasswordModal')).show();
    });

    // Reset Password Form
    resetPasswordForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        resetPassword(email);
    });

    // Income Form
    incomeForm.addEventListener('submit', e => {
        e.preventDefault();
        saveIncome();
    });

    // Edit Income Form
    editIncomeForm.addEventListener('submit', e => {
        e.preventDefault();
        updateIncome();
    });

    // Delete Income Button
    document.getElementById('deleteIncomeBtn').addEventListener('click', deleteIncome);

    // Navigation Links
    document.querySelectorAll('#navLinks .nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            showSection(link.id.replace('Link', 'Section'));
        });
    });

    // Export Buttons
    document.getElementById('exportCSV').addEventListener('click', exportCSV);
    document.getElementById('exportPDF').addEventListener('click', exportPDF);
}

// Initialize Charts
function initializeCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    weeklyChartInstance = new Chart(weeklyChart, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Weekly Income',
                data: [],
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: chartOptions
    });

    monthlyChartInstance = new Chart(monthlyChart, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Monthly Income',
                data: [],
                backgroundColor: '#198754',
                borderColor: '#198754',
                borderWidth: 1
            }]
        },
        options: chartOptions
    });
}

// Login User
function loginUser(email, password) {
    showLoading();
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            hideLoading();
        })
        .catch(error => {
            hideLoading();
            alert(error.message);
        });
}

// Register User
function registerUser(email, password) {
    showLoading();
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            hideLoading();
        })
        .catch(error => {
            hideLoading();
            alert(error.message);
        });
}

// Reset Password
function resetPassword(email) {
    showLoading();
    auth.sendPasswordResetEmail(email)
        .then(() => {
            hideLoading();
            alert('Password reset email sent');
            new bootstrap.Modal(document.getElementById('resetPasswordModal')).hide();
        })
        .catch(error => {
            hideLoading();
            alert(error.message);
        });
}

// Logout User
function logoutUser() {
    auth.signOut();
}

// Save Income
function saveIncome() {
    const income = {
        date: document.getElementById('incomeDate').value,
        amount: parseFloat(document.getElementById('incomeAmount').value),
        notes: document.getElementById('incomeNotes').value,
        timestamp: new Date().getTime()
    };

    if (isNaN(income.amount) || income.amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    showLoading();
    database.ref(`users/${currentUser.uid}/incomes`).push(income)
        .then(() => {
            hideLoading();
            incomeForm.reset();
            loadUserData();
        })
        .catch(error => {
            hideLoading();
            alert(error.message);
        });
}

// Load User Data
function loadUserData() {
    showLoading();
    database.ref(`users/${currentUser.uid}/incomes`).once('value')
        .then(snapshot => {
            userIncomeData = [];
            snapshot.forEach(childSnapshot => {
                const income = childSnapshot.val();
                income.id = childSnapshot.key;
                userIncomeData.push(income);
            });
            updateDashboard();
            updateIncomeTable();
            updateCharts();
            hideLoading();
        })
        .catch(error => {
            hideLoading();
            alert(error.message);
        });
}

// Update Dashboard
function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth() + 1;
    const thisYear = new Date().getFullYear();

    const todayTotal = userIncomeData
        .filter(income => income.date === today)
        .reduce((sum, income) => sum + income.amount, 0);

    const monthTotal = userIncomeData
        .filter(income => {
            const [year, month] = income.date.split('-');
            return month == thisMonth && year == thisYear;
        })
        .reduce((sum, income) => sum + income.amount, 0);

    const lastMonthTotal = userIncomeData
        .filter(income => {
            const [year, month] = income.date.split('-');
            const date = new Date(year, month - 1);
            const lastMonth = new Date(date.setMonth(date.getMonth() - 1)).getMonth() + 1;
            return month == lastMonth && year == thisYear;
        })
        .reduce((sum, income) => sum + income.amount, 0);

    todayIncome.textContent = todayTotal.toFixed(2);
    monthIncome.textContent = monthTotal.toFixed(2);
    lastUpdated.textContent = new Date().toLocaleString();
    monthComparison.textContent = `${((monthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)}%`;
}

// Update Income Table
function updateIncomeTable() {
    incomeTableBody.innerHTML = '';
    userIncomeData.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(income => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${income.date}</td>
            <td>${income.amount.toFixed(2)} RON</td>
            <td>${income.notes || ''}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${income.id}">Edit</button>
            </td>
        `;
        incomeTableBody.appendChild(row);
    });

    // Add edit button event listeners
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const income = userIncomeData.find(i => i.id === button.dataset.id);
            showEditModal(income);
        });
    });
}

// Show Edit Modal
function showEditModal(income) {
    document.getElementById('editIncomeId').value = income.id;
    document.getElementById('editIncomeDate').value = income.date;
    document.getElementById('editIncomeAmount').value = income.amount;
    document.getElementById('editIncomeNotes').value = income.notes;
    new bootstrap.Modal(document.getElementById('editIncomeModal')).show();
}

// Update Income
function updateIncome() {
    const incomeId = document.getElementById('editIncomeId').value;
    const updatedIncome = {
        date: document.getElementById('editIncomeDate').value,
        amount: parseFloat(document.getElementById('editIncomeAmount').value),
        notes: document.getElementById('editIncomeNotes').value
    };

    showLoading();
    database.ref(`users/${currentUser.uid}/incomes/${incomeId}`).update(updatedIncome)
        .then(() => {
            hideLoading();
            new bootstrap.Modal(document.getElementById('editIncomeModal')).hide();
            loadUserData();
        })
        .catch(error => {
            hideLoading();
            alert(error.message);
        });
}

// Delete Income
function deleteIncome() {
    const incomeId = document.getElementById('editIncomeId').value;
    if (confirm('Are you sure you want to delete this income record?')) {
        showLoading();
        database.ref(`users/${currentUser.uid}/incomes/${incomeId}`).remove()
            .then(() => {
                hideLoading();
                new bootstrap.Modal(document.getElementById('editIncomeModal')).hide();
                loadUserData();
            })
            .catch(error => {
                hideLoading();
                alert(error.message);
            });
    }
}

// Update Charts
function updateCharts() {
    // Weekly Chart
    const weeklyData = getWeeklyData();
    weeklyChartInstance.data.labels = weeklyData.labels;
    weeklyChartInstance.data.datasets[0].data = weeklyData.data;
    weeklyChartInstance.update();

    // Monthly Chart
    const monthlyData = getMonthlyData();
    monthlyChartInstance.data.labels = monthlyData.labels;
    monthlyChartInstance.data.datasets[0].data = monthlyData.data;
    monthlyChartInstance.update();
}

// Get Weekly Data
function getWeeklyData() {
    const today = new Date();
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        labels.push(dateString);

        const total = userIncomeData
            .filter(income => income.date === dateString)
            .reduce((sum, income) => sum + income.amount, 0);
        data.push(total);
    }

    return { labels, data };
}

// Get Monthly Data
function getMonthlyData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const data = new Array(12).fill(0);

    userIncomeData.forEach(income => {
        const [year, month] = income.date.split('-');
        if (year == currentYear) {
            data[parseInt(month) - 1] += income.amount;
        }
    });

    return { labels: months, data };
}

// Export CSV
function exportCSV() {
    const startDate = document.getElementById('exportStartDate').value;
    const endDate = document.getElementById('exportEndDate').value;

    let data = userIncomeData;
    if (startDate && endDate) {
        data = data.filter(income => income.date >= startDate && income.date <= endDate);
    }

    const csvContent = "data:text/csv;charset=utf-8," 
        + "Date,Amount,Notes\n" 
        + data.map(income => 
            `${income.date},${income.amount},"${income.notes || ''}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "income_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Export PDF
function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const startDate = document.getElementById('exportStartDate').value;
    const endDate = document.getElementById('exportEndDate').value;

    let data = userIncomeData;
    if (startDate && endDate) {
        data = data.filter(income => income.date >= startDate && income.date <= endDate);
    }

    const tableData = data.map(income => [
        income.date,
        `${income.amount.toFixed(2)} RON`,
        income.notes || ''
    ]);

    doc.text('Income Report', 10, 10);
    doc.autoTable({
        head: [['Date', 'Amount', 'Notes']],
        body: tableData,
        startY: 20
    });

    doc.save('income_report.pdf');
}

// Show Loading Spinner
function showLoading() {
    loadingSpinner.classList.remove('d-none');
}

// Hide Loading Spinner
function hideLoading() {
    loadingSpinner.classList.add('d-none');
}

// Show Section
function showSection(sectionId) {
    document.querySelectorAll('.main-content > div').forEach(section => {
        section.classList.add('d-none');
    });
    document.getElementById(sectionId).classList.remove('d-none');
}

// Initialize the App
initApp();