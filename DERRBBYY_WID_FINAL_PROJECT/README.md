

# WID Training Application & Shortlisting System

A comprehensive web-based application system for Women in Development (WID) training programs with automated screening and shortlisting functionality.

## Features

### 🎯 Core Functionality
- **Automated Application Processing**: Applications are automatically scored based on predefined criteria
- **Real-time Shortlisting**: Instant feedback on application status
- **Comprehensive Form**: Collects personal info, education, experience, and preferences
- **Admin Dashboard**: View all applications, statistics, and manage data

### 📊 Scoring System
Applications are evaluated based on:
- **Education Level** (1-5 points): High school to PhD
- **Work Experience** (0-10 points): 0.5 points per year of experience
- **Age Range** (0-3 points): Optimal range 25-45 years
- **Availability** (2-5 points): Full-time gets highest score
- **Resources** (0-4 points): Laptop and internet access
- **Motivation** (0-3 points): Based on response quality and length

**Shortlisting Threshold**: 12 points minimum

### 🎨 Design Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean interface using Html, Tailwind CSS
- **Accessibility**: Proper form labels and keyboard navigation
- **Visual Feedback**: Color-coded status indicators and progress

## Files Structure

```
├── index.html          # Main application form and UI
├── script.js           # JavaScript functionality and logic
└── README.md             # Documentation
└── Assets             # Images
```

## Getting Started

1. **Open the Application**
   - Open `index.html` in any modern web browser

2. **Fill Out Application**
   - Complete all required fields marked with *
   - Provide detailed motivation for better scoring
   - Submit the form to get instant results

3. **View Results**
   - Get immediate feedback on application status
   - See detailed scoring breakdown
   - Receive next steps information

## Admin Features

### Dashboard Access
- Click "Toggle Admin Panel" to view admin dashboard
- See application statistics and full applicant list

### Data Management
- View all submitted applications
- Export data as JSON file
- Clear all application data

### Statistics Tracking
- Total applications submitted
- Number of shortlisted candidates
- Number of rejected applications

## Customization

### Modify Scoring Criteria
Edit the `SCORING_CRITERIA` object in `script.js`:

```javascript
const SCORING_CRITERIA = {
    education: {
        'high-school': 1,
        'diploma': 2,
        'bachelor': 3,
        'master': 4,
        'phd': 5
    },
    // ... other criteria
};
```

### Change Shortlisting Threshold
Modify the `SHORTLIST_THRESHOLD` constant:

```javascript
const SHORTLIST_THRESHOLD = 12; // Minimum score for shortlisting
```

### Add New Training Tracks
Update the training track options in `index.html`:

```html
<option value="new-track">New Training Track</option>
```

## Technical Details

### Technologies Used
- **HTML**: Semantic markup and form structure
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **JavaScript**: No external dependencies
- **Local Storage**: Client-side data persistence

### Data Storage
- Applications stored in browser's localStorage

## License

This project is open source and available under the MIT License.