// Advanced search functionality

class SearchManager {
  constructor() {
    this.searchIndex = this.buildSearchIndex()
    this.searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]")
    this.initializeSearch()
  }

  initializeSearch() {
    // Setup global search functionality
    this.setupGlobalSearch()

    // Setup search suggestions
    this.setupSearchSuggestions()

    // Setup search filters
    this.setupSearchFilters()
  }

  buildSearchIndex() {
    const ngos = JSON.parse(localStorage.getItem("ngos") || "[]")
    const events = JSON.parse(localStorage.getItem("events") || "[]")

    const index = {
      ngos: ngos.map((ngo) => ({
        id: ngo.id,
        type: "ngo",
        title: ngo.name,
        description: ngo.description,
        category: ngo.category,
        location: ngo.location,
        keywords: [ngo.name, ngo.category, ngo.location, ngo.description].join(" ").toLowerCase(),
        data: ngo,
      })),
      events: events.map((event) => ({
        id: event.id,
        type: "event",
        title: event.title,
        description: event.description,
        category: event.category,
        location: event.location,
        ngoName: event.ngoName,
        keywords: [event.title, event.description, event.category, event.location, event.ngoName]
          .join(" ")
          .toLowerCase(),
        data: event,
      })),
    }

    return index
  }

  setupGlobalSearch() {
    // Add search functionality to all pages
    const searchInputs = document.querySelectorAll("[data-search]")

    searchInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        this.handleSearch(e.target.value, e.target.dataset.search)
      })

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.performSearch(e.target.value, e.target.dataset.search)
        }
      })
    })
  }

  setupSearchSuggestions() {
    const searchInputs = document.querySelectorAll("[data-search]")

    searchInputs.forEach((input) => {
      const suggestionsContainer = document.createElement("div")
      suggestionsContainer.className =
        "absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg z-50 hidden"
      suggestionsContainer.id = `suggestions-${input.id}`

      input.parentElement.style.position = "relative"
      input.parentElement.appendChild(suggestionsContainer)

      input.addEventListener("input", (e) => {
        this.showSuggestions(e.target.value, suggestionsContainer, input.dataset.search)
      })

      input.addEventListener("blur", () => {
        setTimeout(() => {
          suggestionsContainer.classList.add("hidden")
        }, 200)
      })

      input.addEventListener("focus", (e) => {
        if (e.target.value) {
          this.showSuggestions(e.target.value, suggestionsContainer, input.dataset.search)
        }
      })
    })
  }

  setupSearchFilters() {
    // Advanced filtering options
    const filterButtons = document.querySelectorAll("[data-filter]")

    filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const filterType = e.target.dataset.filter
        const filterValue = e.target.dataset.value
        this.applyFilter(filterType, filterValue)
      })
    })
  }

  handleSearch(query, searchType = "all") {
    if (query.length < 2) return []

    const results = this.search(query, searchType)
    this.displaySearchResults(results, searchType)

    return results
  }

  search(query, searchType = "all") {
    const normalizedQuery = query.toLowerCase().trim()
    let searchData = []

    // Determine what to search
    switch (searchType) {
      case "ngos":
        searchData = this.searchIndex.ngos
        break
      case "events":
        searchData = this.searchIndex.events
        break
      default:
        searchData = [...this.searchIndex.ngos, ...this.searchIndex.events]
    }

    // Perform search with scoring
    const results = searchData
      .map((item) => ({
        ...item,
        score: this.calculateRelevanceScore(item, normalizedQuery),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20) // Limit to top 20 results

    return results
  }

  calculateRelevanceScore(item, query) {
    let score = 0
    const queryWords = query.split(" ").filter((word) => word.length > 1)

    queryWords.forEach((word) => {
      // Exact title match (highest score)
      if (item.title.toLowerCase().includes(word)) {
        score += 10
      }

      // Category match
      if (item.category && item.category.toLowerCase().includes(word)) {
        score += 8
      }

      // Location match
      if (item.location && item.location.toLowerCase().includes(word)) {
        score += 6
      }

      // Description match
      if (item.description && item.description.toLowerCase().includes(word)) {
        score += 4
      }

      // NGO name match (for events)
      if (item.ngoName && item.ngoName.toLowerCase().includes(word)) {
        score += 7
      }

      // Keywords match
      if (item.keywords.includes(word)) {
        score += 2
      }
    })

    // Boost score for exact phrase matches
    if (item.keywords.includes(query)) {
      score += 15
    }

    return score
  }

  showSuggestions(query, container, searchType) {
    if (query.length < 2) {
      container.classList.add("hidden")
      return
    }

    const suggestions = this.getSuggestions(query, searchType)

    if (suggestions.length === 0) {
      container.classList.add("hidden")
      return
    }

    container.innerHTML = suggestions
      .slice(0, 5) // Show top 5 suggestions
      .map(
        (suggestion) => `
                <div class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0" 
                     onclick="selectSuggestion('${suggestion.title}', '${suggestion.type}', ${suggestion.id})">
                    <div class="flex items-center">
                        <i data-lucide="${suggestion.type === "ngo" ? "building" : "calendar"}" class="w-4 h-4 mr-2 text-gray-500"></i>
                        <div>
                            <div class="font-medium text-sm">${this.highlightMatch(suggestion.title, query)}</div>
                            <div class="text-xs text-gray-500">${suggestion.type === "ngo" ? "NGO" : "Event"} • ${suggestion.location}</div>
                        </div>
                    </div>
                </div>
            `,
      )
      .join("")

    container.classList.remove("hidden")

    // Create icons
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  getSuggestions(query, searchType) {
    const results = this.search(query, searchType)

    // Add search history suggestions
    const historyMatches = this.searchHistory
      .filter((term) => term.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 2)
      .map((term) => ({
        id: "history",
        type: "history",
        title: term,
        location: "Recent search",
        score: 1,
      }))

    return [...results.slice(0, 3), ...historyMatches]
  }

  highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, "gi")
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
  }

  performSearch(query, searchType) {
    if (!query.trim()) return

    // Add to search history
    this.addToSearchHistory(query)

    // Perform search
    const results = this.search(query, searchType)

    // Navigate to search results page or update current page
    if (window.location.pathname.includes("search")) {
      this.displaySearchResults(results, searchType)
    } else {
      // Navigate to search results page
      const searchParams = new URLSearchParams({
        q: query,
        type: searchType,
      })
      window.location.href = `/pages/search-results.html?${searchParams.toString()}`
    }
  }

  displaySearchResults(results, searchType) {
    const resultsContainer = document.getElementById("searchResults")
    if (!resultsContainer) return

    if (results.length === 0) {
      resultsContainer.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="search-x" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                    <p class="text-gray-600">Try adjusting your search terms or filters</p>
                </div>
            `
      return
    }

    resultsContainer.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Search Results</h2>
                <p class="text-gray-600">Found ${results.length} results</p>
            </div>
            <div class="space-y-6">
                ${results.map((result) => this.renderSearchResult(result)).join("")}
            </div>
        `

    // Create icons
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  renderSearchResult(result) {
    if (result.type === "ngo") {
      return `
                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center">
                            <i data-lucide="building" class="w-5 h-5 text-green-600 mr-2"></i>
                            <span class="text-sm text-green-600 font-medium">NGO</span>
                        </div>
                        ${result.data.verified ? '<span class="status-badge status-active">Verified</span>' : ""}
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">${result.title}</h3>
                    <p class="text-gray-600 mb-4">${result.description}</p>
                    <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span><i data-lucide="map-pin" class="w-4 h-4 inline mr-1"></i>${result.location}</span>
                        <span><i data-lucide="users" class="w-4 h-4 inline mr-1"></i>${result.data.volunteers} volunteers</span>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="viewNGO(${result.id})" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm">
                            View Details
                        </button>
                        <button onclick="donateToNGO(${result.id})" class="border border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition text-sm">
                            Donate
                        </button>
                    </div>
                </div>
            `
    } else if (result.type === "event") {
      return `
                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center">
                            <i data-lucide="calendar" class="w-5 h-5 text-blue-600 mr-2"></i>
                            <span class="text-sm text-blue-600 font-medium">Event</span>
                        </div>
                        <span class="badge badge-info">${result.category}</span>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">${result.title}</h3>
                    <p class="text-green-600 font-medium mb-2">${result.ngoName}</p>
                    <p class="text-gray-600 mb-4">${result.description}</p>
                    <div class="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                        <span><i data-lucide="calendar" class="w-4 h-4 inline mr-1"></i>${this.formatDate(result.data.date)}</span>
                        <span><i data-lucide="clock" class="w-4 h-4 inline mr-1"></i>${result.data.time}</span>
                        <span><i data-lucide="map-pin" class="w-4 h-4 inline mr-1"></i>${result.location}</span>
                        <span><i data-lucide="users" class="w-4 h-4 inline mr-1"></i>${result.data.registered}/${result.data.volunteers} registered</span>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="viewEvent(${result.id})" class="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition text-sm">
                            View Details
                        </button>
                        <button onclick="registerForEvent(${result.id})" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm">
                            Register
                        </button>
                    </div>
                </div>
            `
    }
  }

  addToSearchHistory(query) {
    // Remove if already exists
    this.searchHistory = this.searchHistory.filter((term) => term !== query)

    // Add to beginning
    this.searchHistory.unshift(query)

    // Keep only last 10 searches
    if (this.searchHistory.length > 10) {
      this.searchHistory = this.searchHistory.slice(0, 10)
    }

    localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory))
  }

  getSearchHistory() {
    return this.searchHistory
  }

  clearSearchHistory() {
    this.searchHistory = []
    localStorage.removeItem("searchHistory")
  }

  applyFilter(filterType, filterValue) {
    // Implementation for applying filters
    const currentUrl = new URL(window.location)
    currentUrl.searchParams.set(filterType, filterValue)
    window.history.pushState({}, "", currentUrl)

    // Trigger search with new filters
    const query = currentUrl.searchParams.get("q") || ""
    const results = this.search(query)
    this.displaySearchResults(results)
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}

// Initialize search manager
const searchManager = new SearchManager()

// Global functions for search suggestions
function selectSuggestion(title, type, id) {
  if (type === "ngo") {
    localStorage.setItem("selectedNGO", id)
    window.location.href = "/pages/ngo-profile.html"
  } else if (type === "event") {
    localStorage.setItem("selectedEvent", id)
    window.location.href = "/pages/volunteer-events.html"
  } else if (type === "history") {
    // Fill search input with history term
    const searchInput = document.querySelector("[data-search]")
    if (searchInput) {
      searchInput.value = title
      searchManager.performSearch(title, searchInput.dataset.search)
    }
  }
}

// Export for global use
window.searchManager = searchManager
