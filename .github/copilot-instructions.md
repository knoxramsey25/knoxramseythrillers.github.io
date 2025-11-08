# AI Agent Instructions for Knox Ramsey Thrillers Website

## Project Overview
This repository contains the Knox Ramsey Thrillers website, focusing on the debut novel "Dark Recipe" and its companion Field Guide. The site showcases interactive systems diagrams, simulated control interfaces, and technical documentation that supports the novel's narrative.

## Core Architecture

### 1. Site Structure
- Root contains main landing pages and interactive features
- `/fieldguide/` houses the technical companion content
- `/assets/` contains shared CSS, JS, and media files
- `/darkrecipe/` contains book-specific content

### 2. Key Components

#### Field Guide System
- Entry point: `fieldguide/index.html` with `assets/js/fieldguide.js`
- Uses Mermaid.js for system architecture diagrams
- Navigation powered by sidebar and scroll-spy functionality
- Search functionality using `fieldguide/index.json`

#### Interactive HMI (Human-Machine Interface)
- Main dashboard: `fieldguide/systems/dashboard.html`
- Simulates agricultural control system compromise
- Uses real-time event generation and monitoring
- Examples in `recipe.html` and `fieldguide/demo/index.html`

### 3. Critical Patterns

#### Mermaid Diagrams
```mermaid
- Used for system architecture visualization
- Theme variables defined in CSS root
- Common components: Edge (sensors/actuators), Site Layer, Cloud
```

#### Event Generation
- Uses `generateEvent()` function for simulating system events
- Events categorized by severity: info, warn, error
- Example patterns in `recipe.html` and demo interfaces

## Development Guidelines

### 1. Style Conventions
- CSS variables defined in `:root` for consistent theming
- Dark theme with accent colors (#52ffa8, #ffb35a)
- Responsive design breakpoints at standard widths

### 2. JavaScript Architecture
- Modular functions for specific features (e.g., scroll-spy, event generation)
- Event listeners for keyboard navigation (j/k for section traversal)
- Data structures mirror system architecture (sensor arrays, event logs)

### 3. Content Organization
- Technical content lives in `/fieldguide/` with dedicated sections
- System diagrams use consistent visual language
- Interactive elements maintain narrative consistency

## Integration Points

### 1. Analytics
- Google Analytics integration (G-6R38ZMH8Y8)
- Event tracking for key user interactions

### 2. External Dependencies
- Mermaid.js for diagrams
- Google Analytics for tracking
- CSS/JS served from local `/assets/`

## Debugging Tips
- Check browser console for event simulation issues
- Verify Mermaid diagram syntax in dedicated sections
- Monitor event generation timing in interactive displays

## File Locations for Common Tasks
- Adding technical diagrams: `/fieldguide/systems/`
- Updating navigation: `_sidebar.html` in relevant directories
- Modifying event simulation: Edit `generateEvent()` function in relevant files

Remember to maintain narrative consistency with the novel while working on technical implementations.