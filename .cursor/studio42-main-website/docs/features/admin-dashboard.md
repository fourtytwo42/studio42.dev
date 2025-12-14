# Admin Dashboard

Complete specification for the admin dashboard for managing contacts and email configuration.

## Overview

The admin dashboard provides secure access to manage contact submissions and configure email settings. It is not linked from public pages and requires authentication.

## Authentication

### Login Page

**URL:** `/admin/login`

**Features:**
- Email and password login
- Remember me option (optional)
- Error messages for invalid credentials
- Redirect to dashboard on success

**Security:**
- Rate limiting on login attempts
- Password hashing (bcrypt)
- Session-based authentication
- Secure session cookies

### Session Management

**Technology:** NextAuth.js or similar

**Session Duration:**
- Default: 7 days
- Configurable
- Refresh on activity

**Logout:**
- Manual logout button
- Automatic logout on session expiry
- Clear session on logout

## Dashboard Layout

### Header

**Components:**
- Site logo/branding
- Admin name/email
- Logout button
- Navigation menu

### Navigation

**Menu Items:**
- Dashboard (overview)
- Contacts
- Email Configuration
- Knowledge Base (future)
- Products (future)

### Main Content Area

- Dynamic content based on selected page
- Responsive layout
- Clear section headers

## Contacts Management

### Contacts List Page

**URL:** `/admin/contacts`

**Features:**

1. **Contacts Table:**
   - **Container:**
     - Background: White
     - Border-radius: 12px
     - Shadow: `0 2px 8px rgba(0,0,0,0.08)`
     - Overflow: Auto (horizontal scroll on mobile)
   - **Table Styling:**
     - Width: 100%
     - Border-collapse: Separate
     - Border-spacing: 0
     - Font: 14px, 400 weight
   - **Columns:**
     - **Name:** 
       - Width: 150px (min), flex: 1
       - Typography: 14px, 500 weight
       - Color: Primary text
     - **Email:**
       - Width: 200px (min), flex: 1
       - Typography: 14px, 400 weight
       - Color: Primary text
       - Link: `mailto:` on click
     - **Company:**
       - Width: 150px (min), flex: 1
       - Typography: 14px, 400 weight
       - Color: Secondary text
       - Show: "—" if empty
     - **Product:**
       - Width: 120px
       - Typography: 14px, 400 weight
       - Badge: Colored badge (same as product status colors)
     - **Inquiry Type:**
       - Width: 140px
       - Typography: 14px, 400 weight
       - Badge: Colored badge
     - **Date Submitted:**
       - Width: 160px
       - Typography: 14px, 400 weight
       - Format: "MMM DD, YYYY HH:mm" (e.g., "Jan 15, 2025 14:30")
     - **Status:**
       - Width: 120px
       - Badges:
         - Unread: Red dot + "Unread" text
         - Read: Gray dot + "Read" text
         - Responded: Green checkmark + "Responded" text
     - **Actions:**
       - Width: 100px
       - Buttons: Icon buttons (eye, checkmark, trash)
       - Hover: Show tooltips
   - **Table Header:**
     - Background: `#f9fafb`
     - Typography: 12px, 600 weight, uppercase, letter-spacing 0.5px
     - Color: Secondary text (`#6b7280`)
     - Padding: 12px 16px
     - Border-bottom: 1px solid `#e5e7eb`
     - Sortable: Arrow icon, click to sort
   - **Table Rows:**
     - Padding: 16px
     - Border-bottom: 1px solid `#f3f4f6`
     - Hover: Background `#f9fafb`
     - Selected: Background `#eff6ff`, border-left: 3px solid `#6366f1`
   - **Sortable Columns:**
     - Click header to sort
     - Arrow indicator: Up (asc), Down (desc), Both (unsorted)
     - Active sort: Highlight header, show arrow
   - **Pagination:**
     - Position: Bottom of table
     - Items per page: 25, 50, 100 (dropdown)
     - Page numbers: Show 5 pages, ellipsis for more
     - Previous/Next buttons
     - Typography: 14px, 400 weight
   - **Row Selection:**
     - Checkbox in first column
     - Bulk actions: Show when rows selected
     - Actions: Mark as read, Mark as responded, Delete

