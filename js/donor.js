// Donor dashboard functions

// Declare necessary variables and functions
const getCurrentUser = () => ({ id: 1, name: "John Doe", role: "donor" })
const formatCurrency = (amount) => `$${amount.toFixed(2)}`
const formatDate = (date) => new Date(date).toLocaleDateString()
const lucide = { createIcons: () => {} }
const showToast = (message) => console.log(message)

// Load donor dashboard
function loadDonorDashboard() {
  const currentUser = getCurrentUser()
  if (!currentUser || currentUser.role !== "donor") return

  document.getElementById("userName").textContent = currentUser.name

  // Load dashboard stats
  loadDonorStats()
  loadRecentDonations()
}

// Load donor statistics
function loadDonorStats() {
  const currentUser = getCurrentUser()
  const donations = JSON.parse(localStorage.getItem("donations") || "[]")
  const userDonations = donations.filter((d) => d.donorId === currentUser.id)

  // Calculate stats
  const totalDonated = userDonations.reduce((sum, d) => sum + d.amount, 0)
  const ngosSupported = new Set(userDonations.map((d) => d.ngoId)).size
  const livesImpacted = Math.floor(totalDonated / 100) // Rough calculation

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonth = userDonations
    .filter((d) => {
      const donationDate = new Date(d.date)
      return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear
    })
    .reduce((sum, d) => sum + d.amount, 0)

  // Update UI
  document.getElementById("totalDonated").textContent = formatCurrency(totalDonated)
  document.getElementById("ngosSupported").textContent = ngosSupported
  document.getElementById("livesImpacted").textContent = livesImpacted.toLocaleString()
  document.getElementById("thisMonth").textContent = formatCurrency(thisMonth)
}

// Load recent donations
function loadRecentDonations() {
  const currentUser = getCurrentUser()
  const donations = JSON.parse(localStorage.getItem("donations") || "[]")
  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")

  const userDonations = donations
    .filter((d) => d.donorId === currentUser.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const recentContainer = document.getElementById("recentDonations")

  if (userDonations.length === 0) {
    recentContainer.innerHTML =
      '<p class="text-gray-600">No donations yet. <a href="../pages/ngo-directory.html" class="text-green-600 hover:underline">Start donating</a> to make a difference!</p>'
    return
  }

  recentContainer.innerHTML = userDonations
    .map((donation) => {
      const ngo = ngos.find((n) => n.id === donation.ngoId)
      return `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <i data-lucide="heart" class="w-6 h-6 text-green-600"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold">${ngo ? ngo.name : "Unknown NGO"}</h4>
                        <p class="text-sm text-gray-600">${donation.campaign || "General Donation"}</p>
                        <p class="text-xs text-gray-500">${formatDate(donation.date)}</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-semibold text-green-600">${formatCurrency(donation.amount)}</div>
                    <div class="text-xs text-gray-500">${donation.status}</div>
                </div>
            </div>
        `
    })
    .join("")

  lucide.createIcons()
}

// Show section in dashboard
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
    case "donations":
      loadAllDonations()
      break
    case "transparency":
      loadTransparencyReports()
      break
    case "certificates":
      loadCertificates()
      break
  }
}

