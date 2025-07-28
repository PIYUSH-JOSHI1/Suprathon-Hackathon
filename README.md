# NGO Connect Platform 🌟

**Bridging Help with Technology** - A comprehensive platform connecting NGOs, donors, and volunteers across India through technology-driven transparency and impact tracking.

![NGO Connect](https://img.shields.io/badge/Version-1.0.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Web-orange.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [User Roles & Functionality](#user-roles--functionality)
- [API Integrations](#api-integrations)
- [Live Features](#live-features)
- [Sample Login Credentials](#sample-login-credentials)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🌟 Overview

NGO Connect is a modern web platform designed to bridge the gap between NGOs, donors, and volunteers in India. Built with vanilla HTML, CSS, and JavaScript, it provides a transparent, efficient ecosystem for social impact through technology-driven solutions.

### 🎯 Mission
To create a transparent, efficient, and impactful ecosystem that connects NGOs, donors, and volunteers, enabling meaningful social change across India through technology-driven solutions.

### 🏆 Key Objectives
- **Transparency**: Complete visibility into donation utilization
- **Efficiency**: Streamlined processes for all stakeholders
- **Impact**: Measurable social change and community development
- **Accessibility**: User-friendly interface for all demographics

## ✨ Features

### 🔐 Multi-Role Authentication System
- **Donors**: Individual and corporate donation management
- **Volunteers**: Event registration and activity tracking
- **NGOs**: Campaign and event management
- **Admins**: Platform oversight and NGO verification

### 🏢 NGO Management
- ✅ Verified NGO directory with detailed profiles
- ✅ Campaign creation and management
- ✅ Event organization and volunteer coordination
- ✅ Real-time donation tracking
- ✅ Impact reporting and transparency

### 💰 Donation System
- ✅ Secure donation processing simulation
- ✅ Multiple payment options (₹500, ₹1000, ₹2500, ₹5000, custom)
- ✅ Anonymous donation options
- ✅ Automatic receipt generation
- ✅ Tax certificate downloads
- ✅ Real-time donation tracking

### 🤝 Volunteer Management
- ✅ Event discovery and registration
- ✅ Location-based event recommendations
- ✅ Volunteer hour tracking
- ✅ Certificate generation
- ✅ Impact measurement

### 📍 Location-Based Features
- ✅ **Live Location Access**: Browser geolocation API integration
- ✅ **Nearby Events**: Find volunteer opportunities within 50km
- ✅ **Distance Calculation**: Haversine formula for accurate distances
- ✅ **Geocoding**: OpenStreetMap Nominatim API for address conversion
- ✅ **Location Permissions**: Proper user consent handling

### 🔴 Real-Time Features
- ✅ **Live Donations**: Real-time donation notifications every 30 seconds
- ✅ **Volunteer Activity**: Live event registrations
- ✅ **News Updates**: NGO-related news refresh every 5 minutes
- ✅ **Live Notifications**: Browser push notifications
- ✅ **Activity Tracking**: Real-time user engagement analytics

### 🔍 Advanced Search & Discovery
- ✅ **Smart Search**: Multi-criteria search with relevance scoring
- ✅ **Auto-suggestions**: Real-time search suggestions
- ✅ **Search History**: Persistent search history tracking
- ✅ **Filters**: Category, location, and type-based filtering
- ✅ **Fuzzy Matching**: Intelligent search result matching

### 📊 Analytics & Reporting
- ✅ **Dashboard Analytics**: Comprehensive performance metrics
- ✅ **Impact Tracking**: Measurable social impact reporting
- ✅ **Financial Transparency**: Detailed fund utilization reports
- ✅ **User Activity**: Real-time user engagement tracking
- ✅ **Growth Metrics**: Platform growth and adoption analytics

### 🔔 Notification System
- ✅ **Browser Notifications**: Native browser notification support
- ✅ **Real-time Updates**: Live activity notifications
- ✅ **Email Notifications**: Automated email alerts (simulated)
- ✅ **Push Notifications**: Web push notification support
- ✅ **Notification History**: Persistent notification tracking

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with Tailwind CSS
- **JavaScript (ES6+)**: Vanilla JavaScript for all functionality
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful, customizable icons

### APIs & Services (Free Tier)
- **OpenStreetMap Nominatim**: Free geocoding and reverse geocoding
- **Browser Geolocation API**: Built-in location services
- **Web Notifications API**: Browser notification support
- **Local Storage API**: Client-side data persistence
- **Fetch API**: Modern HTTP client

### Development Tools
- **No Build Process**: Pure vanilla implementation
- **CDN Integration**: External library loading
- **Local Storage**: Client-side data management
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

\`\`\`
ngo-connect-platform/
├── index.html                 # Main landing page
├── styles.css                 # Global styles and utilities
├── README.md                  # Project documentation
│
├── pages/                     # All application pages
│   ├── ngo-directory.html     # NGO listing and search
│   ├── ngo-profile.html       # Detailed NGO profiles
│   ├── volunteer-events.html  # Event listings
│   ├── campaign-details.html  # Campaign information
│   ├── transparency.html      # Transparency reports
│   ├── about.html            # About page
│   ├── donor-dashboard.html   # Donor management panel
│   ├── volunteer-dashboard.html # Volunteer management panel
│   ├── ngo-dashboard.html     # NGO management panel
│   └── admin-dashboard.html   # Admin control panel
│
└── js/                        # JavaScript modules
    ├── main.js               # Core application logic
    ├── auth.js               # Authentication system
    ├── ngo.js                # NGO-related functionality
    ├── donor.js              # Donor management
    ├── volunteer.js          # Volunteer management
    ├── admin.js              # Admin functionality
    ├── ngo-dashboard.js      # NGO dashboard logic
    ├── location.js           # Location-based features
    ├── live-features.js      # Real-time functionality
    ├── analytics.js          # Analytics and reporting
    ├── notifications.js      # Notification system
    ├── search.js             # Advanced search features
    └── campaign.js           # Campaign management
\`\`\`

## 🚀 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)
- Internet connection for CDN resources

### Quick Start

1. **Clone or Download**
   \`\`\`bash
   git clone https://github.com/your-username/ngo-connect-platform.git
   cd ngo-connect-platform
   \`\`\`

2. **Serve the Files**
   
   **Option A: Using Python (Recommended)**
   \`\`\`bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   \`\`\`
   
   **Option B: Using Node.js**
   \`\`\`bash
   npx http-server
   \`\`\`
   
   **Option C: Using PHP**
   \`\`\`bash
   php -S localhost:8000
   \`\`\`

3. **Open in Browser**
   \`\`\`
   http://localhost:8000
   \`\`\`

### Alternative Setup
- Simply open `index.html` in your browser (some features may be limited)
- Use any local development server of your choice
- Deploy to any static hosting service (Netlify, Vercel, GitHub Pages)

## 👥 User Roles & Functionality

### 🎯 Donor Role
**Access**: Donation management and impact tracking

**Features**:
- Browse and search verified NGOs
- Make secure donations with multiple payment options
- Track donation history and impact
- Download tax certificates and receipts
- View transparency reports
- Follow favorite NGOs for updates

**Dashboard Sections**:
- Overview with donation statistics
- Donation history and receipts
- Transparency and impact reports
- Tax certificates download

### 🤝 Volunteer Role
**Access**: Event discovery and participation tracking

**Features**:
- Discover volunteer opportunities
- Location-based event recommendations
- Register for events and activities
- Track volunteer hours and impact
- Download participation certificates
- View nearby events within 50km radius

**Dashboard Sections**:
- Overview with volunteer statistics
- My registered events
- Nearby events with location access
- Certificates and achievements
- Personal impact tracking

### 🏢 NGO Role
**Access**: Organization management and fundraising

**Features**:
- Create and manage fundraising campaigns
- Organize volunteer events
- Track donations and volunteer registrations
- Generate impact reports
- Manage organization profile
- Communicate with supporters

**Dashboard Sections**:
- Overview with organization metrics
- Campaign management
- Event organization
- Donation tracking
- Volunteer management
- Impact reporting

### 👨‍💼 Admin Role
**Access**: Platform oversight and management

**Features**:
- Verify and approve NGO registrations
- Monitor platform activity
- Generate comprehensive reports
- Manage user accounts
- Oversee transparency compliance
- Platform analytics and insights

**Dashboard Sections**:
- Platform overview and statistics
- NGO approval workflow
- User management
- Analytics and reporting
- System administration

## 🔌 API Integrations

### 📍 Location Services

**OpenStreetMap Nominatim API** (Free)
- **Geocoding**: Convert addresses to coordinates
- **Reverse Geocoding**: Convert coordinates to addresses
- **Usage**: Location-based NGO and event discovery
- **Endpoint**: `https://nominatim.openstreetmap.org/`
- **Rate Limit**: 1 request per second
- **Documentation**: [Nominatim API Docs](https://nominatim.org/release-docs/develop/api/Overview/)

**Browser Geolocation API** (Built-in)
- **Current Location**: Get user's current position
- **Permission Handling**: Proper user consent management
- **Accuracy**: High accuracy location detection
- **Usage**: Find nearby events and NGOs

### 📰 News Integration (Optional)

**NewsAPI** (Free Tier Available)
- **NGO News**: Fetch relevant news articles
- **API Key Required**: Free tier: 1000 requests/month
- **Endpoint**: `https://newsapi.org/v2/everything`
- **Documentation**: [NewsAPI Docs](https://newsapi.org/docs)

**Implementation Example**:
\`\`\`javascript
// Get API key from https://newsapi.org/
const NEWS_API_KEY = 'your-api-key-here';
const response = await fetch(`https://newsapi.org/v2/everything?q=NGO+India&apiKey=${NEWS_API_KEY}`);
\`\`\`

### 🌤 Weather Integration (Optional)

**OpenWeatherMap API** (Free Tier Available)
- **Weather Data**: Current weather for event locations
- **API Key Required**: Free tier: 1000 calls/day
- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Documentation**: [OpenWeatherMap API](https://openweathermap.org/api)

## 🔴 Live Features

### Real-Time Donations
\`\`\`javascript
// Simulates live donations every 30 seconds
setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance
        simulateNewDonation();
        showLiveDonationNotification();
    }
}, 30000);
\`\`\`

### Location-Based Discovery
\`\`\`javascript
// Get user location and find nearby events
navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const nearbyEvents = await findEventsWithinRadius(latitude, longitude, 50);
    displayNearbyEvents(nearbyEvents);
});
\`\`\`

### Live Notifications
\`\`\`javascript
// Browser notification system
if (Notification.permission === 'granted') {
    new Notification('New Donation!', {
        body: '₹5,000 donated to Akshaya Patra Foundation',
        icon: '/favicon.ico'
    });
}
\`\`\`

### Real-Time Analytics
\`\`\`javascript
// Track user interactions
function trackEvent(category, action, label, value) {
    const analytics = JSON.parse(localStorage.getItem('analytics') || '{}');
    analytics.events = analytics.events || [];
    analytics.events.push({
        timestamp: new Date().toISOString(),
        category, action, label, value
    });
    localStorage.setItem('analytics', JSON.stringify(analytics));
}
\`\`\`

## 🔑 Sample Login Credentials

### Admin Access
- **Email**: `admin@ngoconnect.com`
- **Password**: `admin123`
- **Role**: Admin
- **Access**: Full platform management

### NGO Access
- **Email**: `admin@akshayapatra.org`
- **Password**: `ngo123`
- **Role**: NGO
- **Organization**: Akshaya Patra Foundation

### Test Accounts
Create new accounts using the registration form with any of these roles:
- **Donor**: For donation and impact tracking
- **Volunteer**: For event participation
- **NGO**: For organization management (requires admin approval)

## 📂 File Structure Details

### Core Files

**index.html**
- Main landing page with hero section
- Featured NGOs showcase
- Statistics and impact metrics
- Authentication modals
- Navigation and footer

**styles.css**
- Tailwind CSS utilities and custom styles
- Responsive design classes
- Animation and transition effects
- Component-specific styling
- Print and accessibility styles

### JavaScript Modules

**main.js** - Core Application Logic
- Application initialization
- Sample data management
- Common utility functions
- Navigation and routing
- Toast notifications

**auth.js** - Authentication System
- Login and registration handling
- User session management
- Role-based access control
- Password validation
- User profile management

**location.js** - Location Services
- Geolocation API integration
- Distance calculations (Haversine formula)
- Geocoding and reverse geocoding
- Nearby event discovery
- Location permission handling

**live-features.js** - Real-Time Functionality
- Live donation simulation
- Real-time volunteer activity
- News feed integration
- Live notifications
- Activity tracking

**analytics.js** - Analytics & Reporting
- User interaction tracking
- Performance metrics
- Growth analytics
- Report generation
- Data visualization

**notifications.js** - Notification System
- Browser notification management
- Real-time alert system
- Notification history
- Push notification support
- Toast message system

**search.js** - Advanced Search
- Multi-criteria search engine
- Auto-suggestion system
- Search history management
- Relevance scoring algorithm
- Filter and sort functionality

### Page-Specific Files

**NGO Management**
- `ngo-directory.html`: NGO listing with search and filters
- `ngo-profile.html`: Detailed NGO information with donation
- `ngo-dashboard.html`: NGO management interface

**Volunteer System**
- `volunteer-events.html`: Event discovery and registration
- `volunteer-dashboard.html`: Volunteer activity tracking

**Donation System**
- `campaign-details.html`: Campaign information and donation
- `donor-dashboard.html`: Donor management and history

**Platform Management**
- `admin-dashboard.html`: Administrative controls
- `transparency.html`: Financial transparency reports
- `about.html`: Platform information and team

## 🎨 Design Features

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Enhanced tablet experience
- **Desktop**: Full-featured desktop interface
- **Accessibility**: WCAG 2.1 compliance

### User Experience
- **Intuitive Navigation**: Clear and consistent navigation
- **Fast Loading**: Optimized performance
- **Interactive Elements**: Engaging user interactions
- **Visual Feedback**: Clear action confirmations

### Visual Design
- **Modern UI**: Clean and contemporary design
- **Color Scheme**: Green and blue theme representing growth and trust
- **Typography**: Readable and accessible fonts
- **Icons**: Lucide React icon library
- **Images**: Placeholder images with proper alt text

## 🔧 Customization

### Adding New Features

1. **Create New Page**
   \`\`\`html
   <!-- pages/new-feature.html -->
   <!DOCTYPE html>
   <html lang="en">
   <!-- Include standard navigation and structure -->
   \`\`\`

2. **Add JavaScript Module**
   \`\`\`javascript
   // js/new-feature.js
   function initializeNewFeature() {
       // Feature implementation
   }
   \`\`\`

3. **Update Navigation**
   \`\`\`html
   <!-- Add to navigation in all pages -->
   <a href="pages/new-feature.html">New Feature</a>
   \`\`\`

### Styling Customization

**Custom CSS Classes**
\`\`\`css
/* Add to styles.css */
.custom-component {
    @apply bg-white rounded-lg shadow-md p-6;
}
\`\`\`

**Tailwind Configuration**
\`\`\`javascript
// Modify tailwind.config.js if using build process
module.exports = {
    theme: {
        extend: {
            colors: {
                'ngo-green': '#10b981',
                'ngo-blue': '#3b82f6'
            }
        }
    }
}
\`\`\`

### Data Management

**Adding New Data Types**
\`\`\`javascript
// Initialize in main.js
function initializeNewDataType() {
    if (!localStorage.getItem('newDataType')) {
        const sampleData = [
            // Sample data structure
        ];
        localStorage.setItem('newDataType', JSON.stringify(sampleData));
    }
}
\`\`\`

## 🧪 Testing

### Manual Testing Checklist

**Authentication**
- [ ] User registration with all roles
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Role-based access control
- [ ] Session persistence

**NGO Features**
- [ ] NGO directory browsing
- [ ] NGO profile viewing
- [ ] Campaign creation and management
- [ ] Event organization
- [ ] Donation tracking

**Volunteer Features**
- [ ] Event discovery and search
- [ ] Location-based event finding
- [ ] Event registration
- [ ] Volunteer dashboard
- [ ] Certificate generation

**Donation System**
- [ ] Donation process flow
- [ ] Payment simulation
- [ ] Receipt generation
- [ ] Donation history
- [ ] Tax certificate download

**Location Features**
- [ ] Location permission request
- [ ] Nearby event discovery
- [ ] Distance calculation accuracy
- [ ] Geocoding functionality
- [ ] Location error handling

### Browser Compatibility

**Supported Browsers**
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

**Required Features**
- ES6+ JavaScript support
- Local Storage API
- Geolocation API
- Fetch API
- Notification API

## 🚀 Deployment

### Static Hosting Options

**Netlify** (Recommended)
1. Connect GitHub repository
2. Set build command: `# No build required`
3. Set publish directory: `/`
4. Deploy automatically on push

**Vercel**
1. Import project from GitHub
2. Framework preset: Other
3. Build command: Leave empty
4. Output directory: `./`

**GitHub Pages**
1. Enable GitHub Pages in repository settings
2. Source: Deploy from branch
3. Branch: main
4. Folder: / (root)

**Firebase Hosting**
\`\`\`bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
\`\`\`

### Environment Configuration

**Production Setup**
\`\`\`javascript
// js/config.js
const CONFIG = {
    ENVIRONMENT: 'production',
    API_BASE_URL: 'https://api.ngoconnect.org',
    ENABLE_ANALYTICS: true,
    ENABLE_NOTIFICATIONS: true
};
\`\`\`

**Development Setup**
\`\`\`javascript
// js/config.js
const CONFIG = {
    ENVIRONMENT: 'development',
    API_BASE_URL: 'http://localhost:3000',
    ENABLE_ANALYTICS: false,
    ENABLE_NOTIFICATIONS: false
};
\`\`\`

## 📈 Performance Optimization

### Loading Performance
- **CDN Usage**: External libraries loaded from CDN
- **Image Optimization**: Placeholder images with proper sizing
- **Lazy Loading**: Implement for images and content
- **Minification**: Minify CSS and JavaScript for production

### Runtime Performance
- **Local Storage**: Efficient data caching
- **Event Delegation**: Optimized event handling
- **Debouncing**: Search input optimization
- **Virtual Scrolling**: For large lists (if needed)

### SEO Optimization
- **Meta Tags**: Proper meta descriptions and titles
- **Semantic HTML**: Proper HTML5 semantic elements
- **Alt Text**: All images have descriptive alt text
- **Structured Data**: JSON-LD for rich snippets

## 🔒 Security Considerations

### Client-Side Security
- **Input Validation**: All user inputs validated
- **XSS Prevention**: Proper HTML escaping
- **CSRF Protection**: Form token validation (simulated)
- **Data Sanitization**: Clean user-generated content

### Data Protection
- **Local Storage**: Sensitive data encryption (simulated)
- **Session Management**: Secure session handling
- **Privacy**: User data protection measures
- **GDPR Compliance**: Privacy policy and consent

### API Security
- **Rate Limiting**: API request throttling
- **CORS**: Proper cross-origin resource sharing
- **HTTPS**: Secure communication protocols
- **API Keys**: Secure API key management

## 🐛 Troubleshooting

### Common Issues

**Location Not Working**
- Ensure HTTPS or localhost for geolocation
- Check browser permissions
- Verify location services are enabled
- Test with different browsers

**Notifications Not Showing**
- Check browser notification permissions
- Verify notification API support
- Test in different browsers
- Check console for errors

**Data Not Persisting**
- Verify local storage is enabled
- Check browser storage limits
- Clear browser cache if needed
- Test in incognito mode

**Search Not Working**
- Check JavaScript console for errors
- Verify search index is built
- Test with different search terms
- Clear local storage and refresh

### Debug Mode

**Enable Debug Logging**
\`\`\`javascript
// Add to main.js
const DEBUG = true;

function debugLog(message, data = null) {
    if (DEBUG) {
        console.log(`[NGO Connect Debug] ${message}`, data);
    }
}
\`\`\`

**Performance Monitoring**
\`\`\`javascript
// Monitor performance
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
}
\`\`\`

## 🤝 Contributing

### Development Guidelines

**Code Style**
- Use consistent indentation (2 spaces)
- Follow JavaScript ES6+ standards
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain consistent file structure

**Git Workflow**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m "Add new feature"`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

**Pull Request Guidelines**
- Provide clear description of changes
- Include screenshots for UI changes
- Test thoroughly before submitting
- Update documentation if needed
- Follow existing code patterns

### Feature Requests

**Submitting Ideas**
1. Check existing issues for duplicates
2. Use issue templates
3. Provide detailed use cases
4. Include mockups if applicable
5. Consider implementation complexity

**Priority Features**
- Mobile app development
- Payment gateway integration
- Email notification system
- Advanced analytics dashboard
- Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

## 📞 Support

### Getting Help

**Documentation**
- Read this README thoroughly
- Check inline code comments
- Review example implementations
- Test with sample data

**Community Support**
- GitHub Issues for bug reports
- GitHub Discussions for questions
- Stack Overflow with tag `ngo-connect`
- Community Discord server

**Professional Support**
- Custom development services
- Training and workshops
- Deployment assistance
- Feature development

### Contact Information

**Project Maintainer**
- **Email**: support@ngoconnect.org
- **GitHub**: [@ngo-connect](https://github.com/ngo-connect)
- **LinkedIn**: [NGO Connect Platform](https://linkedin.com/company/ngo-connect)

**Bug Reports**
- Use GitHub Issues
- Provide detailed reproduction steps
- Include browser and OS information
- Attach screenshots if applicable

**Feature Requests**
- Use GitHub Discussions
- Describe use case clearly
- Provide implementation suggestions
- Consider community benefit

---

## 🎉 Acknowledgments

### Special Thanks
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide Icons** for beautiful, customizable icons
- **OpenStreetMap** for free geocoding services
- **MDN Web Docs** for comprehensive web API documentation

### Inspiration
This project was inspired by the need for transparency and efficiency in the NGO sector in India, aiming to bridge the gap between organizations and supporters through technology.

### Contributors
- Initial development and architecture
- UI/UX design and implementation
- Feature development and testing
- Documentation and deployment

---

**Made with ❤️ for social impact in India**

*Last updated: January 2025*

---

## 🚀 Quick Start Commands

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/ngo-connect-platform.git

# Navigate to project directory
cd ngo-connect-platform

# Start local server (Python)
python -m http.server 8000

# Open in browser
open http://localhost:8000
\`\`\`

**Ready to make a difference? Start exploring NGO Connect today!** 🌟
\`\`\`

This comprehensive README provides complete documentation for the NGO Connect platform, covering all aspects from installation to deployment, features to troubleshooting. The platform is now fully functional with all the requested features including location-based services, live features, proper dashboards, and working functionality throughout.
