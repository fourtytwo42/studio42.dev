# Product Showcase System

Complete specification for the product showcase system including homepage grid and individual product pages.

## Overview

The product showcase system displays all SaaS products in an attractive portfolio-style grid on the homepage, with detailed individual pages for each product. The design emphasizes visual excellence, smooth interactions, and a premium user experience that reflects the quality of the products being showcased.

## Design Philosophy

**Core Principles:**
- **Visual Excellence:** Every element should feel premium and polished
- **Performance First:** Fast load times, smooth animations, optimized images
- **Accessibility:** WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- **Mobile-First:** Responsive design that works beautifully on all devices
- **Unique Identity:** Custom design that stands out from standard frameworks

## Homepage Product Grid

### Layout

**Style:** Portfolio-style grid layout with masonry-inspired spacing

**Design Requirements:**
- Top-of-class visual design with custom CSS
- Responsive design (mobile-first approach)
- Smooth animations and transitions (60fps target)
- Hover effects with depth and elevation
- Loading states with skeleton screens
- Error states with graceful fallbacks

**Grid Specifications:**
- **Container:** Max-width 1400px, centered, padding 24px (mobile) to 48px (desktop)
- **Gap:** 24px between cards (mobile) to 32px (desktop)
- **Card Border Radius:** 16px (subtle, modern)
- **Card Shadow:** 
  - Default: `0 2px 8px rgba(0,0,0,0.08)`
  - Hover: `0 8px 24px rgba(0,0,0,0.12)`
  - Transition: 300ms ease-out

### Product Cards

Each product card displays:

1. **Thumbnail Image**
   - **Aspect Ratio:** 16:9 (recommended) or 4:3
   - **Size:** Full width of card, height auto-calculated
   - **Format:** WebP with JPEG fallback, optimized for web
   - **Loading:** Next.js Image component with lazy loading
   - **Hover Effect:** 
     - Scale: 1.05x (5% zoom)
     - Transition: 400ms cubic-bezier(0.4, 0, 0.2, 1)
     - Overlay: Dark gradient (0% to 30% opacity) on hover
   - **Fallback:** Placeholder with product initial/icon if image fails
   - **Alt Text:** Required for accessibility

2. **Status Badge**
   - **Position:** Absolute, top-right corner (12px from top, 12px from right)
   - **Size:** Padding 6px 12px, border-radius 12px
   - **Typography:** 12px font, 600 weight, uppercase, letter-spacing 0.5px
   - **Colors:**
     - Available: `#10b981` (green-500), background `#d1fae5` (green-100)
     - Coming Soon: `#f59e0b` (amber-500), background `#fef3c7` (amber-100)
     - In Development: `#6366f1` (indigo-500), background `#e0e7ff` (indigo-100)
   - **Text:** "Available", "Coming Soon", "In Development"
   - **Z-index:** 10 (above thumbnail)

3. **Product Name**
   - **Typography:** 24px (mobile) to 28px (desktop), 700 weight
   - **Color:** Primary text color (e.g., `#111827` or `#1f2937`)
   - **Line Height:** 1.2
   - **Margin:** 16px top, 0 bottom
   - **Truncation:** 2 lines max with ellipsis

4. **Tagline**
   - **Typography:** 14px (mobile) to 16px (desktop), 500 weight
   - **Color:** Secondary text color (e.g., `#6b7280`)
   - **Line Height:** 1.5
   - **Margin:** 4px top, 12px bottom
   - **Truncation:** 2 lines max with ellipsis

5. **Brief Description**
   - **Typography:** 14px, 400 weight
   - **Color:** Secondary text color (e.g., `#6b7280`)
   - **Line Height:** 1.6
   - **Margin:** 0 top, 20px bottom
   - **Truncation:** 3 lines max with ellipsis
   - **Character Limit:** ~150 characters recommended

6. **Primary CTA Button**
   - **Text:** Dynamic based on status:
     - Available: "View Demo" or "Try Now"
     - Coming Soon: "Get Notified" or "Learn More"
     - In Development: "Learn More"
   - **Styling:**
     - Background: Primary brand color
     - Text: White, 15px, 600 weight
     - Padding: 12px 24px
     - Border-radius: 8px
     - Width: Full width of card
     - Hover: Darken background 10%, scale 1.02x
     - Transition: 200ms ease
   - **Link:** Product page (`/products/[slug]`) or demo URL (external)

7. **Quick Links** (Optional, on hover)
   - **Position:** Overlay on thumbnail or below CTA
   - **Icons:** GitHub, YouTube (24px icons)
   - **Styling:** 
     - Background: White with 90% opacity
     - Border-radius: 50% (circular buttons)
     - Padding: 8px
     - Hover: Scale 1.1x, full opacity
   - **Links:** Open in new tab (`target="_blank"`, `rel="noopener noreferrer"`)
   - **Accessibility:** Icon labels for screen readers

### Grid Layout

**Breakpoints:**
- **Mobile:** < 640px (1 column)
- **Tablet:** 640px - 1024px (2 columns)
- **Desktop:** 1024px - 1440px (3 columns)
- **Large Desktop:** > 1440px (3-4 columns, max-width container)

**Responsive Specifications:**

**Mobile (< 640px):**
- 1 column, full width
- Card padding: 16px
- Gap: 16px
- Font sizes: Smaller (see typography scale)

