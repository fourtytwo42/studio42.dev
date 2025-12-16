# AI Microlearning LMS - User Experience Flows

**Detailed user journeys, UI states, error recovery, and interaction patterns for learners and administrators.**

## Table of Contents

1. [Learner Flows](#learner-flows)
2. [Admin Flows](#admin-flows)
3. [UI Component Specifications](#ui-component-specifications)
4. [Error States & Recovery](#error-states--recovery)
5. [Loading States](#loading-states)
6. [Accessibility Considerations](#accessibility-considerations)
7. [Mobile Considerations](#mobile-considerations)

## Learner Flows

### Flow 1: First-Time Learner Onboarding

**Goal:** New learner creates account and starts first learning session

**Steps:**
1. **Landing Page**
   - Welcome message
   - "Get Started" button
   - Demo video (optional)

2. **Registration**
   - Email/password form
   - Organization selection (if multiple)
   - Terms acceptance
   - Submit → Create account

3. **Profile Setup**
   - Interests selection (multi-select)
   - Learning goals (text input)
   - Learning style preference (visual/auditory/kinesthetic/reading)
   - Preferred difficulty (beginner/intermediate/advanced)
   - Submit → Create learner profile

4. **Dashboard**
   - Welcome message with name
   - "Start Learning" button
   - Recent sessions (empty initially)
   - Progress overview (empty initially)

5. **First Session Creation**
   - Click "Start Learning"
   - Mode selection (text/voice) - default: text
   - Click "Begin Session"
   - Session created, redirect to session page

6. **First Learning Interaction**
   - AI tutor greeting: "Hi [Name]! I'm your AI tutor. What would you like to learn about today?"
   - Learner types response
   - AI processes and delivers first nugget
   - Narrative choices appear

**UI States:**
- **Loading:** Show skeleton loader during session creation
- **Error:** Show error message, allow retry
- **Success:** Smooth transition to session page

### Flow 2: Returning Learner Session

**Goal:** Learner continues learning from where they left off

**Steps:**
1. **Login**
   - Email/password
   - "Remember me" option
   - Submit → Authenticate

2. **Dashboard**
   - Active sessions list
   - "Continue Learning" button for active sessions
   - "Start New Session" button
   - Progress summary (mastery levels, knowledge gaps)

3. **Resume Session**
   - Click "Continue Learning" on active session
   - Load session state (current node, conversation history)
   - Display last message
   - Ready for interaction

4. **Continue Learning**
   - Learner sends message or makes choice
   - AI responds with next content
   - Progress updates in real-time

**UI States:**
- **Session Loading:** Show conversation history loading
- **History Loaded:** Display messages with smooth scroll to bottom
- **Error:** Show error, allow retry or start new session

### Flow 3: Narrative Choice Flow

**Goal:** Learner makes choice in choose-your-own-adventure narrative

**Steps:**
1. **Narrative Node Display**
   - Nugget content displayed
   - Image shown (if available)
   - Audio plays (if available and enabled)
   - Choices displayed as buttons/cards

2. **Choice Selection**
   - Learner clicks choice
   - Choice highlighted (visual feedback)
   - Loading state (choice processing)

3. **Next Node Loading**
   - Show loading indicator
   - Display "Adapting your learning path..." message
   - Load next narrative node

4. **Next Node Display**
   - New nugget content
   - New choices
   - Progress updated (if mastery changed)

**UI States:**
- **Choices Available:** All choices clickable, hover effects
- **Choice Selected:** Selected choice highlighted, others disabled
- **Loading:** Show spinner, disable interactions
- **Error:** Show error message, allow retry

### Flow 4: Voice Mode Interaction

**Goal:** Learner uses voice input/output for learning

**Steps:**
1. **Enable Voice Mode**
   - Toggle voice mode in session
   - Microphone permission request (if needed)
   - Voice quality selection (low/mid/high)

2. **Voice Input**
   - Click microphone button
   - Visual indicator (waveform animation)
   - Speak message
   - Click stop or auto-stop after silence

3. **Processing**
   - Show "Listening..." indicator
   - Transcribe audio
   - Display transcribed text
   - Send to AI tutor

4. **Voice Output**
   - AI response received
   - Text displayed
   - Audio playback starts automatically
   - Playback controls (play/pause/speed)

**UI States:**
- **Idle:** Microphone button ready
- **Recording:** Red recording indicator, waveform animation
- **Processing:** "Transcribing..." message
- **Playing:** Audio controls visible, progress bar
- **Error:** Error message, fallback to text

### Flow 5: Progress Review

**Goal:** Learner reviews their learning progress

**Steps:**
1. **Navigate to Progress**
   - Click "My Progress" in navigation
   - Load progress data

2. **Progress Dashboard**
   - Mastery map visualization
   - Knowledge gaps list
   - Learning statistics (sessions, time spent, nuggets viewed)
   - Recent achievements

3. **Detailed View**
   - Click on concept → Detailed mastery info
   - Evidence of mastery updates
   - Related nuggets
   - Recommended next steps

**UI States:**
- **Loading:** Skeleton loaders for each section
- **Loaded:** Smooth data display
- **Empty:** Friendly empty state message

## Admin Flows

### Flow 1: Content Ingestion Setup

**Goal:** Admin sets up automatic content ingestion

**Steps:**
1. **Navigate to Ingestion**
   - Click "Content Ingestion" in admin menu
   - View current watched folders and URLs

2. **Add Watched Folder**
   - Click "Add Folder"
   - Enter folder path
   - Select file types (PDF, DOCX, TXT)
   - Enable recursive (optional)
   - Enable auto-process (optional)
   - Save

3. **Add Monitored URL**
   - Click "Add URL"
   - Enter URL
   - Set check interval (minutes)
   - Save

4. **Verify Setup**
   - Folder/URL appears in list
   - Status shows "Watching" or "Monitoring"
   - Test with sample file/URL

**UI States:**
- **Form:** Validation on input, clear error messages
- **Saving:** Loading state, disable submit
- **Success:** Success message, update list
- **Error:** Error message, allow retry

### Flow 2: Monitor Ingestion Jobs

**Goal:** Admin monitors content processing jobs

**Steps:**
1. **View Jobs List**
   - Navigate to "Ingestion Jobs"
   - See list of jobs (pending, processing, completed, failed)
   - Filter by status, type, date

2. **Job Details**
   - Click on job → View details
   - See source file/URL
   - See processing status
   - See nugget count (if completed)
   - See error message (if failed)

3. **Job Actions**
   - Retry failed job
   - Cancel pending job
   - View generated nuggets

**UI States:**
- **List Loading:** Skeleton table rows
- **Real-time Updates:** WebSocket updates for job status
- **Job Details:** Expandable row or modal
- **Error:** Clear error display with retry option

### Flow 3: Nugget Management

**Goal:** Admin manages learning nuggets

**Steps:**
1. **Browse Nuggets**
   - Navigate to "Nugget Store"
   - See list of nuggets (paginated)
   - Filter by status, search by content
   - Sort by date, status, etc.

2. **View Nugget**
   - Click on nugget → View details
   - See full content
   - See metadata (topics, difficulty, etc.)
   - See multimedia (image, audio)
   - See source information

3. **Edit Nugget**
   - Click "Edit"
   - Modify content
   - Update metadata
   - Save changes

4. **Regenerate Nugget**
   - Click "Regenerate"
   - Select what to regenerate (image, audio, content)
   - Confirm action
   - Job queued, monitor progress

**UI States:**
- **List:** Pagination, filters, search
- **Details:** Modal or separate page
- **Editing:** Inline editing or form
- **Regenerating:** Job status indicator

### Flow 4: System Settings Configuration

**Goal:** Admin configures system settings

**Steps:**
1. **Navigate to Settings**
   - Click "Settings" in admin menu
   - See settings categories (Voice, AI Models, Content Processing)

2. **Configure Voice Settings**
   - Select TTS provider (OpenAI Standard/HD, ElevenLabs)
   - Select STT provider
   - Set quality tier
   - Save

3. **Configure AI Models**
   - Select models for each task type
   - Set temperature parameters
   - Save

4. **Configure Content Processing**
   - Set chunking parameters
   - Set image generation settings
   - Save

**UI States:**
- **Form:** Clear labels, tooltips for settings
- **Saving:** Loading state, disable submit
- **Success:** Success message
- **Validation:** Real-time validation, clear errors

### Flow 5: Analytics Review

**Goal:** Admin reviews system analytics

**Steps:**
1. **Navigate to Analytics**
   - Click "Analytics" in admin menu
   - See analytics dashboard

2. **View Metrics**
   - Learner metrics (total, active, new)
   - Session metrics (total, average duration, completion rate)
   - Content metrics (nuggets, by status)
   - Engagement metrics
   - Cost metrics

3. **Filter & Export**
   - Filter by date range
   - Filter by organization (if multi-tenant)
   - Export data (CSV, PDF)

**UI States:**
- **Dashboard:** Charts, graphs, tables
- **Loading:** Skeleton loaders
- **Empty:** Friendly empty state
- **Export:** Download button, progress indicator

## UI Component Specifications

### Learner Canvas Component

**Purpose:** Main learning interface for learners

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Header: Logo, User Menu, Progress Indicator    │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  │
│  │                  │  │  Progress Panel  │  │
│  │                  │  │  (Collapsible)   │  │
│  │   Chat Area      │  │                  │  │
│  │                  │  │  - Mastery Map   │  │
│  │   (Messages)     │  │  - Knowledge     │  │
│  │                  │  │    Gaps         │  │
│  │                  │  │  - Statistics   │  │
│  │                  │  │                  │  │
│  └──────────────────┘  └──────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Input Area: Text Input + Voice Button   │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Features:**
- Full-screen chat interface
- Collapsible progress panel
- Media widgets (images, audio) inline
- Narrative choices as cards/buttons
- Voice controls (mic button, audio player)
- Real-time updates via WebSocket

### Admin Dashboard Component

**Purpose:** Overview dashboard for administrators

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Header: Logo, Admin Menu, User Menu            │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Learners │  │ Sessions │  │ Nuggets  │     │
│  │   100    │  │    50    │  │  1,000   │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Recent Activity                         │  │
│  │  - Job completed: file.pdf               │  │
│  │  - New learner registered                │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Cost Overview (This Month)              │  │
│  │  Total: $150.50                          │  │
│  │  AI: $100.00 | Voice: $45.50 | Images: $5│ │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Features:**
- Key metrics cards
- Recent activity feed
- Cost overview
- Quick actions
- Real-time updates

## Error States & Recovery

### Error Types

1. **Network Errors**
   - **Display:** "Connection lost. Reconnecting..."
   - **Recovery:** Auto-retry with exponential backoff
   - **User Action:** Manual retry button

2. **API Errors**
   - **Display:** "Something went wrong. Please try again."
   - **Recovery:** Show error details, allow retry
   - **User Action:** Retry button, contact support

3. **Session Errors**
   - **Display:** "Session error. Starting new session..."
   - **Recovery:** Auto-create new session, preserve progress
   - **User Action:** Confirm new session

4. **Content Errors**
   - **Display:** "Content unavailable. Loading alternative..."
   - **Recovery:** Load alternative content or skip
   - **User Action:** Skip button, report issue

5. **Voice Errors**
   - **Display:** "Voice unavailable. Switching to text..."
   - **Recovery:** Auto-fallback to text mode
   - **User Action:** Continue with text, retry voice

### Error Recovery Patterns

**Auto-Retry:**
- Network errors: 3 retries with exponential backoff
- API errors: 1 retry, then show error
- Session errors: Auto-recover when possible

**User-Initiated Recovery:**
- Retry button for failed operations
- Refresh button for stale data
- Report issue button for persistent errors

**Graceful Degradation:**
- Voice → Text fallback
- Image → Text-only display
- Audio → Text transcript

## Loading States

### Loading Indicators

1. **Skeleton Loaders**
   - Use for initial page loads
   - Match content structure
   - Animated shimmer effect

2. **Spinners**
   - Use for short operations (< 2 seconds)
   - Centered or inline
   - Size appropriate to context

3. **Progress Bars**
   - Use for long operations (> 2 seconds)
   - Show percentage when available
   - Cancel button for cancellable operations

4. **Skeleton Messages**
   - Use for chat message loading
   - Match message structure
   - Animated placeholder

### Loading State Guidelines

- **Always show loading state** for async operations
- **Provide context** (what's loading)
- **Estimate time** when possible
- **Allow cancellation** for long operations
- **Optimistic updates** when appropriate

## Accessibility Considerations

### Keyboard Navigation

- **Tab order:** Logical flow through interactive elements
- **Focus indicators:** Clear visual focus
- **Keyboard shortcuts:** Common actions (Enter to send, Esc to close)
- **Skip links:** Skip to main content

### Screen Reader Support

- **ARIA labels:** All interactive elements
- **ARIA roles:** Semantic roles (button, dialog, etc.)
- **Live regions:** Announce dynamic updates
- **Alt text:** All images and media

### Visual Accessibility

- **Color contrast:** WCAG 2.1 AA minimum
- **Text size:** Minimum 16px, scalable
- **Focus indicators:** High contrast
- **Color blind friendly:** Don't rely on color alone

### Motor Accessibility

- **Large touch targets:** Minimum 44x44px
- **Spacing:** Adequate spacing between elements
- **No time limits:** No forced time limits
- **Customizable:** Allow input method customization

## Mobile Considerations

### Responsive Design

- **Breakpoints:**
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Mobile-Specific Features

- **Touch gestures:** Swipe, pinch, etc.
- **Mobile navigation:** Hamburger menu, bottom nav
- **Touch targets:** Larger on mobile
- **Viewport optimization:** Proper viewport meta tag

### Performance

- **Lazy loading:** Load content as needed
- **Image optimization:** Responsive images, WebP
- **Code splitting:** Load only needed code
- **Caching:** Cache static assets

### Mobile UX Patterns

- **Bottom sheet:** For choices and actions
- **Pull to refresh:** Refresh content
- **Infinite scroll:** For lists
- **Sticky headers:** Keep navigation accessible

---

This UX flows document provides detailed user journeys and UI specifications. Use this as a reference when implementing the frontend components.

