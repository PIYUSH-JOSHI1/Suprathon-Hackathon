// Campaign details functionality

function loadCampaignDetails() {
  const campaignId = localStorage.getItem("selectedCampaign")
  const ngoId = localStorage.getItem("selectedNGO")

  if (!campaignId && !ngoId) {
    window.location.href = "ngo-directory.html"
    return
  }

  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")
  let campaign = null
  let ngo = null

  // Find the campaign and NGO
  for (const n of ngos) {
    if (n.campaigns) {
      const foundCampaign = n.campaigns.find((c) => c.id == campaignId)
      if (foundCampaign) {
        campaign = foundCampaign
        ngo = n
        break
      }
    }
    if (n.id == ngoId) {
      ngo = n
      // Use first campaign or create a general one
      campaign = n.campaigns?.[0] || {
        id: "general",
        title: "General Support",
        description: "Support our ongoing initiatives and programs",
        target: 100000,
        raised: ngo.totalRaised || 0,
        endDate: "2025-12-31",
      }
      break
    }
  }

  if (!campaign || !ngo) {
    window.location.href = "ngo-directory.html"
    return
  }

  // Update page content
  document.getElementById("campaignTitle").textContent = campaign.title
  document.getElementById("campaignNGO").textContent = ngo.name
  document.getElementById("campaignDescription").textContent = campaign.description
  document.getElementById("raisedAmount").textContent = formatCurrency(campaign.raised)
  document.getElementById("targetAmount").textContent = formatCurrency(campaign.target)
  document.getElementById("endDate").textContent = formatDate(campaign.endDate)

  // Update progress bar
  const percentage = Math.min((campaign.raised / campaign.target) * 100, 100)
  document.getElementById("progressBar").style.width = percentage + "%"
  document.getElementById("progressPercentage").textContent = Math.round(percentage) + "% funded"

  // Load recent donations and updates
  loadRecentDonations(campaign.id, ngo.id)
  loadCampaignUpdates(campaign.id)
}