2. **Filters:**
   - **Container:**
     - Background: White
     - Border-radius: 12px
     - Padding: 20px
     - Margin: 0 0 24px 0
     - Shadow: `0 2px 8px rgba(0,0,0,0.08)`
   - **Layout:**
     - Grid: 2 columns (desktop), 1 column (mobile)
     - Gap: 16px
   - **Filter Types:**
     - **Read/Unread Status:**
       - Type: Select dropdown
       - Options: "All", "Unread", "Read", "Responded"
       - Default: "All"
       - Width: 100%
     - **Product Filter:**
       - Type: Select dropdown
       - Options: "All Products" + all products from database
       - Default: "All Products"
       - Width: 100%
     - **Inquiry Type Filter:**
       - Type: Select dropdown
       - Options: "All Types" + all inquiry types
       - Default: "All Types"
       - Width: 100%
     - **Date Range Filter:**
       - Type: Date picker (start and end)
       - Format: "MM/DD/YYYY"
       - Default: Last 30 days
       - Width: 100% (each input)
     - **Search:**
       - Type: Text input
       - Placeholder: "Search by name, email, or message..."
       - Icon: Search icon (left side)
       - Width: 100% (full width, spans both columns on desktop)
       - Real-time: Search as you type (debounced 300ms)
   - **Filter Actions:**
     - "Clear Filters" button (if any filters active)
     - "Apply Filters" button (if manual apply mode)
     - Active filter count badge

3. **Search:**
   - Real-time search
   - Search by name, email, or message content
   - Highlight matches

4. **Actions:**
   - Mark as read/unread
   - Mark as responded
   - Delete (with confirmation)
   - Export to CSV (optional)

5. **Statistics:**
   - **Container:**
     - Layout: Grid, 4 columns (desktop), 2 columns (tablet), 1 column (mobile)
     - Gap: 24px
     - Margin: 0 0 32px 0
   - **Stat Cards:**
     - Background: White
     - Border-radius: 12px
     - Padding: 24px
     - Shadow: `0 2px 8px rgba(0,0,0,0.08)`
     - Hover: Shadow `0 4px 12px rgba(0,0,0,0.12)`, translateY -2px
     - Transition: 300ms ease
   - **Stat Card Content:**
     - **Label:**
       - Typography: 14px, 500 weight
       - Color: Secondary text (`#6b7280`)
       - Margin: 0 0 8px 0
     - **Value:**
       - Typography: 32px, 700 weight
       - Color: Primary text (`#111827`)
       - Margin: 0
     - **Change Indicator (optional):**
       - Typography: 12px, 400 weight
       - Color: Green (positive) or Red (negative)
       - Icon: Arrow up/down
       - Format: "+5.2%" or "-2.1%"
   - **Statistics:**
     - **Total Contacts:**
       - Label: "Total Contacts"
       - Icon: Users icon (optional)
       - Color: Primary brand color
     - **Unread Count:**
       - Label: "Unread"
       - Icon: Mail icon (optional)
       - Color: Red (`#ef4444`)
       - Badge: Red dot if > 0
     - **Today's Submissions:**
       - Label: "Today"
       - Icon: Calendar icon (optional)
       - Color: Blue (`#3b82f6`)
     - **This Week's Submissions:**
       - Label: "This Week"
       - Icon: Chart icon (optional)
       - Color: Green (`#10b981`)

### Contact Details Page

**URL:** `/admin/contacts/[id]`

**Features:**

1. **Contact Information:**
   - All form fields displayed
   - Read-only view
   - Formatted display

2. **Actions:**
   - Mark as read
   - Mark as responded
   - Delete contact
   - Reply via email (if configured)
   - Copy email address

3. **Metadata:**
   - Submission timestamp
   - Source (where they came from)
   - IP address (optional, for security)

4. **History:**
   - Status changes
   - Admin actions
   - Timestamps

## Email Configuration

### Email Settings Page

**URL:** `/admin/email-config`

**Features:**

1. **Enable/Disable:**
   - Toggle switch
   - Clear indication of current status
   - Warning when disabled

2. **SMTP Configuration:**
   - Host: Text input
   - Port: Number input (1-65535)
   - Username: Text input
   - Password: Password input (masked)
   - Secure (TLS/SSL): Checkbox
   - Test connection button

3. **Email Addresses:**
   - From Email: Email input
   - From Name: Text input
   - Admin Email: Email input (for notifications)

4. **Email Templates:**
   - User Confirmation Template:
     - Rich text editor or markdown
     - Variable insertion
     - Preview functionality
   - Admin Notification Template:
     - Rich text editor or markdown
     - Variable insertion
     - Preview functionality

5. **Template Variables:**
   - Dropdown or button list
   - Click to insert
   - Available variables displayed

6. **Test Email:**
   - Send test email button
   - Test to admin email
   - Verify configuration works

### Template Editor