**Tablet (640px - 1024px):**
- 2 columns, equal width
- Card padding: 20px
- Gap: 24px
- Font sizes: Medium

**Desktop (1024px - 1440px):**
- 3 columns, equal width
- Card padding: 24px
- Gap: 32px
- Font sizes: Full size

**Large Desktop (> 1440px):**
- 3-4 columns (depending on card width)
- Max container width: 1400px
- Centered with auto margins
- Gap: 32px

**Card Height:**
- **Strategy:** Flexible height (not fixed)
- **Minimum:** 400px (ensures consistency)
- **Content:** Natural flow, card expands as needed
- **Alignment:** Top-aligned in grid

### Interactions

1. **Hover Effects:**
   - **Card:** 
     - Elevation increase (shadow deepens)
     - Slight scale (1.02x) or translateY (-4px)
     - Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
   - **Thumbnail:** 
     - Zoom 1.05x
     - Dark overlay appears (0% to 30% opacity)
     - Transition: 400ms ease-out
   - **CTA Button:** 
     - Background darkens 10%
     - Scale 1.02x
     - Transition: 200ms ease
   - **Quick Links:** 
     - Fade in (opacity 0 to 1)
     - Scale up (0.9x to 1x)
     - Transition: 300ms ease-out

2. **Click Actions:**
   - **Card Click:** 
     - Entire card is clickable (except buttons/links)
     - Navigate to `/products/[slug]`
     - Cursor: pointer
     - Active state: Scale 0.98x (press effect)
   - **CTA Button:** 
     - Navigate to product page or demo URL
     - Loading state if external link
   - **GitHub/YouTube Icons:** 
     - Open in new tab
     - External link indicator
     - Analytics tracking (optional)

3. **Keyboard Navigation:**
   - **Tab Order:** Logical flow (card → CTA → links)
   - **Focus States:** Clear focus ring (2px, brand color)
   - **Enter/Space:** Activates card click or button
   - **Escape:** Closes any modals/overlays

4. **Touch Interactions:**
   - **Tap:** Same as click
   - **Long Press:** Context menu (optional)
   - **Swipe:** Scroll on mobile
   - **Hover:** Not applicable, use active states instead

## Individual Product Pages

### URL Structure

**Format:** `/products/[slug]`

**Examples:**
- `/products/lms`
- `/products/product-1`

### Page Sections

#### 1. Hero Section

**Content:**
- **Product Name:** 
  - Typography: 48px (mobile) to 64px (desktop), 800 weight
  - Color: Primary text
  - Line height: 1.1
  - Margin: 0 0 16px 0
- **Tagline:**
  - Typography: 20px (mobile) to 24px (desktop), 500 weight
  - Color: Secondary text
  - Line height: 1.4
  - Margin: 0 0 24px 0
- **Status Badge:** Same styling as card badge
- **Primary CTA Buttons:**
  - Primary: "Request Demo" → `/contact?source=[slug]`
    - Background: Brand primary color
    - Size: Large (16px padding, 18px font)
  - Secondary: "View Live Demo" → `[demoUrl]` (external)
    - Outline style (transparent, border)
    - Size: Large (16px padding, 18px font)
  - Spacing: 16px gap between buttons
  - Mobile: Stack vertically, full width
  - Desktop: Side by side, auto width
- **Hero Image/Thumbnail:**
  - Position: Right side (desktop) or below text (mobile)
  - Size: 50% width (desktop), 100% width (mobile)
  - Aspect ratio: 16:9 or 4:3
  - Border-radius: 16px
  - Shadow: Elevated shadow

**Design:**
- **Layout:** 
  - Desktop: 2-column (text left, image right)
  - Mobile: Stacked (text top, image bottom)
- **Container:** Max-width 1200px, centered, padding 24px (mobile) to 48px (desktop)
- **Height:** Minimum 400px (mobile) to 600px (desktop)
- **Background:** Optional subtle gradient or pattern
- **Spacing:** Generous padding (48px vertical on desktop)

#### 2. Overview Section

**Content:**
- **Full Product Description:**
  - Typography: 18px (mobile) to 20px (desktop), 400 weight
  - Color: Primary text (`#111827`)
  - Line height: 1.7
  - Max-width: 800px (for readability)
  - Margin: 0 0 32px 0
- **Key Highlights:**
  - Bullet list or numbered list
  - Typography: 16px, 500 weight
  - Color: Primary text
  - Line height: 1.6
  - Spacing: 12px between items
  - Icon: Optional checkmark or arrow icon (16px)
- **Use Cases:**
  - Heading: 24px, 600 weight, margin 0 0 16px 0
  - List format: Same as key highlights
  - Optional: Small icons or illustrations

**Design:**
- **Layout:**
  - Mobile: Single column, full width
  - Desktop: 2-column layout (description left, highlights/use cases right)
  - Max container width: 1200px
  - Padding: 48px vertical, 24px horizontal (mobile) to 64px vertical, 48px horizontal (desktop)
- **Spacing:**
  - Section margin: 0 0 64px 0
  - Between paragraphs: 24px
  - Between lists: 32px
- **Background:**
  - Optional: Subtle background color (`#f9fafb`) or white
  - Border-top: 1px solid `#e5e7eb` (separator from hero)

#### 3. Features Section

**Content:**
- **Section Heading:**
  - Text: "Features" or "Key Features"
  - Typography: 36px (mobile) to 48px (desktop), 700 weight
  - Color: Primary text
  - Alignment: Center (optional) or left
  - Margin: 0 0 48px 0
