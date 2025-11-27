# P&W Page - Projects & Workshops Component

A fully embeddable, responsive web component for the IEEE University of Houston Projects & Workshops page. This codebase follows the structure shown in the provided diagram and can be easily integrated into existing HTML pages.

## 🎨 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modular Architecture**: Easily customizable with sample data
- **Self-Contained**: All CSS and JavaScript included, minimal external dependencies
- **Embeddable**: Multiple methods to embed in existing pages
- **Interactive Navigation**: Smooth scrolling and dynamic section switching
- **Component-Based Structure**: Easy to extend and customize

## 📁 File Structure

```
pw-page/
├── index.html              # Main page structure
├── embed-example.html      # Integration examples and documentation
├── package.json            # Project metadata
├── README.md               # This file
├── styles/
│   └── main.css            # All styling with CSS variables for theming
└── js/
    ├── main.js             # Core functionality (PWPage class)
    └── data.js             # Sample data for content
```

## 🚀 Getting Started

### Quick Start

1. **Clone or download the repository**
   ```bash
   cd /home/kennym/projects/ieeeuh/pw-page
   ```

2. **Open in a browser**
   - Double-click `index.html` to open locally
   - Or run a simple server: `python3 -m http.server 8000`
   - Then visit `http://localhost:8000`

3. **View the standalone page**
   - Open `index.html` in your browser to see the full P&W Page

## 📋 Page Structure

Following the diagram provided, the page includes:

### Left Sidebar
- **Project Categories** - Main navigation
  - Overview/Summary
  - Workshops
  - Individual & Collaborative Projects
  - Project & Workshop Committee
  - Recorded Resources
- **Workshop Info** - Workshop details and dates
- **Workshop Details** - Forms and ratings

### Main Content Area
- Dynamic content sections matching the sidebar navigation
- Sub-sections for specific topics:
  - Circuit Speed Dating
  - Energy Techathon
  - CCO Initiative
  - P&W Weekly Schedule
  - P&W Interest Form
  - Micromouse
  - Battlebots
  - Chill Cook-off
  - Robotics@UH Link
  - Meet P&W Members
  - YouTube Channel

### Right Sidebar
- Quick links to popular items
- Red-themed accent color

## 🔧 Customization

### 1. Modifying Content Data

Edit `js/data.js` to add your own projects, workshops, and resources:

```javascript
const PWData = {
    workshops: [
        {
            id: 'my-workshop',
            name: 'My Workshop',
            description: 'Description here'
        },
        // Add more workshops...
    ],
    projects: [...],
    committee: [...],
    resources: [...]
};
```

### 2. Changing Colors and Styling

Edit `styles/main.css` to modify the color scheme:

```css
:root {
    --primary-color: #6366f1;      /* Main purple/blue */
    --secondary-color: #22c55e;    /* Green */
    --tertiary-color: #ef4444;     /* Red */
    --dark-color: #1f2937;         /* Dark gray */
    --light-color: #f3f4f6;        /* Light gray */
    --border-color: #d1d5db;
    --text-dark: #111827;
    --text-light: #6b7280;
}
```

### 3. Adding New Sections

Add sections to `index.html`:

```html
<section id="my-section" class="content-section" data-section="my-section">
    <h2>My Section Title</h2>
    <p>Content here...</p>
</section>
```

Then add navigation link:
```html
<li><a href="#my-section" class="nav-link" data-category="my-section">My Section</a></li>
```

## 🔌 Embedding in Other Pages

### Method 1: Using an iframe (Simplest)

```html
<iframe 
    src="path/to/pw-page/index.html" 
    width="100%" 
    height="800px" 
    frameborder="0" 
    title="P&W Page">
</iframe>
```

**Pros:** Simple, isolated
**Cons:** Limited styling integration

### Method 2: Direct HTML Integration

Copy the HTML structure from `index.html` into your page:

```html
<link rel="stylesheet" href="path/to/styles/main.css">

<!-- Copy the content from index.html body -->
<div id="pw-page-container" class="pw-page">
    <!-- ... HTML content ... -->
</div>

<script src="path/to/js/data.js"></script>
<script src="path/to/js/main.js"></script>
```

**Pros:** Full styling integration, customizable
**Cons:** More setup required

### Method 3: JavaScript Fetch and Inject

```javascript
fetch('path/to/pw-page/index.html')
    .then(response => response.text())
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        document.getElementById('container').innerHTML = doc.body.innerHTML;
        
        // Load associated styles and scripts
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'path/to/styles/main.css';
        document.head.appendChild(link);
    });
```

**Pros:** Dynamic loading
**Cons:** CORS restrictions may apply

## 📱 Responsive Breakpoints

The design responds to these breakpoints:
- **1024px and below**: Sidebar collapses, right sidebar hidden
- **768px and below**: Single column layout
- **480px and below**: Mobile optimized

## 🎯 JavaScript API

The page exposes a `PWPage` class with useful methods:

```javascript
// Navigate to a section
pwPage.navigateToSection('workshops');

// Navigate to a subsection
pwPage.navigateToSubsection('circuit-speed-dating');

// Scroll to a specific section
pwPage.scrollToSection('projects');

// Get currently active section
const current = pwPage.getCurrentSection();
```

## 🌐 External Navigation

From another page, you can navigate the P&W Page:

```javascript
// After the page has loaded
window.pwPage.navigateToSection('committee');
```

## 📦 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🛠️ Development Notes

### Adding More Data

1. Add data to `js/data.js` in the appropriate `PWData` category
2. The `PWPage` class automatically renders data from `PWData`
3. Make sure to use unique `id` attributes for linking

### Creating Custom Styles

You can override colors by adding CSS after loading `main.css`:

```css
:root {
    --primary-color: #your-color;
}
```

### Debugging

The `pwPage` object is global and accessible in the browser console:
```javascript
console.log(pwPage.getCurrentSection());
```

## 📄 License

MIT - Feel free to use and modify as needed

## 👥 Author

IEEE University of Houston - Projects & Workshops Team
