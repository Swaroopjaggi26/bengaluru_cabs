# Bengaluru Cabs - Airport Taxi Booking Website

Complete frontend-only website for Bengaluru Cabs airport taxi service.

## 📦 What's Included

- ✅ Complete React frontend application
- ✅ Custom Bengaluru Cabs logo
- ✅ Bengaluru cityscape + Airport background images
- ✅ **Auto-rotating hero carousel** (3-second transitions)
- ✅ Booking form (frontend-only, no backend)
- ✅ All sections: About, Services, Pricing, Locations, Blog
- ✅ WhatsApp & Phone integration
- ✅ Fully responsive design
- ✅ Tailwind CSS + shadcn/ui components

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will run on http://localhost:3000

### Build for Production

```bash
npm build
```

## 🎨 Customization Guide

### Change Auto-Transition Speed
File: `src/App.js` → Lines 46-52
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, 3000); // Change 3000 to 2000 for 2 seconds, 5000 for 5 seconds
  
  return () => clearInterval(interval);
}, [heroSlides.length]);
```

### Change Logo Size
File: `src/App.js` → Line 73
```javascript
<img src="/logo.png" className="w-72" />
// Change w-72 to: w-64 (smaller), w-80 (larger), w-96 (extra large)
```

### Add More Carousel Slides
File: `src/App.js` → Lines 24-43
```javascript
const heroSlides = [
  { image: "/bengaluru-bg.png", ... },
  { image: "/airport.png", ... },
  { image: "/bengaluru-bg.png", ... },
  {
    image: "/new-image.png",  // Add your image to public/ folder
    title: "Your Title",
    subtitle: "Your Subtitle",
    description: "Your description"
  }
];
```

### Update Phone Numbers
File: `src/App.js`
- Line 60: WhatsApp number
- Replace: `919449449510` with your number

## 📋 Key Features

- ✅ Auto-rotating carousel (changes every 3 seconds)
- ✅ 3 hero slides with smooth transitions
- ✅ Manual slide control with indicator dots
- ✅ Fully responsive design
- ✅ WhatsApp and phone integration

## 🛠️ Technology Stack

- React 19.0.0
- React Router DOM 7.5.1
- Tailwind CSS 3.4.17
- shadcn/ui components
- Lucide React (icons)

## 📄 License

Free to use and modify for your business.

---

**Made with ❤️ for Bengaluru Cabs**
