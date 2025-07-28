// Volunteer related functions

// Declare necessary variables and functions
const formatDate = (date) => new Date(date).toLocaleDateString()

const lucide = {
  createIcons: () => {
    // Placeholder for lucide icon creation logic
  },
}

const showToast = (message, type = "success") => {
  // Placeholder for toast notification logic
  console.log(`Toast: ${message} (Type: ${type})`)
}

const getCurrentUser = () => {
  // Placeholder for getting current user logic
  return JSON.parse(localStorage.getItem("currentUser") || null)
}

const showLoginModal = () => {
  // Placeholder for showing login modal logic
  console.log("Login modal shown")
}

const generateId = () => {
  // Placeholder for generating unique ID logic
  return Math.random().toString(36).substr(2, 9)
}

// Load volunteer events
function loadVolunteerEvents() {
  const eventsGrid = document.getElementById("eventsGrid")
  const loading = document.getElementById("loading")
  const noResults = document.getElementById("noResults")

  if (!eventsGrid) return

  loading.classList.remove("hidden")

  setTimeout(() => {
    const events = JSON.parse(localStorage.getItem("events") || "[]")

    loading.classList.add("hidden")

    if (events.length === 0) {
      noResults.classList.remove("hidden")
      return
    }

    displayEvents(events)
  }, 500)
}

// Display events
function displayEvents(events) {
  const eventsGrid = document.getElementById("eventsGrid")
  const noResults = document.getElementById("noResults")

  if (events.length === 0) {
    eventsGrid.innerHTML = ""
    noResults.classList.remove("hidden")
    return
  }

  noResults.classList.add("hidden")

  eventsGrid.innerHTML = events
    .map(
      (event) => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden card-hover fade-in">
            <img src="${event.image}" alt="${event.title}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-green-600 font-medium">${event.ngoName}</span>
                    <span class="badge badge-info">${event.category}</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">${event.title}</h3>
                <p class="text-gray-600 mb-4 line-clamp-2">${event.description}</p>
                
                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-sm text-gray-600">
                        <i data-lucide="calendar" class="w-4 h-4 mr-2"></i>
                        ${formatDate(event.date)} at ${event.time}
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i data-lucide="map-pin" class="w-4 h-4 mr-2"></i>
                        ${event.location}
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i data-lucide="users" class="w-4 h-4 mr-2"></i>
                        ${event.registered}/${event.volunteers} volunteers registered
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: ${(event.registered / event.volunteers) * 100}%"></div>
                    </div>
                </div>
                
                <div class="flex space-x-2">
                    <button onclick="viewEventDetails(${event.id})" class="flex-1 border border-green-600 text-green-600 py-2 px-4 rounded-md hover:bg-green-50 transition text-sm font-medium">
                        View Details
                    </button>
                    <button onclick="registerForEvent(${event.id})" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition text-sm font-medium" ${event.registered >= event.volunteers ? "disabled" : ""}>
                        ${event.registered >= event.volunteers ? "Full" : "Register"}
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  lucide.createIcons()
}

// Apply event filters
function applyEventFilters() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const categoryFilter = document.getElementById("categoryFilter").value
  const locationFilter = document.getElementById("locationFilter").value

  const events = JSON.parse(localStorage.getItem("events") || "[]")

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.ngoName.toLowerCase().includes(searchTerm)
    const matchesCategory = !categoryFilter || event.category === categoryFilter
    const matchesLocation = !locationFilter || event.location.toLowerCase().includes(locationFilter.toLowerCase())

    return matchesSearch && matchesCategory && matchesLocation
  })

  displayEvents(filteredEvents)
}

// View event details
function viewEventDetails(eventId) {
  localStorage.setItem("selectedEvent", eventId)
  // Could redirect to event details page
  showToast("Event details feature coming soon!")
}