- **Feature Items:** From `features` JSON array
  - Each feature object: `{ title: string, description: string, icon?: string }`
  - Minimum 3 features, maximum 12 recommended
  - Display in grid layout

**Feature Card Specifications:**
- **Layout:**
  - Mobile: 1 column, full width
  - Tablet: 2 columns, equal width
  - Desktop: 3 columns, equal width
  - Gap: 24px (mobile) to 32px (desktop)
- **Card Styling:**
  - Background: White
  - Padding: 24px (mobile) to 32px (desktop)
  - Border-radius: 12px
  - Border: 1px solid `#e5e7eb` (optional)
  - Shadow: `0 2px 8px rgba(0,0,0,0.08)`
  - Hover: Shadow `0 8px 24px rgba(0,0,0,0.12)`, translateY -4px
  - Transition: 300ms ease-out
- **Icon (if provided):**
  - Size: 48px × 48px
  - Position: Top of card, centered
  - Color: Primary brand color or custom
  - Margin: 0 0 16px 0
  - Optional: Background circle (64px, brand color with 10% opacity)
- **Title:**
  - Typography: 20px, 600 weight
  - Color: Primary text
  - Line height: 1.3
  - Margin: 0 0 12px 0 (16px if icon present)
  - Alignment: Center (if icon) or left
- **Description:**
  - Typography: 16px, 400 weight
  - Color: Secondary text (`#6b7280`)
  - Line height: 1.6
  - Margin: 0
  - Max lines: 4 with ellipsis

**Design:**
- **Container:**
  - Max-width: 1200px
  - Centered with auto margins
  - Padding: 48px vertical, 24px horizontal (mobile) to 64px vertical, 48px horizontal (desktop)
- **Background:**
  - Optional: Alternating background colors (white and `#f9fafb`)
  - Or: Single background color
- **Spacing:**
  - Section margin: 0 0 64px 0
  - Cards: Equal height (flexbox)
  - Content alignment: Top-aligned

#### 4. Media Section

**Content:**
- **Embedded Videos:** YouTube embeds with custom player
- **Screenshots/Images:** High-quality product screenshots
- **Carousel:** If multiple items (videos + images)

**Video Embedding:**
- **Format:** YouTube embed URLs (`https://www.youtube.com/embed/VIDEO_ID`)
- **Responsive:** 
  - Aspect ratio: 16:9 maintained
  - Width: 100% of container
  - Max-width: 1200px
- **Lazy Loading:** 
  - Load on scroll into viewport
  - Placeholder thumbnail until play
- **Custom Player:**
  - Play button overlay on thumbnail
  - Click to play (not autoplay)
  - Custom controls (optional)
  - Fullscreen support

**Carousel Implementation:**
- **Navigation:**
  - Previous/Next arrows (chevron icons)
  - Dot indicators (showing current position)
  - Keyboard navigation (arrow keys)
  - Touch/swipe support (mobile)
- **Behavior:**
  - Smooth transitions (500ms ease)
  - Infinite loop (optional)
  - Auto-play disabled (user control)
  - Pause on hover (if auto-play enabled)
- **Accessibility:**
  - ARIA labels for navigation
  - Focus management
  - Screen reader announcements

**Image Gallery:**
- **Lightbox:** Optional full-screen image viewer
- **Features:**
  - Click image to open lightbox
  - Navigation between images
  - Zoom functionality
  - Close on Escape or click outside
- **Performance:**
  - Thumbnail images load first
  - Full-size images load on lightbox open
  - Progressive image loading

#### 5. Links Section

**Content:**
- **Section Heading:**
  - Text: "Resources" or "Links"
  - Typography: 36px (mobile) to 48px (desktop), 700 weight
  - Color: Primary text
  - Margin: 0 0 32px 0
- **Links to Display:**
  - GitHub repository (if `githubUrl` exists)
  - YouTube channel/playlist (if `youtubeUrl` exists)
  - Demo URL (if `demoUrl` exists)
  - Social sharing buttons (optional, Twitter, LinkedIn, etc.)

**Link Card Specifications:**
- **Layout:**
  - Mobile: 1 column, full width
  - Tablet: 2 columns, equal width
  - Desktop: 3 columns (if 3+ links) or 2 columns (if 2 links), equal width
  - Gap: 16px (mobile) to 24px (desktop)
- **Card Styling:**
  - Background: White or brand color (for primary link)
  - Padding: 20px (mobile) to 24px (desktop)
  - Border-radius: 12px
  - Border: 1px solid `#e5e7eb` (if white background)
  - Shadow: `0 2px 8px rgba(0,0,0,0.08)`
  - Hover: Shadow `0 8px 24px rgba(0,0,0,0.12)`, scale 1.02x
  - Transition: 300ms ease-out
  - Cursor: pointer
- **Icon:**
  - Size: 32px × 32px
  - Position: Left side or centered
  - Color: Brand color (if white background) or white (if brand background)
  - Margin: 0 12px 0 0 (if left) or 0 0 12px 0 (if centered)
- **Label:**
  - Typography: 18px, 600 weight
  - Color: Primary text (if white background) or white (if brand background)
  - Line height: 1.4
  - Margin: 0
- **Subtext (optional):**
  - Typography: 14px, 400 weight
  - Color: Secondary text
  - Margin: 4px 0 0 0
