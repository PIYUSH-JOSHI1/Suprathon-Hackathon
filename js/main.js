// Main application functions

// Initialize the application
function initializeApp() {
  checkAuthStatus()
  initializeSampleData()
}

// Check authentication status
function checkAuthStatus() {
  const currentUser = getCurrentUser()
  const authButtons = document.getElementById("authButtons")
  const userMenu = document.getElementById("userMenu")
  const userName = document.getElementById("userName")

  if (currentUser) {
    authButtons.classList.add("hidden")
    userMenu.classList.remove("hidden")
    userName.textContent = currentUser.name
  } else {
    authButtons.classList.remove("hidden")
    userMenu.classList.add("hidden")
  }
}

// Get current user from localStorage
function getCurrentUser() {
  const user = localStorage.getItem("currentUser")
  return user ? JSON.parse(user) : null
}

// Initialize sample data if not exists
function initializeSampleData() {
  // Force refresh NGO data to update images
  localStorage.removeItem("ngos");
  if (!localStorage.getItem("ngos")) {
    const sampleNGOs = [
      {
        id: 1,
        name: "Akshaya Patra Foundation",
        category: "education",
        location: "bangalore",
        description: "Providing mid-day meals to school children across India",
        mission: "To eliminate classroom hunger and bring children to school",
        image: "https://www.akshayapatra.org/includefiles/userfiles/images/Our-Work-1.jpg",
        verified: true,
        totalRaised: 2500000,
        activecampaigns: 3,
        volunteers: 1200,
        impact: "Serving 1.8 million children daily",
        contact: {
          email: "info@akshayapatra.org",
          phone: "+91-80-30143400",
          address: "Bangalore, Karnataka",
        },
        campaigns: [
          {
            id: 101,
            title: "Mid-Day Meal Program Expansion",
            description: "Expanding our reach to serve more children in rural areas",
            target: 500000,
            raised: 350000,
            endDate: "2025-12-31",
            status: "active",
          },
        ],
      },
      {
        id: 2,
        name: "Teach for India",
        category: "education",
        location: "mumbai",
        description: "Building a movement of leaders to eliminate educational inequity",
        mission: "To end educational inequity in India",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0PDvMGcqJIxZLMXggpDDxiNJmWHapRZSgQA&s",
        verified: true,
        totalRaised: 1800000,
        activecampaigns: 2,
        volunteers: 800,
        impact: "Impacting 45,000+ children annually",
        contact: {
          email: "info@teachforindia.org",
          phone: "+91-22-61577800",
          address: "Mumbai, Maharashtra",
        },
        campaigns: [
          {
            id: 201,
            title: "Teacher Training Program",
            description: "Training passionate individuals to become effective teachers",
            target: 300000,
            raised: 180000,
            endDate: "2025-11-30",
            status: "active",
          },
        ],
      },
      {
        id: 3,
        name: "Smile Foundation",
        category: "children",
        location: "delhi",
        description: "Working towards the welfare of underprivileged children and youth",
        mission: "To ensure education, healthcare and livelihood for the underprivileged",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQauby74jDKTD4TKSb77w474JnQyoG6HPJCxw&s",
        verified: true,
        totalRaised: 3200000,
        activecampaigns: 4,
        volunteers: 1500,
        impact: "Reaching 1 million+ children",
        contact: {
          email: "info@smilefoundationindia.org",
          phone: "+91-11-43123700",
          address: "New Delhi, Delhi",
        },
        campaigns: [
          {
            id: 301,
            title: "Mission Education",
            description: "Providing quality education to underprivileged children",
            target: 800000,
            raised: 520000,
            endDate: "2025-10-31",
            status: "active",
          },
        ],
      },
      {
        id: 4,
        name: "Goonj",
        category: "poverty",
        location: "delhi",
        description: "Turning urban waste into rural development resource",
        mission: "To make clothing a matter of dignity, not charity",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgPXqArOVhrzF4UbjGfuHu_dAelUqW26pbdQ&s",
        verified: true,
        totalRaised: 1500000,
        activeCards: 2,
        volunteers: 900,
        impact: "Reaching 500+ villages",
        contact: {
          email: "info@goonj.org",
          phone: "+91-11-26972351",
          address: "New Delhi, Delhi",
        },
        campaigns: [
          {
            id: 401,
            title: "Cloth for Work",
            description: "Providing clothing in exchange for community development work",
            target: 400000,
            raised: 280000,
            endDate: "2025-09-30",
            status: "active",
          },
        ],
      },
      {
        id: 5,
        name: "Pratham",
        category: "education",
        location: "mumbai",
        description: "Improving the quality of education for underprivileged children",
        mission: "Every child in school and learning well",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo7knbXybTrKidr_xwBT6X5pONtrIVOULWuSO5tU1n393lO9cOSs4gSb7Fpn-GGxH3Btg&usqp=CAU",
        verified: true,
        totalRaised: 2800000,
        activeCards: 3,
        volunteers: 1100,
        impact: "Reaching 60 million children",
        contact: {
          email: "info@pratham.org",
          phone: "+91-22-65162222",
          address: "Mumbai, Maharashtra",
        },
        campaigns: [
          {
            id: 501,
            title: "Read India Program",
            description: "Improving reading and arithmetic skills of children",
            target: 600000,
            raised: 420000,
            endDate: "2025-12-15",
            status: "active",
          },
        ],
      },
      {
        id: 6,
        name: "CRY - Child Rights and You",
        category: "children",
        location: "mumbai",
        description: "Ensuring happier childhoods for underprivileged children",
        mission: "To restore childhood to every child",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNWE34wslga6NKWP7R8vzH0xcuAG1EDVni9Q&s",
        verified: true,
        totalRaised: 2200000,
        activeCards: 3,
        volunteers: 950,
        impact: "Reaching 662,000+ children",
        contact: {
          email: "info@crymail.org",
          phone: "+91-22-67757777",
          address: "Mumbai, Maharashtra",
        },
        campaigns: [
          {
            id: 601,
            title: "Child Protection Program",
            description: "Protecting children from abuse and exploitation",
            target: 700000,
            raised: 450000,
            endDate: "2025-11-20",
            status: "active",
          },
        ],
      },
    ]

    localStorage.setItem("ngos", JSON.stringify(sampleNGOs))
  }

  // Initialize sample events
  if (!localStorage.getItem("events")) {
    const sampleEvents = [
      {
        id: 1,
        ngoId: 1,
        ngoName: "Akshaya Patra Foundation",
        title: "Community Kitchen Volunteer Drive",
        description: "Help us prepare and serve meals to underprivileged children",
        date: "2025-02-15",
        time: "09:00",
        location: "Bangalore, Karnataka",
        volunteers: 50,
        registered: 32,
        category: "food",
        requirements: "No prior experience required. Training will be provided.",
        image: "https://www.akshayapatra.org/includefiles/photos/thumbs/554.jpg",
      },
      {
        id: 2,
        ngoId: 2,
        ngoName: "Teach for India",
        title: "Weekend Teaching Program",
        description: "Teach basic subjects to children in government schools",
        date: "2025-02-08",
        time: "10:00",
        location: "Mumbai, Maharashtra",
        volunteers: 30,
        registered: 18,
        category: "education",
        requirements: "Basic knowledge of English and Mathematics required",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT383pjM8Rs-ZH5ivL4dewjpxCvpcfx91wwLg&s",
      },
      {
        id: 3,
        ngoId: 3,
        ngoName: "Smile Foundation",
        title: "Health Check-up Camp",
        description: "Assist in organizing health check-ups for underprivileged children",
        date: "2025-02-20",
        time: "08:00",
        location: "Delhi, Delhi",
        volunteers: 40,
        registered: 25,
        category: "healthcare",
        requirements: "Medical students preferred but not mandatory",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhgA5hpNj0m5j7ie8g6_b2dlUBYkQiPRy3tw&s",
      },
      {
        id: 4,
        ngoId: 4,
        ngoName: "Goonj",
        title: "Cloth Collection Drive",
        description: "Help collect and sort clothes for distribution to rural areas",
        date: "2025-02-12",
        time: "14:00",
        location: "Delhi, Delhi",
        volunteers: 25,
        registered: 15,
        category: "community",
        requirements: "Physical work involved. Comfortable clothing recommended.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH97Acw6_f9X2h8msKZrbnU6vAPdXuGL-W0g&s",
      },
    ]

    localStorage.setItem("events", JSON.stringify(sampleEvents))
  }

  // Initialize sample users
  if (!localStorage.getItem("users")) {
    const sampleUsers = [
      {
        id: 1,
        name: "Admin User",
        email: "admin@ngoconnect.com",
        password: "admin123",
        role: "admin",
      },
      {
        id: 2,
        name: "Akshaya Patra",
        email: "admin@akshayapatra.org",
        password: "ngo123",
        role: "ngo",
        ngoId: 1,
        verified: true,
      },
    ]

    localStorage.setItem("users", JSON.stringify(sampleUsers))
  }
}