// Register for event
function registerForEvent(eventId) {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    showLoginModal()
    return
  }

  const events = JSON.parse(localStorage.getItem("events") || "[]")
  const eventIndex = events.findIndex((e) => e.id === eventId)

  if (eventIndex === -1) {
    showToast("Event not found!", "error")
    return
  }

  const event = events[eventIndex]

  if (event.registered >= event.volunteers) {
    showToast("Event is already full!", "error")
    return
  }

  // Check if user already registered
  const registrations = JSON.parse(localStorage.getItem("eventRegistrations") || "[]")
  const existingRegistration = registrations.find((r) => r.eventId === eventId && r.userId === currentUser.id)

  if (existingRegistration) {
    showToast("You are already registered for this event!", "warning")
    return
  }

  // Add registration
  registrations.push({
    id: generateId(),
    eventId: eventId,
    userId: currentUser.id,
    userName: currentUser.name,
    userEmail: currentUser.email,
    registeredAt: new Date().toISOString(),
    status: "registered",
  })

  // Update event registered count
  events[eventIndex].registered += 1

  // Save to localStorage
  localStorage.setItem("events", JSON.stringify(events))
  localStorage.setItem("eventRegistrations", JSON.stringify(registrations))

  showToast("Successfully registered for the event!")

  // Refresh the display
  loadVolunteerEvents()
}

// Load volunteer dashboard
function loadVolunteerDashboard() {
  const currentUser = getCurrentUser()
  if (!currentUser || currentUser.role !== "volunteer") return

  document.getElementById("userName").textContent = currentUser.name

  loadVolunteerStats()
  loadMyEvents()
}

// Load volunteer statistics
function loadVolunteerStats() {
  const currentUser = getCurrentUser()
  const registrations = JSON.parse(localStorage.getItem("eventRegistrations") || "[]")
  const userRegistrations = registrations.filter((r) => r.userId === currentUser.id)

  const eventsJoined = userRegistrations.length
  const completedEvents = userRegistrations.filter((r) => r.status === "completed").length
  const upcomingEvents = userRegistrations.filter((r) => r.status === "registered").length
  const hoursVolunteered = completedEvents * 4 // Assume 4 hours per event

  // Update UI
  document.getElementById("eventsJoined").textContent = eventsJoined
  document.getElementById("completedEvents").textContent = completedEvents
  document.getElementById("upcomingEvents").textContent = upcomingEvents
  document.getElementById("hoursVolunteered").textContent = hoursVolunteered
}

// Load my events
function loadMyEvents() {
  const currentUser = getCurrentUser()
  const registrations = JSON.parse(localStorage.getItem("eventRegistrations") || "[]")
  const events = JSON.parse(localStorage.getItem("events") || "[]")

  const userRegistrations = registrations.filter((r) => r.userId === currentUser.id)
  const myEventsContainer = document.getElementById("myEvents")

  if (userRegistrations.length === 0) {
    myEventsContainer.innerHTML =
      '<p class="text-gray-600">No events registered yet. <a href="../pages/volunteer-events.html" class="text-green-600 hover:underline">Browse events</a> to get started!</p>'
    return
  }

  myEventsContainer.innerHTML = userRegistrations
    .map((registration) => {
      const event = events.find((e) => e.id === registration.eventId)
      if (!event) return ""

      return `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <i data-lucide="calendar" class="w-6 h-6 text-green-600"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold">${event.title}</h4>
                        <p class="text-sm text-gray-600">${event.ngoName}</p>
                        <p class="text-xs text-gray-500">${formatDate(event.date)} at ${event.time}</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="badge ${registration.status === "completed" ? "badge-success" : registration.status === "registered" ? "badge-info" : "badge-warning"}">
                        ${registration.status}
                    </div>
                    ${
                      registration.status === "completed"
                        ? `<button onclick="downloadCertificate('${registration.id}')" class="text-xs text-green-600 hover:text-green-800 mt-1 block">
                            <i data-lucide="download" class="w-3 h-3 inline mr-1"></i>Certificate
                        </button>`
                        : ""
                    }
                </div>
            </div>
        `
    })
    .join("")

  lucide.createIcons()
}

// Download certificate
function downloadCertificate(registrationId) {
  // Placeholder for download certificate logic
  showToast("Certificate download feature coming soon!")
}
