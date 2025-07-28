// Location-based features for finding nearby NGOs and events

let userLocation = null

// Request user location and find nearby events
async function requestLocationAndFindNearbyEvents() {
  const locationStatus = document.getElementById("locationStatus")
  const locationError = document.getElementById("locationError")
  const nearbyEventsList = document.getElementById("nearbyEventsList")

  // Hide error, show loading
  locationError.classList.add("hidden")
  locationStatus.classList.remove("hidden")
  document.getElementById("currentLocation").textContent = "Getting your location..."

  if (!navigator.geolocation) {
    showLocationError("Geolocation is not supported by this browser.")
    return
  }

  try {
    const position = await getCurrentPosition()
    userLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }

    // Get location name using reverse geocoding
    const locationName = await getLocationName(userLocation.latitude, userLocation.longitude)
    document.getElementById("currentLocation").textContent = locationName

    // Find nearby events
    await findNearbyEvents()

    // Also find nearby NGOs
    await findNearbyNGOs()
  } catch (error) {
    console.error("Error getting location:", error)
    showLocationError("Unable to get your location. Please check your browser settings.")
  }
}

// Get current position as Promise
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    })
  })
}

// Get location name using reverse geocoding (free API)
async function getLocationName(lat, lon) {
  try {
    // Using OpenStreetMap Nominatim API (free)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
    )
    const data = await response.json()

    if (data && data.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.suburb
      const state = data.address.state
      return city && state ? `${city}, ${state}` : data.display_name.split(",").slice(0, 2).join(", ")
    }

    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  } catch (error) {
    console.error("Error getting location name:", error)
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  }
}

// Find nearby events based on user location
async function findNearbyEvents() {
  const events = JSON.parse(localStorage.getItem("events") || "[]")
  const nearbyEventsList = document.getElementById("nearbyEventsList")

  // Add coordinates to events if not present (simulate real data)
  const eventsWithCoords = await Promise.all(
    events.map(async (event) => {
      if (!event.coordinates) {
        // Get coordinates for event location
        const coords = await getCoordinatesForLocation(event.location)
        return { ...event, coordinates: coords }
      }
      return event
    }),
  )

  // Calculate distances and sort by proximity
  const eventsWithDistance = eventsWithCoords
    .map((event) => {
      if (event.coordinates && userLocation) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          event.coordinates.lat,
          event.coordinates.lon,
        )
        return { ...event, distance }
      }
      return { ...event, distance: Number.POSITIVE_INFINITY }
    })
    .sort((a, b) => a.distance - b.distance)

  // Show nearby events (within 50km)
  const nearbyEvents = eventsWithDistance.filter((event) => event.distance <= 50)

  if (nearbyEvents.length === 0) {
    nearbyEventsList.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i data-lucide="map-pin-off" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No Nearby Events</h3>
                <p class="text-gray-600">No volunteer events found within 50km of your location</p>
            </div>
        `
    return
  }

  nearbyEventsList.innerHTML = nearbyEvents
    .map(
      (event) => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden card-hover">
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
                        ${event.location} (${event.distance.toFixed(1)}km away)
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

  window.lucide.createIcons()
}

// Find nearby NGOs based on user location
async function findNearbyNGOs() {
  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")

  // Add coordinates to NGOs if not present
  const ngosWithCoords = await Promise.all(
    ngos.map(async (ngo) => {
      if (!ngo.coordinates) {
        const coords = await getCoordinatesForLocation(ngo.location)
        return { ...ngo, coordinates: coords }
      }
      return ngo
    }),
  )

  // Calculate distances and sort by proximity
  const ngosWithDistance = ngosWithCoords
    .map((ngo) => {
      if (ngo.coordinates && userLocation) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          ngo.coordinates.lat,
          ngo.coordinates.lon,
        )
        return { ...ngo, distance }
      }
      return { ...ngo, distance: Number.POSITIVE_INFINITY }
    })
    .sort((a, b) => a.distance - b.distance)

  // Update NGOs in localStorage with coordinates
  localStorage.setItem("ngos", JSON.stringify(ngosWithCoords))

  // Show nearby NGOs notification
  const nearbyNGOs = ngosWithDistance.filter((ngo) => ngo.distance <= 25).slice(0, 3)
  if (nearbyNGOs.length > 0) {
    showToast(`Found ${nearbyNGOs.length} NGOs within 25km of your location!`, "info")
  }
}

// Get coordinates for a location using geocoding
async function getCoordinatesForLocation(location) {
  try {
    // Using OpenStreetMap Nominatim API for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&countrycodes=in`,
    )
    const data = await response.json()

    if (data && data.length > 0) {
      return {
        lat: Number.parseFloat(data[0].lat),
        lon: Number.parseFloat(data[0].lon),
      }
    }

    // Fallback coordinates for major Indian cities
    const cityCoords = {
      mumbai: { lat: 19.076, lon: 72.8777 },
      delhi: { lat: 28.7041, lon: 77.1025 },
      bangalore: { lat: 12.9716, lon: 77.5946 },
      chennai: { lat: 13.0827, lon: 80.2707 },
      kolkata: { lat: 22.5726, lon: 88.3639 },
      pune: { lat: 18.5204, lon: 73.8567 },
      hyderabad: { lat: 17.385, lon: 78.4867 },
      ahmedabad: { lat: 23.0225, lon: 72.5714 },
    }

    const cityKey = location.toLowerCase().split(",")[0].trim()
    return cityCoords[cityKey] || { lat: 20.5937, lon: 78.9629 } // Center of India
  } catch (error) {
    console.error("Error geocoding location:", error)
    return { lat: 20.5937, lon: 78.9629 } // Center of India as fallback
  }
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return distance
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

