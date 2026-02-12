# 🎨 Virtual Try-On - Visual Guide

## 📸 Screenshots & UI Flow

### 1. Home Page - Entry Point

```
┌─────────────────────────────────────────────┐
│  [Try-On Image]                             │
│                                             │
│  ┌───────────────────┐                     │
│  │   Try It Now      │  ← Click here!      │
│  └───────────────────┘                     │
└─────────────────────────────────────────────┘
```

### 2. Virtual Try-On Page Layout

```
╔═══════════════════════════════════════════════════╗
║  ← Back    Virtual Try-On                         ║
║            Experience your dream lehenga...       ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  ┌──────────────────────┐  ┌──────────────────┐  ║
║  │ Step 1: Upload Photo │  │ Step 2: Select   │  ║
║  │                      │  │    Lehenga       │  ║
║  │  ┌────────────────┐  │  │ ┌──┬──┬──┐      │  ║
║  │  │  📸 Click to   │  │  │ │🔲│🔲│🔲│      │  ║
║  │  │  upload your   │  │  │ └──┴──┴──┘      │  ║
║  │  │  photo         │  │  │ ┌──┬──┬──┐      │  ║
║  │  │                │  │  │ │🔲│🔲│🔲│      │  ║
║  │  │  JPG, PNG      │  │  │ └──┴──┴──┘      │  ║
║  │  │  Max 5MB       │  │  │ ┌──┬──┬──┐      │  ║
║  │  └────────────────┘  │  │ │🔲│🔲│🔲│      │  ║
║  └──────────────────────┘  │ └──┴──┴──┘      │  ║
║                            │ ┌──┬──┬──┐      │  ║
║                            │ │🔲│🔲│🔲│      │  ║
║                            │ └──┴──┴──┘      │  ║
║                            └──────────────────┘  ║
║                                                   ║
║          ┌─────────────────────────┐             ║
║          │ ✨ Try Virtual Try-On   │             ║
║          └─────────────────────────┘             ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

### 3. After Upload

```
┌──────────────────────┐
│ Step 1: Upload Photo │
│                      │
│  ┌────────────────┐  │
│  │  [Your Photo]  │  │ ← Preview
│  │                │  │
│  │                │  │
│  │                │  │
│  └────────────────┘  │
│                      │
│  ✓ Photo uploaded   │
│    successfully      │
└──────────────────────┘
```

### 4. Product Selection

```
┌──────────────────┐
│ Step 2: Select   │
│    Lehenga       │
│                  │
│ ┌──┬──┬──┐       │
│ │🔲│🔲│🟡│ ← Gold border = Selected
│ └──┴──┴──┘       │
│ ┌──┬──┬──┐       │
│ │🔲│🔲│🔲│       │
│ └──┴──┴──┘       │
└──────────────────┘
```

### 5. Loading State

```
╔═══════════════════════════════════╗
║                                   ║
║           ⏳ [Spinner]            ║
║                                   ║
║    Creating your perfect look...  ║
║    This may take 10-20 seconds    ║
║                                   ║
╚═══════════════════════════════════╝
```

### 6. Result Display

```
╔═══════════════════════════════════════╗
║  ✨ Your Virtual Try-On Result       ║
║                                       ║
║  ┌─────────────────────────────────┐  ║
║  │                                 │  ║
║  │   [AI Generated Image]          │  ║
║  │   You wearing the lehenga!      │  ║
║  │                                 │  ║
║  └─────────────────────────────────┘  ║
║                                       ║
║  Love this look? Add it to cart!     ║
╚═══════════════════════════════════════╝
```

## 🎨 Color Scheme

### Primary Colors:

- **Deep Maroon:** `#4A0E0E` - Headers, buttons
- **Rose Gold:** `#E5B4A2` - Accents, borders
- **Gold Bright:** `#C2A35D` - Selected items
- **Ivory:** `#FDFBF7` - Background

### Usage:

```css
/* Upload area border */
border: 3px dashed #e5b4a2;

/* Selected product */
border: 3px solid #c2a35d;
box-shadow: 0 0 0 3px rgba(194, 163, 93, 0.3);

/* Try-On button */
background: linear-gradient(135deg, #4a0e0e, #6b1616);
```

## 📱 Responsive Breakpoints

### Desktop (> 1024px)

```
┌───────────────────────────────────────┐
│  Step 1         │       Step 2        │
│  (Upload)       │    (Product Grid)   │
│                 │                     │
│  50% width      │      50% width      │
└───────────────────────────────────────┘
```

### Tablet (768px - 1024px)