- **External Link Indicator:**
  - Small icon (12px) indicating external link
  - Position: Top-right corner or after label
  - Color: Secondary text

**Design:**
- **Container:**
  - Max-width: 1200px
  - Centered with auto margins
  - Padding: 48px vertical, 24px horizontal (mobile) to 64px vertical, 48px horizontal (desktop)
- **Alignment:**
  - Cards: Equal height (flexbox)
  - Content: Center-aligned (if icon centered) or left-aligned (if icon left)
- **Special Styling:**
  - Primary link (Demo): Can use brand color background with white text
  - Secondary links: White background with border

#### 6. Pricing Section (if applicable)

**Content:**
- **Section Heading:**
  - Text: "Pricing" or "Plans & Pricing"
  - Typography: 36px (mobile) to 48px (desktop), 700 weight
  - Color: Primary text
  - Margin: 0 0 16px 0
- **Subheading (optional):**
  - Text: Brief description of pricing model
  - Typography: 18px, 400 weight
  - Color: Secondary text
  - Margin: 0 0 48px 0
- **Pricing Information:**
  - From `pricing` field (text or JSON)
  - If JSON: `{ tiers: [{ name, price, period, features: [] }] }`
  - If text: Display as formatted text

**Pricing Card Specifications (if tiers):**
- **Layout:**
  - Mobile: 1 column, full width
  - Tablet: 2 columns, equal width
  - Desktop: 3 columns (if 3 tiers) or 2-4 columns, equal width
  - Gap: 24px (mobile) to 32px (desktop)
- **Card Styling:**
  - Background: White
  - Padding: 32px (mobile) to 40px (desktop)
  - Border-radius: 16px
  - Border: 2px solid `#e5e7eb` (default) or brand color (featured tier)
  - Shadow: `0 2px 8px rgba(0,0,0,0.08)`
  - Featured tier: Border brand color, shadow `0 8px 24px rgba(0,0,0,0.12)`
  - Hover: Shadow `0 8px 24px rgba(0,0,0,0.12)`, translateY -4px
  - Transition: 300ms ease-out
- **Tier Name:**
  - Typography: 24px, 700 weight
  - Color: Primary text
  - Margin: 0 0 8px 0
- **Price:**
  - Typography: 48px (mobile) to 56px (desktop), 800 weight
  - Color: Primary text or brand color
  - Line height: 1.1
  - Margin: 0 0 4px 0
  - Format: `$XX` or `$XX/month` or `$XX/year`
- **Period:**
  - Typography: 16px, 400 weight
  - Color: Secondary text
  - Margin: 0 0 24px 0
- **Features List:**
  - Typography: 16px, 400 weight
  - Color: Primary text
  - Line height: 1.6
  - Spacing: 12px between items
  - Icon: Checkmark (16px, brand color)
  - Margin: 0 0 32px 0
- **CTA Button:**
  - Text: "Get Started" or "Choose Plan"
  - Styling: Same as primary CTA button
  - Width: Full width of card
  - Margin: Auto 0 0 0 (pushes to bottom)

**Text-Only Pricing (if not tiers):**
- **Layout:**
  - Max-width: 800px
  - Centered
  - Typography: 18px, 400 weight
  - Line height: 1.7
  - Color: Primary text
- **Formatting:**
  - Support markdown or HTML
  - Bold for prices
  - Lists for features
  - Clear hierarchy

**Design:**
- **Container:**
  - Max-width: 1200px
  - Centered with auto margins
  - Padding: 48px vertical, 24px horizontal (mobile) to 64px vertical, 48px horizontal (desktop)
- **Background:**
  - Optional: Subtle background (`#f9fafb`) to distinguish section
- **Alignment:**
  - Cards: Equal height (flexbox)
  - Content: Top-aligned

#### 7. Call-to-Action Section

**Content:**
- **Section Heading:**
  - Text: "Ready to get started?" or "Try [Product Name] today"
  - Typography: 32px (mobile) to 48px (desktop), 700 weight
  - Color: Primary text or white (if colored background)
  - Alignment: Center
  - Margin: 0 0 16px 0
- **Subheading (optional):**
  - Text: Compelling value proposition or benefit
  - Typography: 18px, 400 weight
  - Color: Secondary text or white (if colored background)
  - Alignment: Center
  - Margin: 0 0 32px 0
- **CTA Buttons:**
  - Primary: "Request Demo" → `/contact?source=[slug]`
  - Secondary: "Contact Sales" → `/contact?source=[slug]&inquiry=sales`
  - Tertiary: "View Demo" → `[demoUrl]` (if available)
  - Spacing: 16px gap between buttons
  - Mobile: Stack vertically, full width
  - Desktop: Side by side, auto width

**Button Specifications:**
- **Primary Button:**
  - Background: Brand primary color
  - Text: White, 18px, 600 weight
  - Padding: 16px 32px
  - Border-radius: 8px
  - Hover: Darken 10%, scale 1.02x
  - Transition: 200ms ease
- **Secondary Button:**
  - Background: Transparent
  - Border: 2px solid brand color
  - Text: Brand color, 18px, 600 weight
  - Padding: 16px 32px
  - Border-radius: 8px
  - Hover: Background brand color 10% opacity, scale 1.02x
  - Transition: 200ms ease
- **Tertiary Button (if present):**
  - Background: Transparent
  - Border: None
  - Text: Brand color, 18px, 600 weight
  - Padding: 16px 32px
  - Text decoration: Underline on hover
  - Transition: 200ms ease

