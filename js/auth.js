// Authentication functions

// Show login modal
function showLoginModal() {
  document.getElementById("loginModal").classList.remove("hidden")
}

// Hide login modal
function hideLoginModal() {
  document.getElementById("loginModal").classList.add("hidden")
}

// Show register modal
function showRegisterModal() {
  document.getElementById("registerModal").classList.remove("hidden")
}

// Hide register modal
function hideRegisterModal() {
  document.getElementById("registerModal").classList.add("hidden")
}

// Handle login
function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value
  const role = document.getElementById("loginRole").value

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  // Find user
  const user = users.find((u) => u.email === email && u.password === password && u.role === role)

  if (user) {
    // Set current user
    localStorage.setItem("currentUser", JSON.stringify(user))

    // Hide modal
    hideLoginModal()

    // Show success message
    alert("Login successful!")

    // Redirect to dashboard or refresh page
    setTimeout(() => {
      if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        window.location.reload()
      } else {
        // Check if we're already in pages directory
        if (window.location.pathname.includes("/pages/")) {
          window.location.href = "dashboard.html"
        } else {
          window.location.href = "pages/dashboard.html"
        }
      }
    }, 1000)
  } else {
    alert("Invalid credentials. Please try again.", "error")
  }
}

// Handle registration
function handleRegister(event) {
  event.preventDefault()

  const name = document.getElementById("registerName").value
  const email = document.getElementById("registerEmail").value
  const password = document.getElementById("registerPassword").value
  const role = document.getElementById("registerRole").value

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    alert("User with this email already exists!", "error")
    return
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(), // generateId(),
    name,
    email,
    password,
    role,
    verified: role !== "ngo", // NGOs need admin approval
    registeredAt: new Date().toISOString(),
  }

  // Add to users array
  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  // Set current user if not NGO (NGOs need approval)
  if (role !== "ngo") {
    localStorage.setItem("currentUser", JSON.stringify(newUser))
  }

  // Hide modal
  hideRegisterModal()

  // Show success message
  if (role === "ngo") {
    alert("Registration successful! Please wait for admin approval.")
  } else {
    alert("Registration successful!")
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
}

// Check if user is authenticated
function requireAuth(allowedRoles = []) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  if (!currentUser) {
    window.location.href = "../index.html"
    return false
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    alert("Access denied!", "error")
    window.location.href = "../index.html"
    return false
  }

  return true
}

// Helper function to generate a unique ID
function generateId() {
  return Date.now().toString()
}

// Helper function to show a toast message
function showToast(message, type = "success") {
  alert(message) // Simple alert as a placeholder
}

// Helper function to redirect to the dashboard
function goToDashboard() {
  // Check if we're already in pages directory
  if (window.location.pathname.includes("/pages/")) {
    window.location.href = "dashboard.html"
  } else {
    window.location.href = "pages/dashboard.html"
  }
}

// Helper function to get the current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"))
}