// Load featured NGOs for home page
function loadFeaturedNGOs() {
  const featuredContainer = document.getElementById("featuredNGOs")
  if (!featuredContainer) return

  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")
  const featuredNGOs = ngos.slice(0, 3)

  featuredContainer.innerHTML = featuredNGOs
    .map(
      (ngo) => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden card-hover">
            <img src="${ngo.image}" alt="${ngo.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xl font-semibold text-gray-900">${ngo.name}</h3>
                    ${ngo.verified ? '<span class="status-badge status-active">Verified</span>' : ""}
                </div>
                <p class="text-gray-600 mb-4">${ngo.description}</p>
                <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span><i data-lucide="map-pin" class="w-4 h-4 inline mr-1"></i>${ngo.location}</span>
                    <span><i data-lucide="users" class="w-4 h-4 inline mr-1"></i>${ngo.volunteers} volunteers</span>
                </div>
                <div class="flex space-x-2">
                    <button onclick="viewNGO(${ngo.id})" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition text-sm">View Details</button>
                    <button onclick="donateToNGO(${ngo.id})" class="flex-1 border border-green-600 text-green-600 py-2 px-4 rounded-md hover:bg-green-50 transition text-sm">Donate</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  // Assuming lucide is imported or declared elsewhere
  // lucide.createIcons();
}

// View NGO details
function viewNGO(ngoId) {
  localStorage.setItem("selectedNGO", ngoId)
  window.location.href = "pages/ngo-profile.html"
}

// Donate to NGO
function donateToNGO(ngoId) {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    // Assuming showLoginModal is a function that needs to be declared or imported
    // showLoginModal();
    return
  }

  localStorage.setItem("selectedNGO", ngoId)
  window.location.href = "pages/campaign-details.html"
}

