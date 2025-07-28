// Notification system for real-time updates

class NotificationManager {
  constructor() {
    this.notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    this.subscribers = new Map()
    this.initializeNotifications()
  }

  initializeNotifications() {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    // Setup periodic checks for new notifications
    setInterval(() => {
      this.checkForNewNotifications()
    }, 30000) // Check every 30 seconds

    // Setup real-time event listeners
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Listen for donation events
    document.addEventListener("donation-completed", (event) => {
      this.createNotification("donation", {
        title: "New Donation Received!",
        message: `₹${event.detail.amount} donated to ${event.detail.ngoName}`,
        type: "success",
        data: event.detail,
      })
    })

    // Listen for volunteer registrations
    document.addEventListener("volunteer-registered", (event) => {
      this.createNotification("volunteer", {
        title: "New Volunteer Registered!",
        message: `Someone joined ${event.detail.eventTitle}`,
        type: "info",
        data: event.detail,
      })
    })

    // Listen for campaign milestones
    document.addEventListener("campaign-milestone", (event) => {
      this.createNotification("milestone", {
        title: "Campaign Milestone Reached!",
        message: `${event.detail.campaignTitle} reached ${event.detail.percentage}% of goal`,
        type: "success",
        data: event.detail,
      })
    })
  }

  createNotification(type, notification) {
    const newNotification = {
      id: this.generateId(),
      type,
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
      userId: getCurrentUser()?.id || "all",
    }

    this.notifications.unshift(newNotification)

    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100)
    }

    localStorage.setItem("notifications", JSON.stringify(this.notifications))

    // Show browser notification if permission granted
    this.showBrowserNotification(newNotification)

    // Notify subscribers
    this.notifySubscribers("new-notification", newNotification)

    // Update notification badge
    this.updateNotificationBadge()
  }

  showBrowserNotification(notification) {
    if ("Notification" in window && Notification.permission === "granted") {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: notification.type,
      })

      // Auto close after 5 seconds
      setTimeout(() => {
        browserNotification.close()
      }, 5000)

      // Handle click
      browserNotification.onclick = () => {
        window.focus()
        this.handleNotificationClick(notification)
        browserNotification.close()
      }
    }
  }

  handleNotificationClick(notification) {
    // Mark as read
    this.markAsRead(notification.id)

    // Navigate based on notification type
    switch (notification.type) {
      case "donation":
        if (notification.data.ngoId) {
          localStorage.setItem("selectedNGO", notification.data.ngoId)
          window.location.href = "/pages/ngo-profile.html"
        }
        break
      case "volunteer":
        if (notification.data.eventId) {
          localStorage.setItem("selectedEvent", notification.data.eventId)
          window.location.href = "/pages/volunteer-events.html"
        }
        break
      case "milestone":
        if (notification.data.campaignId) {
          localStorage.setItem("selectedCampaign", notification.data.campaignId)
          window.location.href = "/pages/campaign-details.html"
        }
        break
    }
  }

  checkForNewNotifications() {
    // Simulate checking for new notifications from server
    // In a real app, this would make an API call

    // Random chance of new notification
    if (Math.random() < 0.1) {
      // 10% chance
      const notificationTypes = [
        {
          type: "system",
          title: "Platform Update",
          message: "New features have been added to improve your experience!",
          type_class: "info",
        },
        {
          type: "reminder",
          title: "Volunteer Reminder",
          message: "You have an upcoming volunteer event tomorrow.",
          type_class: "warning",
        },
        {
          type: "achievement",
          title: "Achievement Unlocked!",
          message: "You have made a positive impact on 100+ lives!",
          type_class: "success",
        },
      ]

      const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
      this.createNotification(randomNotification.type, {
        title: randomNotification.title,
        message: randomNotification.message,
        type: randomNotification.type_class,
      })
    }
  }

  getNotifications(userId = null, limit = 20) {
    let notifications = this.notifications

    // Filter by user if specified
    if (userId) {
      notifications = notifications.filter((n) => n.userId === userId || n.userId === "all")
    }

    // Return limited results
    return notifications.slice(0, limit)
  }

  getUnreadCount(userId = null) {
    let notifications = this.notifications

    if (userId) {
      notifications = notifications.filter((n) => n.userId === userId || n.userId === "all")
    }

    return notifications.filter((n) => !n.read).length
  }

  markAsRead(notificationId) {
    const index = this.notifications.findIndex((n) => n.id === notificationId)
    if (index !== -1) {
      this.notifications[index].read = true
      localStorage.setItem("notifications", JSON.stringify(this.notifications))
      this.updateNotificationBadge()
      this.notifySubscribers("notification-read", this.notifications[index])
    }
  }

  markAllAsRead(userId = null) {
    this.notifications.forEach((notification) => {
      if (!userId || notification.userId === userId || notification.userId === "all") {
        notification.read = true
      }
    })

    localStorage.setItem("notifications", JSON.stringify(this.notifications))
    this.updateNotificationBadge()
    this.notifySubscribers("all-notifications-read")
  }

  deleteNotification(notificationId) {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId)
    localStorage.setItem("notifications", JSON.stringify(this.notifications))
    this.updateNotificationBadge()
    this.notifySubscribers("notification-deleted", notificationId)
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, [])
    }
    this.subscribers.get(event).push(callback)
  }

  unsubscribe(event, callback) {
    if (this.subscribers.has(event)) {
      const callbacks = this.subscribers.get(event)
      const index = callbacks.indexOf(callback)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  notifySubscribers(event, data = null) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error("Error in notification subscriber:", error)
        }
      })
    }
  }

  updateNotificationBadge() {
    const currentUser = getCurrentUser()
    const unreadCount = this.getUnreadCount(currentUser?.id)

    // Update badge in navigation
    const badge = document.getElementById("notificationBadge")
    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? "99+" : unreadCount.toString()
        badge.classList.remove("hidden")
      } else {
        badge.classList.add("hidden")
      }
    }

    // Update page title
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) NGO Connect`
    } else {
      document.title = "NGO Connect"
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  }

  // Public API for creating custom notifications
  showToast(message, type = "info", duration = 3000) {
    const toast = document.createElement("div")
    toast.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 animate-slide-in ${
      type === "success"
        ? "bg-green-500"
        : type === "error"
          ? "bg-red-500"
          : type === "warning"
            ? "bg-yellow-500"
            : "bg-blue-500"
    }`

    toast.innerHTML = `
            <div class="flex items-center">
                <i data-lucide="${
                  type === "success"
                    ? "check-circle"
                    : type === "error"
                      ? "x-circle"
                      : type === "warning"
                        ? "alert-triangle"
                        : "info"
                }" class="w-5 h-5 mr-2"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        `

    document.body.appendChild(toast)

    // Auto remove after duration
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove()
      }
    }, duration)

    // Create icons
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }
}

// Initialize notification manager
const notificationManager = new NotificationManager()

// Helper function
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"))
}

// Export for global use
window.notificationManager = notificationManager

// Add CSS for animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .animate-slide-in {
        animation: slide-in 0.3s ease-out;
    }
`
document.head.appendChild(style)