**Design:**
- **Container:**
  - Max-width: 1200px
  - Centered with auto margins
  - Padding: 64px vertical (mobile) to 96px vertical (desktop), 24px horizontal (mobile) to 48px horizontal (desktop)
- **Background:**
  - Option 1: Brand color gradient or solid brand color (with white text)
  - Option 2: White with subtle pattern or texture
  - Option 3: Neutral background (`#f9fafb`)
- **Layout:**
  - Content: Center-aligned
  - Buttons: Center-aligned, flexbox row (desktop) or column (mobile)
- **Spacing:**
  - Section margin: 0 (last section, no bottom margin)
  - Internal spacing: Generous padding for prominence

### Breadcrumb Navigation

**Location:** 
- Position: Below main header/navigation
- Top margin: 0 (touches header)
- Bottom margin: 24px (mobile) to 32px (desktop)

**Format:**
```
Home > Products > [Product Name]
```

**Styling:**
- **Container:**
  - Max-width: 1200px
  - Centered with auto margins
  - Padding: 16px 24px (mobile) to 24px 48px (desktop)
- **Typography:**
  - Font size: 14px, 400 weight
  - Color: Secondary text (`#6b7280`)
  - Line height: 1.5
- **Separator:**
  - Character: `>` or `/` or chevron icon
  - Color: Secondary text (`#9ca3af`)
  - Spacing: 8px before and after
  - Size: 12px
- **Links:**
  - Color: Secondary text (`#6b7280`)
  - Hover: Primary brand color, underline
  - Text decoration: None (underline on hover)
  - Transition: 200ms ease
- **Current Page:**
  - Color: Primary text (`#111827`)
  - Font weight: 500
  - Not clickable (no link)

**Links:**
- **Home:** Link to `/` (homepage)
- **Products:** Link to `/` with hash `#products` (scroll to products section) or `/products` (if separate page)
- **Product Name:** Current page (not linked, just text)

**Responsive:**
- **Mobile:**
  - May truncate: `... > Products > [Product Name]`
  - Or: Show only last 2 items
- **Desktop:**
  - Show full breadcrumb trail
  - All items visible

## Template System

### Template Structure

Products use a template-based system that can be customized per product while maintaining consistency.

**Base Template (Default):**
- **Sections (in order):**
  1. Hero Section
  2. Overview Section
  3. Features Section
  4. Media Section
  5. Links Section
  6. Pricing Section (if applicable)
  7. Call-to-Action Section
- **Layout:**
  - Container max-width: 1200px
  - Section spacing: 64px vertical (desktop), 48px (mobile)
  - Consistent padding: 24px (mobile) to 48px (desktop) horizontal
- **Styling:**
  - Uses design tokens (CSS variables)
  - Consistent typography scale
  - Standard component styles

**Template Variants:**

1. **Standard (default):**
   - Container: 1200px max-width
   - Sections: All standard sections
   - Spacing: Standard spacing scale

2. **Wide:**
   - Container: 1400px max-width
   - Sections: All standard sections
   - Spacing: Slightly increased (80px vertical)
   - Use case: Products with lots of content

3. **Compact:**
   - Container: 1000px max-width
   - Sections: Hero, Overview, Features, CTA (minimal)
   - Spacing: Reduced (48px vertical)
   - Use case: Simple products, quick overview

4. **Custom:**
   - Container: Configurable
   - Sections: Defined in `customSections` JSON
   - Spacing: Custom
   - Use case: Unique product requirements

### Template Fields

**Product Model Extensions:**
```typescript
{
  template: "default" | "wide" | "compact" | "custom",
  customSections: Json?, // Array of custom section definitions
  layout: "standard" | "wide" | "compact",
  customCss: String?, // Custom CSS class names
  sectionOrder: Json? // Custom section ordering
}
```

**Custom Sections JSON Format:**
```json
{
  "customSections": [
    {
      "type": "text",
      "title": "Custom Section Title",
      "content": "Section content...",
      "order": 3
    },
    {
      "type": "image",
      "title": "Screenshots",
      "images": ["url1", "url2"],
      "order": 4
    },
    {
      "type": "code",
      "title": "Code Example",
      "language": "javascript",
      "code": "console.log('hello');",
      "order": 5
    }
  ]
}
```

**Implementation:**
- Template selection in product page component
- Conditional rendering based on `template` field
- Custom sections rendered from `customSections` JSON
- CSS classes applied from `customCss` field
- Section ordering from `sectionOrder` or default order

## Data Structure

### Product Data

See [Database Schema](../database-schema.md) for complete schema.

**Key Fields:**
- `slug`: URL identifier
- `name`: Product name
- `tagline`: Short tagline
- `description`: Full description
- `status`: Availability status
- `thumbnail`: Thumbnail image URL
- `githubUrl`: GitHub link
- `youtubeUrl`: YouTube link
- `demoUrl`: Demo subdomain URL
- `pricing`: Pricing information
- `features`: JSON array of features

### Product Media

**Media Types:**
- `VIDEO`: YouTube embed URLs
- `IMAGE`: Image URLs
- `SCREENSHOT`: Screenshot URLs

**Ordering:**
- `order` field determines display order
- Used for carousel/gallery

## API Integration

### Fetching Products

