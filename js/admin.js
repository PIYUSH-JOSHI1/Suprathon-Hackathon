// Admin dashboard functions

// Declare necessary functions
function getCurrentUser() {
  // Placeholder for getting current user logic
  return { name: "Admin User", role: "admin" }
}

function formatCurrency(amount) {
  // Placeholder for currency formatting logic
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

function formatDate(date) {
  // Placeholder for date formatting logic
  return new Date(date).toLocaleDateString()
}

function showToast(message) {
  // Placeholder for showing toast logic
  alert(message)
}

// Load admin dashboard
function loadAdminDashboard() {
  const currentUser = getCurrentUser()
  if (!currentUser || currentUser.role !== "admin") return

  document.getElementById("userName").textContent = currentUser.name

  loadAdminStats()
  loadPendingApprovals()
}

// Load admin statistics
function loadAdminStats() {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")
  const donations = JSON.parse(localStorage.getItem("donations") || "[]")
  const events = JSON.parse(localStorage.getItem("events") || "[]")

  const totalUsers = users.length
  const totalNGOs = ngos.length
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0)
  const totalEvents = events.length

  // Update UI
  document.getElementById("totalUsers").textContent = totalUsers
  document.getElementById("totalNGOs").textContent = totalNGOs
  document.getElementById("totalDonations").textContent = formatCurrency(totalDonations)
  document.getElementById("totalEvents").textContent = totalEvents
}

// Load pending approvals
function loadPendingApprovals() {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const pendingNGOs = users.filter((u) => u.role === "ngo" && !u.verified)

  const approvalsContainer = document.getElementById("pendingApprovals")

  if (pendingNGOs.length === 0) {
    approvalsContainer.innerHTML = '<p class="text-gray-600">No pending approvals.</p>'
    return
  }

  approvalsContainer.innerHTML = pendingNGOs
    .map(
      (ngo) => `
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
                <h4 class="font-semibold">${ngo.name}</h4>
                <p class="text-sm text-gray-600">${ngo.email}</p>
                <p class="text-xs text-gray-500">Registered: ${formatDate(ngo.registeredAt)}</p>
            </div>
            <div class="flex space-x-2">
                <button onclick="approveNGO(${ngo.id})" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    Approve
                </button>
                <button onclick="rejectNGO(${ngo.id})" class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                    Reject
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Approve NGO
function approveNGO(ngoId) {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const userIndex = users.findIndex((u) => u.id === ngoId)

  if (userIndex !== -1) {
    users[userIndex].verified = true
    localStorage.setItem("users", JSON.stringify(users))

    showToast("NGO approved successfully!")
    loadPendingApprovals()
  }
}

// Reject NGO
function rejectNGO(ngoId) {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const filteredUsers = users.filter((u) => u.id !== ngoId)

  localStorage.setItem("users", JSON.stringify(filteredUsers))

  showToast("NGO registration rejected.")
  loadPendingApprovals()
}