```
┌─────────────────────────────────────┐
│         Step 1 (Upload)             │
│          100% width                 │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│     Step 2 (Product Grid 3x4)       │
│          100% width                 │
└─────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌────────────────────┐
│   Step 1 Upload    │
│    100% width      │
└────────────────────┘
┌────────────────────┐
│   Product Grid     │
│      2x6           │
└────────────────────┘
```

## 🔄 State Management

### Component States:

```javascript
userImage: null → base64 string
userImageFile: null → File object
selectedProduct: null → { id, name, image }
loading: false → true → false
generatedImage: null → base64 string
error: "" → "Error message"
```

### UI States Flow:

```
Initial → Upload → Selected → Loading → Result
  ↓         ↓         ↓         ↓         ↓
Empty    Preview   Highlight  Spinner  Display
```

## 🎯 Interactive Elements

### Hover Effects:

```
Upload Area:
  Default: dashed border, light background
  Hover: solid border, darker background, lift up

Product Items:
  Default: white border, shadow
  Hover: lift up, stronger shadow
  Selected: gold border, glow effect

Try-On Button:
  Default: gradient maroon
  Hover: lift up, expand letters, stronger shadow
  Disabled: gray, no effects
```

## 📊 API Flow Diagram

```
Frontend                 Backend                 Gemini AI
   │                        │                        │
   │ 1. User uploads photo  │                        │
   │────────────────────────▶                        │
   │ FormData:              │                        │
   │ - userImage (file)     │                        │
   │ - productImageUrl      │                        │
   │                        │                        │
   │                        │ 2. Convert to base64   │
   │                        │────────────────────────▶
   │                        │ Prompt + 2 images      │
   │                        │                        │
   │                        │ 3. Generate try-on     │
   │                        │◀────────────────────────
   │                        │ Return: base64 image   │
   │                        │                        │
   │ 4. Display result      │                        │
   │◀────────────────────────                        │
   │ JSON: { generatedImage }                        │
   │                        │                        │
```

## 🎨 Component Hierarchy

```
VirtualTryOn
├── Navbar (imported)
├── Header Section
│   ├── Back Button
│   └── Title + Subtitle
├── Error Message (conditional)
├── Content Grid
│   ├── Upload Section
│   │   ├── Section Title
│   │   ├── Upload Area
│   │   │   ├── Input[type=file]
│   │   │   └── Label (clickable)
│   │   └── Preview Image (conditional)
│   └── Product Section
│       ├── Section Title
│       └── Product Grid
│           └── Product Items (map)
├── Action Section
│   └── Try-On Button
├── Loading Section (conditional)
│   ├── Spinner
│   └── Loading Text
└── Result Section (conditional)
    ├── Section Title
    ├── Generated Image
    └── Call to Action Text
```

## 🎭 Animation Timeline

```
Page Load:
  0ms: Fade in header
  200ms: Slide in upload section
  400ms: Slide in product section
  600ms: Fade in button

User Upload:
  0ms: File selected
  100ms: Preview fade in
  300ms: Success message appear

Product Select:
  0ms: Click
  100ms: Border color change
  200ms: Shadow expand

Loading:
  0ms: Button disabled
  100ms: Spinner appear
  200ms: Loading section slide up
  [10-20s]: Spinning animation

Result:
  0ms: Data received
  200ms: Loading section fade out
  400ms: Result section slide up
  600ms: Image fade in
```

## 📐 Spacing & Layout

```
Container: max-width 1400px, padding 60px 6%
Sections: border-radius 20px, padding 40px
Grid gap: 20px (products), 50px (main sections)
Button: padding 20px 60px, border-radius 50px
Icons: 3rem (upload), 1.5rem (buttons)
```

## 🎨 Typography

```
Page Title: 3rem, Cormorant Garamond, weight 300
Section Title: 1.5rem, Montserrat, weight 600
Body Text: 1rem, Montserrat, weight 400
Button Text: 1.1rem, Montserrat, weight 700, uppercase
Product Name: 0.9rem, Montserrat, weight 600
```

## 🌈 Visual Hierarchy

```
Priority 1 (Highest):
- Try-On Button (gradient, shadow, large)
- Page Title (largest text)

Priority 2:
- Section Titles (with icons)
- Selected Product (gold border)
- Upload Area (dashed border)

Priority 3:
- Product Grid Items
- Success/Error Messages
- Preview Images

Priority 4 (Lowest):
- Hints and helper text
- Background gradients
```

---

This visual guide helps you understand the UI structure and design decisions! 🎨