**Homepage:**
- **Endpoint:** GET `/api/products`
- **Response Format:**
```json
{
  "products": [
    {
      "id": "uuid",
      "slug": "lms",
      "name": "AI Microlearning LMS",
      "tagline": "Intelligent learning management system",
      "description": "Brief description...",
      "status": "AVAILABLE",
      "thumbnail": "https://...",
      "githubUrl": "https://github.com/...",
      "youtubeUrl": "https://youtube.com/...",
      "demoUrl": "https://lms.studio42.dev",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```
- **Data Included:**
  - All product fields except full description (truncated to 150 chars)
  - No media items (for performance)
  - No features array (for performance)
- **Sorting:**
  1. Status: AVAILABLE first, then COMING_SOON, then IN_DEVELOPMENT
  2. Name: Alphabetical within each status
- **Caching:**
  - Cache-Control: `public, s-maxage=3600, stale-while-revalidate=86400`
  - Revalidate: 1 hour
  - Stale-while-revalidate: 24 hours

**Product Page:**
- **Endpoint:** GET `/api/products/[slug]`
- **Response Format:**
```json
{
  "product": {
    "id": "uuid",
    "slug": "lms",
    "name": "AI Microlearning LMS",
    "tagline": "Intelligent learning management system",
    "description": "Full product description...",
    "status": "AVAILABLE",
    "thumbnail": "https://...",
    "githubUrl": "https://github.com/...",
    "youtubeUrl": "https://youtube.com/...",
    "demoUrl": "https://lms.studio42.dev",
    "pricing": "Starting at $X/month",
    "features": [
      {
        "title": "AI-Powered",
        "description": "Intelligent content recommendations"
      }
    ],
    "media": [
      {
        "id": "uuid",
        "type": "VIDEO",
        "url": "https://youtube.com/embed/...",
        "title": "Product Demo",
        "order": 0
      }
    ],
    "template": "default",
    "customSections": null,
    "layout": "standard",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```
- **Data Included:**
  - All product fields
  - All media items (sorted by order)
  - Full features array
  - Template configuration
- **Error Handling:**
  - 404 if product not found
  - 500 for server errors
  - Proper error messages in response
- **Caching:**
  - ISR (Incremental Static Regeneration)
  - Revalidate: 3600 seconds (1 hour)
  - Generate static page on first request
  - Update in background

### Server Components

Use Next.js Server Components for:
- Data fetching (direct database queries, no API calls)
- SEO optimization (server-rendered meta tags)
- Performance (reduced client-side JavaScript)

**Implementation Example:**

```typescript
// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductPageContent from '@/components/products/ProductPageContent';
import { Metadata } from 'next';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      tagline: true,
      description: true,
      thumbnail: true,
    },
  });

  if (!product) {
    return {
      title: 'Product Not Found - Studio42.dev',
    };
  }

  return {
    title: `${product.name} - Studio42.dev`,
    description: product.tagline || product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.tagline || product.description.substring(0, 160),
      images: product.thumbnail ? [product.thumbnail] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.tagline || product.description.substring(0, 160),
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

// Generate static params for ISR
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Main page component
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      media: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Parse features JSON if string
  const features = typeof product.features === 'string' 
    ? JSON.parse(product.features) 
    : product.features;

  return (
    <ProductPageContent 
      product={{
        ...product,
        features,
      }} 
    />
  );
}
```

**Data Fetching Strategy:**
- Direct Prisma queries (no API route needed)
- Error handling with `notFound()` for 404s
- Type-safe with TypeScript
- Efficient queries (only fetch needed fields)
- Include relationships (media) in single query

## Design Guidelines

### Visual Style

**Principles:**
- Premium, top-of-class design that stands out
- Modern and clean with purposeful details
- Professional and trustworthy
- Unique and memorable visual identity
- Consistent design language across all products

**Color Scheme:**
- **Primary:** Brand color (e.g., `#6366f1` indigo or custom)
- **Secondary:** Accent colors (e.g., `#8b5cf6` purple, `#ec4899` pink)
- **Neutral:** 
  - Text primary: `#111827` or `#1f2937`
  - Text secondary: `#6b7280`
  - Text tertiary: `#9ca3af`
  - Background: `#ffffff` or `#f9fafb`
- **Status Colors:**
  - Available: `#10b981` (green-500)
  - Coming Soon: `#f59e0b` (amber-500)
  - In Development: `#6366f1` (indigo-500)
- **Semantic Colors:**
  - Success: `#10b981`
  - Warning: `#f59e0b`
  - Error: `#ef4444`
  - Info: `#3b82f6`

**Typography:**
- **Font Family:** 
  - Headings: Sans-serif (e.g., Inter, Poppins, or custom)
  - Body: Sans-serif (same family, different weights)
  - Monospace: For code snippets (if any)
- **Scale:**
  - H1: 48px (mobile) to 64px (desktop), 800 weight
  - H2: 36px (mobile) to 48px (desktop), 700 weight
  - H3: 24px (mobile) to 32px (desktop), 600 weight
  - Body: 16px, 400 weight
  - Small: 14px, 400 weight
- **Line Heights:**
  - Headings: 1.1 to 1.2
  - Body: 1.6 to 1.7
- **Links:**
  - Color: Primary brand color
  - Hover: Underline or color change
  - Focus: Clear focus ring

**Spacing System:**
- **Base Unit:** 4px
- **Scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
- **Usage:**
  - Small gaps: 8px, 12px
  - Medium gaps: 16px, 20px, 24px
  - Large gaps: 32px, 40px, 48px
  - Section spacing: 64px, 80px, 96px
