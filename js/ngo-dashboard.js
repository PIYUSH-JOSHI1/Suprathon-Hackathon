// NGO Dashboard functions

function getCurrentUser() {
  // Placeholder for getting current user
  return JSON.parse(localStorage.getItem("currentUser"))
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

function showToast(message) {
  alert(message)
}

const lucide = {
  createIcons: () => {
    // Placeholder for creating icons
    console.log("Icons created")
  },
}

function loadNGODashboard() {
  const currentUser = getCurrentUser()
  if (!currentUser || currentUser.role !== "ngo") return

  document.getElementById("userName").textContent = currentUser.name

  loadNGOStats()
  loadRecentActivity()
}

function loadNGOStats() {
  const currentUser = getCurrentUser()
  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")
  const ngo = ngos.find((n) => n.id === currentUser.ngoId)

  if (ngo) {
    document.getElementById("totalRaised").textContent = formatCurrency(ngo.totalRaised || 0)
    document.getElementById("activeCampaigns").textContent = ngo.campaigns?.length || 0
    document.getElementById("totalVolunteers").textContent = ngo.volunteers || 0

    // Count events for this NGO
    const events = JSON.parse(localStorage.getItem("events") || "[]")
    const ngoEvents = events.filter((e) => e.ngoId === ngo.id)
    document.getElementById("totalEvents").textContent = ngoEvents.length
  }
}

function loadRecentActivity() {
  const recentContainer = document.getElementById("recentActivity")

  // Sample recent activity
  const activities = [
    {
      type: "donation",
      message: "Received ₹5,000 donation for Mid-Day Meal Program",
      time: "2 hours ago",
      icon: "heart",
    },
    {
      type: "volunteer",
      message: "New volunteer registered for Community Kitchen event",
      time: "4 hours ago",
      icon: "users",
    },
    {
      type: "campaign",
      message: "Education Support campaign reached 75% of target",
      time: "1 day ago",
      icon: "target",
    },
  ]

  recentContainer.innerHTML = activities
    .map(
      (activity) => `
        <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i data-lucide="${activity.icon}" class="w-5 h-5 text-green-600"></i>
            </div>
            <div class="flex-1">
                <p class="text-sm text-gray-900">${activity.message}</p>
                <p class="text-xs text-gray-500">${activity.time}</p>
            </div>
        </div>
    `,
    )
    .join("")

  lucide.createIcons()
}

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("hidden")
  })

  // Show selected section
  document.getElementById(sectionName).classList.remove("hidden")

  // Update sidebar
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.classList.remove("active")
  })
  document.querySelector(`[data-section="${sectionName}"]`).classList.add("active")

  // Load section-specific data
  switch (sectionName) {
    case "campaigns":
      loadCampaigns()
      break
    case "events":
      loadEvents()
      break
    case "donations":
      loadDonations()
      break
    case "volunteers":
      loadVolunteers()
      break
  }
}