// Toggle user dropdown
function toggleUserDropdown() {
  const dropdown = document.getElementById("userDropdown")
  dropdown.classList.toggle("hidden")
}

// Go to appropriate dashboard based on user role
function goToDashboard() {
  const currentUser = getCurrentUser()
  if (!currentUser) return

  const dashboards = {
    donor: "pages/donor-dashboard.html",
    volunteer: "pages/volunteer-dashboard.html",
    ngo: "pages/ngo-dashboard.html",
    admin: "pages/admin-dashboard.html",
  }

  window.location.href = dashboards[currentUser.role]
}

// Logout function
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "../index.html"
}

// Show toast notification
function showToast(message, type = "success") {
  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.innerHTML = `
        <div class="flex items-center">
            <i data-lucide="${type === "success" ? "check-circle" : type === "error" ? "x-circle" : "info"}" class="w-5 h-5 mr-2"></i>
            <span>${message}</span>
        </div>
    `

  document.body.appendChild(toast)

  // Assuming lucide is imported or declared elsewhere
  // lucide.createIcons();

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

// Debounce function for search
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Generate unique ID
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

// Declare lucide variable (assuming it's an object with createIcons method)
const lucide = {
  createIcons: () => {
    // Implementation of createIcons
  },
}

// Declare showLoginModal function
function showLoginModal() {
  // Implementation of showLoginModal
}