- **Consistency:** Use spacing scale throughout

**Shadows:**
- **Small:** `0 1px 2px rgba(0,0,0,0.05)`
- **Medium:** `0 4px 6px rgba(0,0,0,0.1)`
- **Large:** `0 10px 15px rgba(0,0,0,0.1)`
- **XLarge:** `0 20px 25px rgba(0,0,0,0.1)`
- **Card:** `0 2px 8px rgba(0,0,0,0.08)`
- **Card Hover:** `0 8px 24px rgba(0,0,0,0.12)`

**Border Radius:**
- **Small:** 4px (buttons, badges)
- **Medium:** 8px (cards, inputs)
- **Large:** 12px (large cards, modals)
- **XLarge:** 16px (hero images, featured sections)

### Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Adaptations:**
- Grid columns adjust
- Font sizes scale
- Images optimize
- Navigation adapts

## Implementation Details

### Component Structure

```
components/
  products/
    ProductGrid.tsx          # Homepage grid container
    ProductCard.tsx          # Individual card component
    ProductPage.tsx          # Full product page wrapper
    ProductHero.tsx          # Hero section
    ProductOverview.tsx      # Overview section
    ProductFeatures.tsx      # Features grid
    ProductMedia.tsx         # Media carousel/gallery
    ProductLinks.tsx         # Links section
    ProductPricing.tsx       # Pricing section
    ProductCTA.tsx           # CTA section
    StatusBadge.tsx          # Status badge component
    ProductSkeleton.tsx      # Loading skeleton
```

### Styling Approach

**Custom CSS Strategy:**
- **CSS Modules:** Component-scoped styles
  - File: `ProductCard.module.css`
  - Import: `import styles from './ProductCard.module.css'`
  - Usage: `className={styles.card}`
- **Global Styles:** Design system tokens
  - File: `styles/design-tokens.css`
  - CSS custom properties (variables)
  - Colors, spacing, typography, shadows
- **Utility Classes:** Reusable helpers
  - File: `styles/utilities.css`
  - Limited, purposeful utilities
  - Examples: `.container`, `.sr-only`, `.focus-ring`
- **Component Styles:** Scoped to components
  - No global pollution
  - Easy to maintain
  - Clear dependencies

**Design Tokens (CSS Variables):**
```css
:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-secondary: #8b5cf6;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.6;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
}
```

