// Live features and API integrations

// Helper functions
function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(date).toLocaleDateString(undefined, options)
}

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

const lucide = {
  createIcons: () => {},
}

// News API integration for NGO-related news (free tier available)
async function fetchNGONews() {
  try {
    // Using NewsAPI (requires free API key)
    // For demo, we'll use mock data
    const mockNews = [
      {
        title: "New Government Initiative Supports NGO Digital Transformation",
        description: "The government announces new funding for NGOs to adopt digital platforms...",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "The Hindu",
      },
      {
        title: "COVID-19 Relief: NGOs Report Increased Volunteer Participation",
        description: "Non-profit organizations across India see surge in volunteer registrations...",
        url: "#",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: "Times of India",
      },
      {
        title: "Technology Helps NGOs Improve Transparency in Donations",
        description: "Blockchain and digital platforms enable better tracking of fund utilization...",
        url: "#",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        source: "Economic Times",
      },
    ]

    return mockNews
  } catch (error) {
    console.error("Error fetching news:", error)
    return []
  }
}

// Display news in dashboard
async function loadNGONews() {
  const newsContainer = document.getElementById("ngoNews")
  if (!newsContainer) return

  const news = await fetchNGONews()

  if (news.length === 0) {
    newsContainer.innerHTML = '<p class="text-gray-600">No recent news available.</p>'
    return
  }

  newsContainer.innerHTML = news
    .map(
      (article) => `
        <div class="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
            <h4 class="font-semibold text-gray-900 mb-2">${article.title}</h4>
            <p class="text-gray-600 text-sm mb-2">${article.description}</p>
            <div class="flex justify-between items-center text-xs text-gray-500">
                <span>${article.source}</span>
                <span>${formatDate(article.publishedAt)}</span>
            </div>
        </div>
    `,
    )
    .join("")
}

// Real-time donation tracking
function initializeRealTimeDonations() {
  // Simulate real-time donations
  setInterval(() => {
    const donations = JSON.parse(localStorage.getItem("donations") || "[]")
    const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")

    // Simulate a new donation
    if (Math.random() < 0.1) {
      // 10% chance every interval
      const randomNGO = ngos[Math.floor(Math.random() * ngos.length)]
      const donationAmount = Math.floor(Math.random() * 10000) + 500

      const newDonation = {
        id: generateId(),
        ngoId: randomNGO.id,
        ngoName: randomNGO.name,
        amount: donationAmount,
        donorName: "Anonymous",
        date: new Date().toISOString(),
        status: "completed",
        campaign: "General Support",
      }

      donations.push(newDonation)
      localStorage.setItem("donations", JSON.stringify(donations))

      // Update NGO total raised
      const ngoIndex = ngos.findIndex((n) => n.id === randomNGO.id)
      if (ngoIndex !== -1) {
        ngos[ngoIndex].totalRaised = (ngos[ngoIndex].totalRaised || 0) + donationAmount
        localStorage.setItem("ngos", JSON.stringify(ngos))
      }

      // Show notification
      showLiveDonationNotification(randomNGO.name, donationAmount)
    }
  }, 30000) // Check every 30 seconds
}

// Show live donation notification
function showLiveDonationNotification(ngoName, amount) {
  const notification = document.createElement("div")
  notification.className = "fixed top-20 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse"
  notification.innerHTML = `
        <div class="flex items-center">
            <i data-lucide="heart" class="w-5 h-5 mr-2"></i>
            <div>
                <p class="font-semibold">New Donation!</p>
                <p class="text-sm">${formatCurrency(amount)} donated to ${ngoName}</p>
            </div>
        </div>
    `

  document.body.appendChild(notification)
  lucide.createIcons()

  setTimeout(() => {
    notification.remove()
  }, 5000)
}

// Live volunteer activity tracking
function initializeLiveVolunteerActivity() {
  setInterval(() => {
    const events = JSON.parse(localStorage.getItem("events") || "[]")
    const registrations = JSON.parse(localStorage.getItem("eventRegistrations") || "[]")

    // Simulate new volunteer registration
    if (Math.random() < 0.05) {
      // 5% chance
      const randomEvent = events[Math.floor(Math.random() * events.length)]
      if (randomEvent && randomEvent.registered < randomEvent.volunteers) {
        randomEvent.registered += 1

        const newRegistration = {
          id: generateId(),
          eventId: randomEvent.id,
          userId: generateId(),
          userName: `Volunteer ${Math.floor(Math.random() * 1000)}`,
          userEmail: `volunteer${Math.floor(Math.random() * 1000)}@example.com`,
          registeredAt: new Date().toISOString(),
          status: "registered",
        }

        registrations.push(newRegistration)
        localStorage.setItem("events", JSON.stringify(events))
        localStorage.setItem("eventRegistrations", JSON.stringify(registrations))

        showLiveVolunteerNotification(randomEvent.title, randomEvent.ngoName)
      }
    }
  }, 45000) // Check every 45 seconds
}

// Show live volunteer notification
function showLiveVolunteerNotification(eventTitle, ngoName) {
  const notification = document.createElement("div")
  notification.className = "fixed top-32 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse"
  notification.innerHTML = `
        <div class="flex items-center">
            <i data-lucide="users" class="w-5 h-5 mr-2"></i>
            <div>
                <p class="font-semibold">New Volunteer!</p>
                <p class="text-sm">Someone joined "${eventTitle}" by ${ngoName}</p>
            </div>
        </div>
    `

  document.body.appendChild(notification)
  lucide.createIcons()

  setTimeout(() => {
    notification.remove()
  }, 5000)
}

// Initialize live features
function initializeLiveFeatures() {
  initializeRealTimeDonations()
  initializeLiveVolunteerActivity()

  // Load news periodically
  loadNGONews()
  setInterval(loadNGONews, 300000) // Refresh every 5 minutes
}

// Start live features when page loads
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initializeLiveFeatures, 2000) // Start after 2 seconds
})