// Load all donations
function loadAllDonations() {
  const currentUser = getCurrentUser()
  const donations = JSON.parse(localStorage.getItem("donations") || "[]")
  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")

  const userDonations = donations
    .filter((d) => d.donorId === currentUser.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const tableBody = document.getElementById("donationsTable")

  if (userDonations.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-600">No donations found</td></tr>'
    return
  }

  tableBody.innerHTML = userDonations
    .map((donation) => {
      const ngo = ngos.find((n) => n.id === donation.ngoId)
      return `
            <tr class="table-row">
                <td class="py-3 px-4">${formatDate(donation.date)}</td>
                <td class="py-3 px-4">${ngo ? ngo.name : "Unknown NGO"}</td>
                <td class="py-3 px-4">${donation.campaign || "General Donation"}</td>
                <td class="py-3 px-4 font-semibold">${formatCurrency(donation.amount)}</td>
                <td class="py-3 px-4">
                    <span class="badge badge-success">${donation.status}</span>
                </td>
                <td class="py-3 px-4">
                    <button onclick="downloadReceipt('${donation.id}')" class="text-green-600 hover:text-green-800 text-sm">
                        <i data-lucide="download" class="w-4 h-4 inline mr-1"></i>Download
                    </button>
                </td>
            </tr>
        `
    })
    .join("")

  lucide.createIcons()
}

// Download receipt
function downloadReceipt(donationId) {
  showToast("Receipt downloaded successfully!")
}

// Load transparency reports
function loadTransparencyReports() {
  const currentUser = getCurrentUser()
  const donations = JSON.parse(localStorage.getItem("donations") || "[]")
  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")

  const userDonations = donations.filter((d) => d.donorId === currentUser.id)
  const reportsContainer = document.getElementById("transparencyReports")

  if (userDonations.length === 0) {
    reportsContainer.innerHTML =
      '<p class="text-gray-600">No transparency reports available. Make a donation to see impact reports.</p>'
    return
  }

  // Group donations by NGO
  const donationsByNGO = userDonations.reduce((acc, donation) => {
    if (!acc[donation.ngoId]) {
      acc[donation.ngoId] = []
    }
    acc[donation.ngoId].push(donation)
    return acc
  }, {})

  reportsContainer.innerHTML = Object.keys(donationsByNGO)
    .map((ngoId) => {
      const ngo = ngos.find((n) => n.id == ngoId)
      const ngoDonations = donationsByNGO[ngoId]
      const totalAmount = ngoDonations.reduce((sum, d) => sum + d.amount, 0)

      return `
            <div class="dashboard-card">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">${ngo ? ngo.name : "Unknown NGO"}</h3>
                    <span class="text-green-600 font-semibold">${formatCurrency(totalAmount)}</span>
                </div>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Program Implementation</span>
                        <span class="font-medium">85%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Administrative Costs</span>
                        <span class="font-medium">10%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Fundraising</span>
                        <span class="font-medium">5%</span>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-green-50 rounded-lg">
                    <p class="text-sm text-green-800">
                        <i data-lucide="check-circle" class="w-4 h-4 inline mr-1"></i>
                        Your donations have helped impact ${Math.floor(totalAmount / 100)} lives directly.
                    </p>
                </div>
            </div>
        `
    })
    .join("")

  lucide.createIcons()
}

// Load certificates
function loadCertificates() {
  const currentUser = getCurrentUser()
  const donations = JSON.parse(localStorage.getItem("donations") || "[]")
  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")

  const userDonations = donations.filter((d) => d.donorId === currentUser.id)
  const certificatesContainer = document.getElementById("certificatesList")

  if (userDonations.length === 0) {
    certificatesContainer.innerHTML =
      '<p class="text-gray-600 col-span-full text-center">No certificates available. Make a donation to receive tax certificates.</p>'
    return
  }

  // Group by year for tax certificates
  const donationsByYear = userDonations.reduce((acc, donation) => {
    const year = new Date(donation.date).getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(donation)
    return acc
  }, {})

  certificatesContainer.innerHTML = Object.keys(donationsByYear)
    .map((year) => {
      const yearDonations = donationsByYear[year]
      const totalAmount = yearDonations.reduce((sum, d) => sum + d.amount, 0)

      return `
            <div class="dashboard-card">
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="award" class="w-8 h-8 text-green-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Tax Certificate ${year}</h3>
                    <p class="text-gray-600 mb-4">Total donations: ${formatCurrency(totalAmount)}</p>
                    <button onclick="downloadCertificate('${year}')" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm">
                        <i data-lucide="download" class="w-4 h-4 inline mr-2"></i>Download
                    </button>
                </div>
            </div>
        `
    })
    .join("")

  lucide.createIcons()
}

// Download certificate
function downloadCertificate(year) {
  showToast(`Tax certificate for ${year} downloaded successfully!`)
}
