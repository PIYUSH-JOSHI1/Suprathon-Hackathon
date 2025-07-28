// Analytics and reporting functionality

class AnalyticsManager {
  constructor() {
    this.initializeAnalytics()
  }

  initializeAnalytics() {
    // Track page views
    this.trackPageView()

    // Track user interactions
    this.setupEventTracking()

    // Generate reports
    this.generateDailyReport()
  }

  trackPageView() {
    const analytics = JSON.parse(localStorage.getItem("analytics") || "{}")
    const currentPage = window.location.pathname
    const today = new Date().toISOString().split("T")[0]

    if (!analytics.pageViews) analytics.pageViews = {}
    if (!analytics.pageViews[today]) analytics.pageViews[today] = {}
    if (!analytics.pageViews[today][currentPage]) analytics.pageViews[today][currentPage] = 0

    analytics.pageViews[today][currentPage]++
    localStorage.setItem("analytics", JSON.stringify(analytics))
  }

  trackEvent(category, action, label = "", value = 0) {
    const analytics = JSON.parse(localStorage.getItem("analytics") || "{}")
    const today = new Date().toISOString().split("T")[0]

    if (!analytics.events) analytics.events = {}
    if (!analytics.events[today]) analytics.events[today] = []

    analytics.events[today].push({
      timestamp: new Date().toISOString(),
      category,
      action,
      label,
      value,
      user: getCurrentUser()?.id || "anonymous",
    })

    localStorage.setItem("analytics", JSON.stringify(analytics))
  }

  setupEventTracking() {
    // Track donation events
    document.addEventListener("donation-completed", (event) => {
      this.trackEvent("donation", "completed", event.detail.ngoId, event.detail.amount)
    })

    // Track volunteer registrations
    document.addEventListener("volunteer-registered", (event) => {
      this.trackEvent("volunteer", "registered", event.detail.eventId)
    })

    // Track NGO views
    document.addEventListener("ngo-viewed", (event) => {
      this.trackEvent("ngo", "viewed", event.detail.ngoId)
    })
  }

  generateDailyReport() {
    const analytics = JSON.parse(localStorage.getItem("analytics") || "{}")
    const today = new Date().toISOString().split("T")[0]

    const report = {
      date: today,
      pageViews: this.getTotalPageViews(today),
      donations: this.getDonationStats(today),
      volunteers: this.getVolunteerStats(today),
      topPages: this.getTopPages(today),
      userActivity: this.getUserActivity(today),
    }

    // Store daily report
    const reports = JSON.parse(localStorage.getItem("dailyReports") || "[]")
    const existingIndex = reports.findIndex((r) => r.date === today)

    if (existingIndex !== -1) {
      reports[existingIndex] = report
    } else {
      reports.push(report)
    }

    // Keep only last 30 days
    if (reports.length > 30) {
      reports.splice(0, reports.length - 30)
    }

    localStorage.setItem("dailyReports", JSON.stringify(reports))

    return report
  }

  getTotalPageViews(date) {
    const analytics = JSON.parse(localStorage.getItem("analytics") || "{}")
    const pageViews = analytics.pageViews?.[date] || {}

    return Object.values(pageViews).reduce((total, views) => total + views, 0)
  }

  getDonationStats(date) {
    const donations = JSON.parse(localStorage.getItem("donations") || "[]")
    const todayDonations = donations.filter((d) => d.date.startsWith(date))

    return {
      count: todayDonations.length,
      total: todayDonations.reduce((sum, d) => sum + d.amount, 0),
      average:
        todayDonations.length > 0 ? todayDonations.reduce((sum, d) => sum + d.amount, 0) / todayDonations.length : 0,
    }
  }

  getVolunteerStats(date) {
    const registrations = JSON.parse(localStorage.getItem("eventRegistrations") || "[]")
    const todayRegistrations = registrations.filter((r) => r.registeredAt.startsWith(date))

    return {
      count: todayRegistrations.length,
      uniqueUsers: new Set(todayRegistrations.map((r) => r.userId)).size,
    }
  }

  getTopPages(date) {
    const analytics = JSON.parse(localStorage.getItem("analytics") || "{}")
    const pageViews = analytics.pageViews?.[date] || {}

    return Object.entries(pageViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([page, views]) => ({ page, views }))
  }

  getUserActivity(date) {
    const analytics = JSON.parse(localStorage.getItem("analytics") || "{}")
    const events = analytics.events?.[date] || []

    const userActivity = {}
    events.forEach((event) => {
      if (!userActivity[event.user]) {
        userActivity[event.user] = { events: 0, actions: [] }
      }
      userActivity[event.user].events++
      userActivity[event.user].actions.push(`${event.category}:${event.action}`)
    })

    return userActivity
  }

  // Public methods for dashboard
  getWeeklyStats() {
    const reports = JSON.parse(localStorage.getItem("dailyReports") || "[]")
    const lastWeek = reports.slice(-7)

    return {
      pageViews: lastWeek.reduce((sum, r) => sum + r.pageViews, 0),
      donations: {
        count: lastWeek.reduce((sum, r) => sum + r.donations.count, 0),
        total: lastWeek.reduce((sum, r) => sum + r.donations.total, 0),
      },
      volunteers: lastWeek.reduce((sum, r) => sum + r.volunteers.count, 0),
    }
  }

  getMonthlyStats() {
    const reports = JSON.parse(localStorage.getItem("dailyReports") || "[]")
    const lastMonth = reports.slice(-30)

    return {
      pageViews: lastMonth.reduce((sum, r) => sum + r.pageViews, 0),
      donations: {
        count: lastMonth.reduce((sum, r) => sum + r.donations.count, 0),
        total: lastMonth.reduce((sum, r) => sum + r.donations.total, 0),
      },
      volunteers: lastMonth.reduce((sum, r) => sum + r.volunteers.count, 0),
      growth: this.calculateGrowth(lastMonth),
    }
  }

  calculateGrowth(reports) {
    if (reports.length < 2) return { pageViews: 0, donations: 0, volunteers: 0 }

    const firstHalf = reports.slice(0, Math.floor(reports.length / 2))
    const secondHalf = reports.slice(Math.floor(reports.length / 2))

    const firstHalfStats = {
      pageViews: firstHalf.reduce((sum, r) => sum + r.pageViews, 0),
      donations: firstHalf.reduce((sum, r) => sum + r.donations.count, 0),
      volunteers: firstHalf.reduce((sum, r) => sum + r.volunteers.count, 0),
    }

    const secondHalfStats = {
      pageViews: secondHalf.reduce((sum, r) => sum + r.pageViews, 0),
      donations: secondHalf.reduce((sum, r) => sum + r.donations.count, 0),
      volunteers: secondHalf.reduce((sum, r) => sum + r.volunteers.count, 0),
    }

    return {
      pageViews: this.calculatePercentageGrowth(firstHalfStats.pageViews, secondHalfStats.pageViews),
      donations: this.calculatePercentageGrowth(firstHalfStats.donations, secondHalfStats.donations),
      volunteers: this.calculatePercentageGrowth(firstHalfStats.volunteers, secondHalfStats.volunteers),
    }
  }

  calculatePercentageGrowth(oldValue, newValue) {
    if (oldValue === 0) return newValue > 0 ? 100 : 0
    return Math.round(((newValue - oldValue) / oldValue) * 100)
  }
}

// Initialize analytics
const analytics = new AnalyticsManager()

// Helper function to get current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"))
}

// Export for use in other files
window.analytics = analytics