**No Tailwind:**
- Avoid standard Tailwind utility classes
- Create custom design system with CSS Modules
- Build unique visual identity
- Better control over styling
- Smaller bundle size (only what's used)

### Code Example: ProductCard Component

**TypeScript Component:**
```typescript
// components/products/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import StatusBadge from './StatusBadge';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getCtaText = () => {
    switch (product.status) {
      case 'AVAILABLE':
        return 'View Demo';
      case 'COMING_SOON':
        return 'Get Notified';
      case 'IN_DEVELOPMENT':
        return 'Learn More';
      default:
        return 'Learn More';
    }
  };

  const truncatedDescription = product.description
    ? product.description.length > 150
      ? `${product.description.substring(0, 150)}...`
      : product.description
    : '';

  return (
    <article className={styles.card}>
      <Link 
        href={`/products/${product.slug}`} 
        className={styles.cardLink}
        aria-label={`View ${product.name} product page`}
      >
        <div className={styles.thumbnailWrapper}>
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={`${product.name} thumbnail`}
              width={400}
              height={225}
              className={styles.thumbnail}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,..." // Base64 placeholder
            />
          ) : (
            <div className={styles.thumbnailPlaceholder}>
              <span className={styles.placeholderText}>
                {product.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <StatusBadge status={product.status} />
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.name}>{product.name}</h3>
          {product.tagline && (
            <p className={styles.tagline}>{product.tagline}</p>
          )}
          {truncatedDescription && (
            <p className={styles.description}>{truncatedDescription}</p>
          )}
          
          <div className={styles.actions}>
            <Link 
              href={`/products/${product.slug}`}
              className={styles.ctaButton}
              onClick={(e) => e.stopPropagation()} // Prevent card click
            >
              {getCtaText()}
            </Link>
          </div>
        </div>
      </Link>
    </article>
  );
}
```

**CSS Module Example:**
```css
/* components/products/ProductCard.module.css */
.card {
  background: var(--color-background, #ffffff);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.cardLink {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.thumbnailWrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-background-secondary, #f9fafb);
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover .thumbnail {
  transform: scale(1.05);
}

.thumbnailPlaceholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.placeholderText {
  font-size: 64px;
  font-weight: 700;
  color: white;
  opacity: 0.8;
}

.content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-primary, #111827);
  margin: 0 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tagline {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--color-text-secondary, #6b7280);
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text-secondary, #6b7280);
  margin: 0 0 20px 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.actions {
  margin-top: auto;
  padding-top: 20px;
}

.ctaButton {
  display: inline-block;
  width: 100%;
  padding: 12px 24px;
  background: var(--color-primary, #6366f1);
  color: white;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 200ms ease, transform 200ms ease;
}

.ctaButton:hover {
  background: var(--color-primary-dark, #4f46e5);
  transform: scale(1.02);
}

.ctaButton:focus {
  outline: 2px solid var(--color-primary, #6366f1);
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 640px) {
  .content {
    padding: 16px;
  }
  
  .name {
    font-size: 20px;
  }
  
  .tagline {
    font-size: 14px;
  }
}
```

### Performance Optimization

**Image Optimization:**
- Use Next.js Image component
- WebP format with JPEG fallback
- Responsive images (srcset)
- Lazy loading below fold
- Blur placeholder for better UX

**Code Splitting:**
- Dynamic imports for heavy components
- Route-based code splitting (automatic with Next.js)
- Component lazy loading where appropriate

**Caching Strategy:**
- Static product pages (ISR - Incremental Static Regeneration)
- Revalidate: 3600 seconds (1 hour)
- API routes: Cache headers for product data

**Loading States:**
- **Skeleton Screens:**
  - Match card dimensions exactly
  - Animated shimmer effect
  - Show placeholder for thumbnail, text lines, button
  - Example: 3 skeleton cards on homepage
- **Progressive Loading:**
  - Load above-fold content first
  - Lazy load below-fold cards
  - Show loading indicator for async data
- **Optimistic UI Updates:**
  - Immediate feedback on interactions
  - Update UI before server response
  - Rollback on error

**Skeleton Component Example:**
```typescript
// components/products/ProductSkeleton.tsx
import styles from './ProductSkeleton.module.css';

export default function ProductSkeleton() {
  return (
    <article className={styles.skeleton}>
      <div className={styles.thumbnailSkeleton} />
      <div className={styles.contentSkeleton}>
        <div className={styles.titleSkeleton} />
        <div className={styles.taglineSkeleton} />
        <div className={styles.descriptionSkeleton} />
        <div className={styles.descriptionSkeleton} />
        <div className={styles.buttonSkeleton} />
      </div>
    </article>
  );
}
```

```css
/* ProductSkeleton.module.css */
.skeleton {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  min-height: 400px;
}

.thumbnailSkeleton {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.contentSkeleton {
  padding: 24px;
}

.titleSkeleton {
  height: 28px;
  width: 70%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.taglineSkeleton {
  height: 16px;
  width: 50%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
}

.descriptionSkeleton {
  height: 14px;
  width: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.descriptionSkeleton:last-of-type {
  width: 80%;
}

.buttonSkeleton {
  height: 44px;
  width: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  margin-top: 20px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

## Testing

### Test Scenarios

1. **Homepage:**
   - Grid displays all products correctly
   - Cards are clickable and navigate properly
   - Responsive layout works at all breakpoints
   - Loading states display correctly
   - Error states handle failures gracefully
   - Empty state (no products) displays message
   - Hover effects work (desktop)
   - Touch interactions work (mobile)

2. **Product Pages:**
   - Page loads with correct product data
   - All sections display in correct order
   - Media carousel navigates properly
   - Videos play when clicked
   - Links open correctly (internal/external)
   - 404 page for invalid slugs
   - Breadcrumb navigation works
   - CTA buttons link correctly

3. **Responsive Design:**
   - Mobile (< 640px): 1 column, stacked layout
   - Tablet (640px - 1024px): 2 columns
   - Desktop (1024px+): 3 columns
   - Touch interactions on mobile
   - Keyboard navigation on all devices
   - Images scale appropriately

4. **Performance:**
   - Images lazy load below fold
   - Page load time < 2 seconds
   - First Contentful Paint < 1.5 seconds
   - Smooth animations (60fps)
   - No layout shift (CLS < 0.1)
   - Lighthouse score > 90

5. **Accessibility:**
   - Keyboard navigation works
   - Screen reader compatibility
   - Focus indicators visible
   - Color contrast meets WCAG AA
   - Alt text on all images
   - ARIA labels where needed

6. **SEO:**
   - Meta titles and descriptions
   - Open Graph tags
   - Structured data (JSON-LD)
   - Semantic HTML
   - Proper heading hierarchy

### Testing Tools

- **Unit Tests:** Jest + React Testing Library
- **E2E Tests:** Playwright
- **Visual Regression:** Chromatic or Percy
- **Performance:** Lighthouse, WebPageTest
- **Accessibility:** axe DevTools, WAVE
- **Cross-browser:** BrowserStack or similar

## SEO Considerations

### Meta Tags

Each product page should include:
- **Title:** `[Product Name] - Studio42.dev`
- **Description:** Product tagline + brief description (150-160 chars)
- **Open Graph:**
  - `og:title`: Product name
  - `og:description`: Product description
  - `og:image`: Product thumbnail
  - `og:type`: `website`
  - `og:url`: Full product URL
- **Twitter Card:** Summary with large image
- **Canonical URL:** Prevent duplicate content

### Structured Data

**JSON-LD Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Product Name",
  "description": "Product description",
  "applicationCategory": "SaaS",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### URL Structure

- **Clean URLs:** `/products/[slug]`
- **SEO-friendly slugs:** Lowercase, hyphens, descriptive
- **Canonical:** One canonical URL per product
- **Redirects:** Handle old URLs gracefully

## Future Enhancements

- **Product Filtering:** Filter by status, category, tags
- **Search:** Full-text search across products
- **Product Categories/Tags:** Organize products
- **Related Products:** Show similar products
- **Product Comparison:** Side-by-side comparison
- **User Reviews/Testimonials:** Social proof
- **Product Changelog:** Version history and updates
- **Analytics:** Track product page views, clicks
- **A/B Testing:** Test different layouts/CTAs
- **Personalization:** Show relevant products based on behavior

