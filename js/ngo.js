// NGO related functions

// Declare variables before using them
const formatCurrency = (amount) => amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

const getCurrentUser = () => {
  // Placeholder for user retrieval logic
  return JSON.parse(localStorage.getItem("currentUser"))
}

const showLoginModal = () => {
  // Placeholder for login modal display logic
  alert("Please log in to donate.")
}

const lucide = {
  createIcons: () => {
    // Placeholder for icon creation logic
    console.log("Icons created")
  },
}

// Load NGOs for directory page
function loadNGOs() {
  const ngoGrid = document.getElementById("ngoGrid")
  const loading = document.getElementById("loading")
  const noResults = document.getElementById("noResults")

  if (!ngoGrid) return

  loading.classList.remove("hidden")

  setTimeout(() => {
    const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")

    loading.classList.add("hidden")

    if (ngos.length === 0) {
      noResults.classList.remove("hidden")
      return
    }

    displayNGOs(ngos)
  }, 500)
}

// Display NGOs in grid
function displayNGOs(ngos) {
  const ngoGrid = document.getElementById("ngoGrid")
  const noResults = document.getElementById("noResults")

  if (ngos.length === 0) {
    ngoGrid.innerHTML = ""
    noResults.classList.remove("hidden")
    return
  }

  noResults.classList.add("hidden")

  ngoGrid.innerHTML = ngos
    .map(
      (ngo) => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden card-hover fade-in">
            <img src="${ngo.image}" alt="${ngo.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xl font-semibold text-gray-900">${ngo.name}</h3>
                    ${ngo.verified ? '<span class="status-badge status-active">Verified</span>' : '<span class="status-badge status-pending">Pending</span>'}
                </div>
                <p class="text-gray-600 mb-4 line-clamp-2">${ngo.description}</p>
                <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span class="flex items-center">
                        <i data-lucide="map-pin" class="w-4 h-4 mr-1"></i>
                        ${ngo.location.charAt(0).toUpperCase() + ngo.location.slice(1)}
                    </span>
                    <span class="flex items-center">
                        <i data-lucide="users" class="w-4 h-4 mr-1"></i>
                        ${ngo.volunteers} volunteers
                    </span>
                </div>
                <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span class="flex items-center">
                        <i data-lucide="target" class="w-4 h-4 mr-1"></i>
                        ${ngo.activecampaigns || ngo.activeCards || 0} campaigns
                    </span>
                    <span class="flex items-center">
                        <i data-lucide="heart" class="w-4 h-4 mr-1"></i>
                        ${formatCurrency(ngo.totalRaised)} raised
                    </span>
                </div>
                <div class="mb-4">
                    <div class="text-sm text-gray-600 mb-1">Impact: ${ngo.impact}</div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="viewNGODetails(${ngo.id})" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition text-sm font-medium">
                        View Details
                    </button>
                    <button onclick="donateToNGO(${ngo.id})" class="flex-1 border border-green-600 text-green-600 py-2 px-4 rounded-md hover:bg-green-50 transition text-sm font-medium">
                        Donate Now
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  lucide.createIcons()
}

// Apply filters
function applyFilters() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const categoryFilter = document.getElementById("categoryFilter").value
  const locationFilter = document.getElementById("locationFilter").value

  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")

  const filteredNGOs = ngos.filter((ngo) => {
    const matchesSearch =
      ngo.name.toLowerCase().includes(searchTerm) || ngo.description.toLowerCase().includes(searchTerm)
    const matchesCategory = !categoryFilter || ngo.category === categoryFilter
    const matchesLocation = !locationFilter || ngo.location === locationFilter

    return matchesSearch && matchesCategory && matchesLocation
  })

  displayNGOs(filteredNGOs)
}

// View NGO details
function viewNGODetails(ngoId) {
  localStorage.setItem("selectedNGO", ngoId)
  window.location.href = "ngo-profile.html"
}

// Load NGO profile
function loadNGOProfile() {
  const ngoId = localStorage.getItem("selectedNGO")
  if (!ngoId) {
    window.location.href = "ngo-directory.html"
    return
  }

  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")
  const ngo = ngos.find((n) => n.id == ngoId)

  if (!ngo) {
    window.location.href = "ngo-directory.html"
    return
  }

  // Debug: Log the NGO data to see if image exists
  console.log("Loading NGO profile:", ngo.name, "Image URL:", ngo.image)

  // Update page content
  document.getElementById("ngoName").textContent = ngo.name
  document.getElementById("ngoDescription").textContent = ngo.description
  document.getElementById("ngoMission").textContent = ngo.mission
  document.getElementById("ngoImage").src = ngo.image
  document.getElementById("ngoLocation").textContent = ngo.location.charAt(0).toUpperCase() + ngo.location.slice(1)
  document.getElementById("ngoVolunteers").textContent = ngo.volunteers
  document.getElementById("ngoRaised").textContent = formatCurrency(ngo.totalRaised)
  document.getElementById("ngoImpact").textContent = ngo.impact

  // Load campaigns
  const campaignsContainer = document.getElementById("ngoCampaigns")
  if (ngo.campaigns && ngo.campaigns.length > 0) {
    campaignsContainer.innerHTML = ngo.campaigns
      .map(
        (campaign) => `
            <div class="bg-white rounded-lg shadow-md p-6 card-hover">
                <h4 class="text-lg font-semibold mb-2">${campaign.title}</h4>
                <p class="text-gray-600 mb-4">${campaign.description}</p>
                <div class="mb-4">
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Raised: ${formatCurrency(campaign.raised)}</span>
                        <span>Goal: ${formatCurrency(campaign.target)}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="progress-bar h-2 rounded-full" style="width: ${(campaign.raised / campaign.target) * 100}%"></div>
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                        ${Math.round((campaign.raised / campaign.target) * 100)}% of goal reached
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">Ends: ${formatDate(campaign.endDate)}</span>
                    <button onclick="donateToCampaign(${campaign.id})" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm">
                        Donate Now
                    </button>
                </div>
            </div>
        `,
      )
      .join("")
  } else {
    campaignsContainer.innerHTML = '<p class="text-gray-600">No active campaigns at the moment.</p>'
  }

  lucide.createIcons()
}

// Donate to campaign
function donateToCampaign(campaignId) {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    showLoginModal()
    return
  }

  localStorage.setItem("selectedCampaign", campaignId)
  window.location.href = "campaign-details.html"
}

// Initialize page when DOM loads
document.addEventListener("DOMContentLoaded", function() {
  // Check if we're on the NGO profile page
  if (window.location.pathname.includes("ngo-profile.html")) {
    loadNGOProfile()
  } else {
    // Load NGO directory
    loadNGOs()
  }
})