**Features:**
- Rich text editor (TinyMCE, Quill, or similar)
- Markdown support (optional)
- Variable insertion
- Live preview
- Save/Cancel buttons

**Available Variables:**
- `{name}` - User's name
- `{email}` - User's email
- `{company}` - User's company
- `{phone}` - User's phone
- `{product}` - Product name
- `{inquiryType}` - Inquiry type
- `{message}` - User's message
- `{source}` - Source URL
- `{timestamp}` - Submission timestamp
- `{adminDashboardUrl}` - Link to admin dashboard

## API Endpoints

### GET /api/admin/contacts

Get all contacts with filtering and pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)
- `read`: Filter by read status (true/false)
- `product`: Filter by product slug
- `inquiryType`: Filter by inquiry type
- `search`: Search query
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "contacts": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  },
  "stats": {
    "total": 100,
    "unread": 25,
    "today": 5,
    "thisWeek": 20
  }
}
```

### PATCH /api/admin/contacts/[id]

Update contact (mark as read, responded, etc.).

**Request Body:**
```json
{
  "read": true,
  "responded": true
}
```

### DELETE /api/admin/contacts/[id]

Delete contact.

**Response:**
```json
{
  "success": true
}
```

### GET /api/admin/email-config

Get email configuration.

**Response:**
```json
{
  "config": {
    "enabled": true,
    "smtpHost": "smtp.example.com",
    ...
  }
}
```

**Note:** Password is never returned.

### PUT /api/admin/email-config

Update email configuration.

**Request Body:**
```json
{
  "enabled": true,
  "smtpHost": "smtp.example.com",
  "smtpPort": 587,
  "smtpUser": "user@example.com",
  "smtpPassword": "password",
  "smtpSecure": true,
  "fromEmail": "noreply@studio42.dev",
  "fromName": "Studio42",
  "adminEmail": "admin@studio42.dev",
  "confirmationTemplate": "...",
  "notificationTemplate": "..."
}
```

### POST /api/admin/email-config/test

Send test email.

**Request Body:**
```json
{
  "to": "test@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully"
}
```

## Security

### Access Control

- **Authentication Required:** All admin routes require authentication
- **No Public Links:** Admin pages not linked from public site
- **Direct URL Access:** Only via direct URL with authentication
- **Session Validation:** Every request validates session

### Password Security

- **Hashing:** Bcrypt with salt rounds (10+)
- **Password Requirements:** Minimum length, complexity (optional)
- **Password Reset:** Future feature

### Rate Limiting

- **Login Attempts:** 5 attempts per 15 minutes per IP
- **API Requests:** Reasonable limits to prevent abuse

### Data Protection

- **Encryption:** SMTP passwords encrypted in database
- **HTTPS:** Required in production
- **Input Validation:** All inputs validated and sanitized

## UI/UX

### Design Principles

- **Clean and Professional:** Admin interface should be clean and easy to use
- **Efficient:** Common actions should be quick
- **Responsive:** Works on all screen sizes
- **Accessible:** Follow accessibility guidelines

### Responsive Design

- **Desktop:** Full table view, side navigation
- **Tablet:** Collapsible navigation, responsive table
- **Mobile:** Stacked layout, mobile-friendly forms

### Loading States

- **Data Loading:** Show loading indicators
- **Form Submission:** Disable buttons, show spinner
- **API Calls:** Loading states for async operations

### Error Handling

- **Validation Errors:** Inline error messages
- **API Errors:** User-friendly error messages
- **Network Errors:** Retry options
- **404 Errors:** Proper error pages

## Future Enhancements

- **Analytics Dashboard:** Contact submission trends, charts
- **Bulk Actions:** Mark multiple contacts as read
- **Email Templates Library:** Pre-built templates
- **Contact Export:** CSV, Excel export
- **Email Integration:** Direct email sending from dashboard
- **Notes:** Add notes to contacts
- **Tags:** Tag contacts for organization
- **Automation:** Auto-responders, workflows

## Implementation Notes

### Component Structure

```
app/
  admin/
    layout.tsx              # Admin layout with auth
    login/
      page.tsx              # Login page
    dashboard/
      page.tsx              # Dashboard overview
    contacts/
      page.tsx              # Contacts list
      [id]/
        page.tsx            # Contact details
    email-config/
      page.tsx              # Email configuration
```

### Authentication Middleware

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check authentication
    // Redirect to login if not authenticated
  }
}
```

### Database Queries

Use Prisma for all database operations:
- Type-safe queries
- Efficient pagination
- Proper filtering
- Relationship handling