// Show location error
function showLocationError(message) {
  const locationStatus = document.getElementById("locationStatus")
  const locationError = document.getElementById("locationError")

  locationStatus.classList.add("hidden")
  locationError.classList.remove("hidden")

  // Update error message if element exists
  const errorText = locationError.querySelector("p")
  if (errorText) {
    errorText.textContent = message
  }
}

// Get weather information for location (using free API)
async function getWeatherInfo(lat, lon) {
  try {
    // Using OpenWeatherMap API (requires free API key)
    // For demo purposes, we'll return mock data
    return {
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      condition: ["Sunny", "Cloudy", "Partly Cloudy"][Math.floor(Math.random() * 3)],
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    }
  } catch (error) {
    console.error("Error getting weather:", error)
    return null
  }
}

// Enhanced NGO directory with location-based filtering
function loadNGOsWithLocation() {
  const ngoGrid = document.getElementById("ngoGrid")
  const loading = document.getElementById("loading")
  const noResults = document.getElementById("noResults")

  if (!ngoGrid) return

  loading.classList.remove("hidden")

  setTimeout(async () => {
    const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")

    // If user has location, sort by distance
    if (userLocation) {
      const ngosWithDistance = await Promise.all(
        ngos.map(async (ngo) => {
          if (!ngo.coordinates) {
            const coords = await getCoordinatesForLocation(ngo.location)
            ngo.coordinates = coords
          }

          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            ngo.coordinates.lat,
            ngo.coordinates.lon,
          )

          return { ...ngo, distance }
        }),
      )

      // Sort by distance
      ngosWithDistance.sort((a, b) => a.distance - b.distance)

      // Update localStorage with coordinates
      localStorage.setItem("ngos", JSON.stringify(ngosWithDistance))

      displayNGOsWithDistance(ngosWithDistance)
    } else {
      displayNGOs(ngos)
    }

    loading.classList.add("hidden")
  }, 500)
}

// Display NGOs with distance information
function displayNGOsWithDistance(ngos) {
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
                <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span class="flex items-center">
                        <i data-lucide="map-pin" class="w-4 h-4 mr-1"></i>
                        ${ngo.location.charAt(0).toUpperCase() + ngo.location.slice(1)}
                    </span>
                    ${ngo.distance !== undefined ? `<span class="text-green-600 font-medium">${ngo.distance.toFixed(1)}km away</span>` : ""}
                </div>
                <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span class="flex items-center">
                        <i data-lucide="users" class="w-4 h-4 mr-1"></i>
                        ${ngo.volunteers} volunteers
                    </span>
                    <span class="flex items-center">
                        <i data-lucide="target" class="w-4 h-4 mr-1"></i>
                        ${ngo.activecampaigns || ngo.activeCards || 0} campaigns
                    </span>
                </div>
                <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
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

  window.lucide.createIcons()
}

// Declare variables before using them
function formatDate(date) {
  // Mock implementation for demonstration
  return new Date(date).toLocaleDateString()
}

function showToast(message, type) {
  // Mock implementation for demonstration
  console.log(`Toast: ${message} (${type})`)
}

function displayNGOs(ngos) {
  // Mock implementation for demonstration
  console.log("Displaying NGOs without location")
}

function formatCurrency(amount) {
  // Mock implementation for demonstration
  return `₹${amount}`
}

// Declare lucide variable
const lucide = {
  createIcons: () => {
    // Mock implementation for demonstration
    console.log("Creating Lucide icons")
  },
}