function loadCampaigns() {
  const currentUser = getCurrentUser()
  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")
  const ngo = ngos.find((n) => n.id === currentUser.ngoId)

  const campaignsContainer = document.getElementById("campaignsList")

  if (!ngo || !ngo.campaigns || ngo.campaigns.length === 0) {
    campaignsContainer.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i data-lucide="target" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No Campaigns Yet</h3>
                <p class="text-gray-600 mb-4">Create your first fundraising campaign</p>
                <button onclick="showCreateCampaignModal()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                    Create Campaign
                </button>
            </div>
        `
    return
  }

  campaignsContainer.innerHTML = ngo.campaigns
    .map(
      (campaign) => `
        <div class="dashboard-card">
            <h3 class="text-lg font-semibold mb-2">${campaign.title}</h3>
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
                <div class="flex space-x-2">
                    <button onclick="editCampaign(${campaign.id})" class="text-blue-600 hover:text-blue-800 text-sm">
                        <i data-lucide="edit" class="w-4 h-4 inline mr-1"></i>Edit
                    </button>
                    <button onclick="viewCampaignDetails(${campaign.id})" class="text-green-600 hover:text-green-800 text-sm">
                        <i data-lucide="eye" class="w-4 h-4 inline mr-1"></i>View
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  lucide.createIcons()
}

function showCreateCampaignModal() {
  document.getElementById("createCampaignModal").classList.remove("hidden")
}

function hideCreateCampaignModal() {
  document.getElementById("createCampaignModal").classList.add("hidden")
}

function handleCreateCampaign(event) {
  event.preventDefault()

  const title = document.getElementById("campaignTitle").value
  const description = document.getElementById("campaignDescription").value
  const target = Number.parseInt(document.getElementById("campaignTarget").value)
  const endDate = document.getElementById("campaignEndDate").value

  const currentUser = getCurrentUser()
  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")
  const ngoIndex = ngos.findIndex((n) => n.id === currentUser.ngoId)

  if (ngoIndex !== -1) {
    if (!ngos[ngoIndex].campaigns) {
      ngos[ngoIndex].campaigns = []
    }

    const newCampaign = {
      id: generateId(),
      title,
      description,
      target,
      raised: 0,
      endDate,
      status: "active",
      createdAt: new Date().toISOString(),
    }

    ngos[ngoIndex].campaigns.push(newCampaign)
    localStorage.setItem("ngos", JSON.stringify(ngos))

    hideCreateCampaignModal()
    showToast("Campaign created successfully!")
    loadCampaigns()
    loadNGOStats()
  }
}

function loadEvents() {
  const currentUser = getCurrentUser()
  const events = JSON.parse(localStorage.getItem("events") || "[]")
  const ngoEvents = events.filter((e) => e.ngoId === currentUser.ngoId)

  const eventsContainer = document.getElementById("eventsList")

  if (ngoEvents.length === 0) {
    eventsContainer.innerHTML = `
            <div class="text-center py-8">
                <i data-lucide="calendar" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
                <p class="text-gray-600 mb-4">Create your first volunteer event</p>
                <button onclick="showCreateEventModal()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                    Create Event
                </button>
            </div>
        `
    return
  }

  eventsContainer.innerHTML = ngoEvents
    .map(
      (event) => `
        <div class="dashboard-card">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-semibold">${event.title}</h3>
                    <p class="text-gray-600">${event.description}</p>
                </div>
                <span class="badge badge-info">${event.category}</span>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                    <span class="text-gray-500">Date:</span>
                    <span class="font-medium">${formatDate(event.date)}</span>
                </div>
                <div>
                    <span class="text-gray-500">Time:</span>
                    <span class="font-medium">${event.time}</span>
                </div>
                <div>
                    <span class="text-gray-500">Location:</span>
                    <span class="font-medium">${event.location}</span>
                </div>
                <div>
                    <span class="text-gray-500">Volunteers:</span>
                    <span class="font-medium">${event.registered}/${event.volunteers}</span>
                </div>
            </div>
            <div class="flex justify-between items-center">
                <div class="w-full bg-gray-200 rounded-full h-2 mr-4">
                    <div class="bg-green-500 h-2 rounded-full" style="width: ${(event.registered / event.volunteers) * 100}%"></div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editEvent(${event.id})" class="text-blue-600 hover:text-blue-800 text-sm">
                        <i data-lucide="edit" class="w-4 h-4 inline mr-1"></i>Edit
                    </button>
                    <button onclick="viewEventDetails(${event.id})" class="text-green-600 hover:text-green-800 text-sm">
                        <i data-lucide="eye" class="w-4 h-4 inline mr-1"></i>View
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  lucide.createIcons()
}

function showCreateEventModal() {
  // Implementation for create event modal
  showToast("Create event feature coming soon!")
}

function loadDonations() {
  const currentUser = getCurrentUser()
  const donations = JSON.parse(localStorage.getItem("donations") || "[]")
  const ngoDonations = donations.filter((d) => d.ngoId === currentUser.ngoId)

  const tableBody = document.getElementById("donationsTable")

  if (ngoDonations.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="5" class="text-center py-8 text-gray-600">No donations received yet</td></tr>'
    return
  }

  tableBody.innerHTML = ngoDonations
    .map(
      (donation) => `
        <tr class="table-row">
            <td class="py-3 px-4">${formatDate(donation.date)}</td>
            <td class="py-3 px-4">${donation.donorName || "Anonymous"}</td>
            <td class="py-3 px-4 font-semibold">${formatCurrency(donation.amount)}</td>
            <td class="py-3 px-4">${donation.campaign || "General Donation"}</td>
            <td class="py-3 px-4">
                <span class="badge badge-success">${donation.status}</span>
            </td>
        </tr>
    `,
    )
    .join("")
}

function loadVolunteers() {
  const currentUser = getCurrentUser()
  const registrations = JSON.parse(localStorage.getItem("eventRegistrations") || "[]")
  const events = JSON.parse(localStorage.getItem("events") || "[]")
  const ngoEvents = events.filter((e) => e.ngoId === currentUser.ngoId)
  const ngoEventIds = ngoEvents.map((e) => e.id)
  const ngoVolunteers = registrations.filter((r) => ngoEventIds.includes(r.eventId))

  const volunteersContainer = document.getElementById("volunteersList")

  if (ngoVolunteers.length === 0) {
    volunteersContainer.innerHTML = '<p class="text-gray-600">No volunteers registered yet.</p>'
    return
  }

  // Group volunteers by event
  const volunteersByEvent = ngoVolunteers.reduce((acc, volunteer) => {
    const event = events.find((e) => e.id === volunteer.eventId)
    if (event) {
      if (!acc[event.title]) {
        acc[event.title] = []
      }
      acc[event.title].push(volunteer)
    }
    return acc
  }, {})

  volunteersContainer.innerHTML = Object.keys(volunteersByEvent)
    .map(
      (eventTitle) => `
        <div class="dashboard-card">
            <h3 class="text-lg font-semibold mb-4">${eventTitle}</h3>
            <div class="space-y-2">
                ${volunteersByEvent[eventTitle]
                  .map(
                    (volunteer) => `
                    <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="font-medium">${volunteer.userName}</p>
                            <p class="text-sm text-gray-600">${volunteer.userEmail}</p>
                        </div>
                        <span class="badge ${volunteer.status === "completed" ? "badge-success" : "badge-info"}">
                            ${volunteer.status}
                        </span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `,
    )
    .join("")
}

// Helper functions
function editCampaign(campaignId) {
  showToast("Edit campaign feature coming soon!")
}

function viewCampaignDetails(campaignId) {
  showToast("Campaign details feature coming soon!")
}

function editEvent(eventId) {
  showToast("Edit event feature coming soon!")
}

function viewEventDetails(eventId) {
  showToast("Event details feature coming soon!")
}