function loadRecentDonations(campaignId, ngoId) {
  const donations = JSON.parse(localStorage.getItem("donations") || "[]")
  const campaignDonations = donations
    .filter((d) => d.ngoId == ngoId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)

  const container = document.getElementById("recentDonations")

  if (campaignDonations.length === 0) {
    container.innerHTML = '<p class="text-gray-600">No donations yet. Be the first to support this campaign!</p>'
    return
  }

  container.innerHTML = campaignDonations
    .map(
      (donation) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <i data-lucide="heart" class="w-4 h-4 text-green-600"></i>
                </div>
                <div>
                    <p class="font-medium">${donation.donorName || "Anonymous"}</p>
                    <p class="text-sm text-gray-600">${formatDate(donation.date)}</p>
                </div>
            </div>
            <div class="text-green-600 font-semibold">
                ${formatCurrency(donation.amount)}
            </div>
        </div>
    `,
    )
    .join("")

  lucide.createIcons()
}

function loadCampaignUpdates(campaignId) {
  // Mock campaign updates
  const updates = [
    {
      date: new Date().toISOString(),
      title: "Campaign Progress Update",
      content:
        "We are thrilled to share that we have reached 75% of our fundraising goal! Your generous contributions are making a real difference in the lives of those we serve.",
    },
    {
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      title: "New Milestone Reached",
      content:
        "Thanks to your support, we have successfully provided aid to 500 families this month. Every donation, no matter the size, contributes to our mission.",
    },
    {
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      title: "Campaign Launch",
      content:
        "We are excited to launch this campaign to support our ongoing initiatives. Join us in making a positive impact in our community.",
    },
  ]

  const container = document.getElementById("campaignUpdates")
  container.innerHTML = updates
    .map(
      (update) => `
        <div class="border-l-4 border-green-500 pl-4">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold">${update.title}</h4>
                <span class="text-sm text-gray-500">${formatDate(update.date)}</span>
            </div>
            <p class="text-gray-600">${update.content}</p>
        </div>
    `,
    )
    .join("")
}

function setAmount(amount) {
  document.getElementById("customAmount").value = amount

  // Update button styles
  document.querySelectorAll(".amount-btn").forEach((btn) => {
    btn.classList.remove("bg-green-50", "border-green-500", "text-green-700")
    btn.classList.add("border-gray-300")
  })

  event.target.classList.add("bg-green-50", "border-green-500", "text-green-700")
  event.target.classList.remove("border-gray-300")
}

function handleDonation(event) {
  event.preventDefault()

  const currentUser = getCurrentUser()
  if (!currentUser) {
    showLoginModal()
    return
  }

  const amount = Number.parseInt(document.getElementById("customAmount").value)
  if (!amount || amount < 1) {
    showToast("Please enter a valid donation amount", "error")
    return
  }

  const anonymous = document.getElementById("anonymous").checked

  // Show payment processing modal
  document.getElementById("paymentModal").classList.remove("hidden")

  // Simulate payment processing
  setTimeout(() => {
    processPayment(amount, anonymous)
  }, 3000)
}

function processPayment(amount, anonymous) {
  const currentUser = getCurrentUser()
  const campaignId = localStorage.getItem("selectedCampaign")
  const ngoId = localStorage.getItem("selectedNGO")

  // Create donation record
  const donations = JSON.parse(localStorage.getItem("donations") || "[]")
  const newDonation = {
    id: generateId(),
    donorId: currentUser.id,
    donorName: anonymous ? "Anonymous" : currentUser.name,
    ngoId: Number.parseInt(ngoId),
    campaignId: campaignId,
    amount: amount,
    date: new Date().toISOString(),
    status: "completed",
    transactionId: "TXN" + Date.now(),
  }

  donations.push(newDonation)
  localStorage.setItem("donations", JSON.stringify(donations))

  // Update NGO and campaign totals
  const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")
  const ngoIndex = ngos.findIndex((n) => n.id == ngoId)

  if (ngoIndex !== -1) {
    ngos[ngoIndex].totalRaised = (ngos[ngoIndex].totalRaised || 0) + amount

    // Update campaign raised amount
    if (ngos[ngoIndex].campaigns) {
      const campaignIndex = ngos[ngoIndex].campaigns.findIndex((c) => c.id == campaignId)
      if (campaignIndex !== -1) {
        ngos[ngoIndex].campaigns[campaignIndex].raised = (ngos[ngoIndex].campaigns[campaignIndex].raised || 0) + amount
      }
    }

    localStorage.setItem("ngos", JSON.stringify(ngos))
  }

  // Store donation for receipt
  localStorage.setItem("lastDonation", JSON.stringify(newDonation))

  // Hide payment modal and show success
  document.getElementById("paymentModal").classList.add("hidden")
  document.getElementById("successModal").classList.remove("hidden")

  // Refresh the page data
  setTimeout(() => {
    loadCampaignDetails()
  }, 1000)
}

function downloadReceipt() {
  const donation = JSON.parse(localStorage.getItem("lastDonation") || "{}")

  // Create receipt content
  const receiptContent = `
        DONATION RECEIPT
        ================
        
        Transaction ID: ${donation.transactionId}
        Date: ${formatDate(donation.date)}
        Amount: ${formatCurrency(donation.amount)}
        Donor: ${donation.donorName}
        
        Thank you for your generous donation!
        
        This receipt is for tax purposes.
        NGO Connect Platform
    `

  // Create and download file
  const blob = new Blob([receiptContent], { type: "text/plain" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `donation-receipt-${donation.transactionId}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)

  showToast("Receipt downloaded successfully!", "success")
}

function closeSuccessModal() {
  document.getElementById("successModal").classList.add("hidden")
}

// Helper functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"))
}

function showToast(message, type = "success") {
  // Simple toast implementation
  const toast = document.createElement("div")
  toast.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
    type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
  }`
  toast.textContent = message

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

function showLoginModal() {
  // Implementation would be in auth.js
  console.log("Show login modal")
}

const lucide = {
  createIcons: () => {
    // Mock implementation
    console.log("Creating icons")
  },
}
