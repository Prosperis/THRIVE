# Accessibility Testing Checklist

## Keyboard Navigation

### Global Navigation
- [ ] Tab key moves focus through all interactive elements in logical order
- [ ] Shift + Tab moves focus backwards
- [ ] Focus indicator is clearly visible on all elements
- [ ] Skip navigation links work (Tab on page load)
- [ ] No keyboard traps (can always escape with Tab/Escape)

### Specific Components
- [ ] **Header Navigation**
  - [ ] All nav links are keyboard accessible
  - [ ] Active page is indicated to screen readers
  - [ ] Mobile menu can be opened/closed with keyboard

- [ ] **Dashboard**
  - [ ] All stat cards are readable
  - [ ] Chart navigation works with keyboard
  - [ ] Quick actions are keyboard accessible

- [ ] **Applications Page**
  - [ ] Kanban columns are keyboard navigable
  - [ ] Cards can be moved with keyboard (if drag-drop implemented)
  - [ ] Add application button is accessible
  - [ ] Filters are keyboard operable

- [ ] **Forms (Add/Edit Application)**
  - [ ] All form fields are reachable with Tab
  - [ ] Required fields are indicated
  - [ ] Error messages are announced
  - [ ] Form submission works with Enter key
  - [ ] Cancel/close works with Escape key

- [ ] **Dialogs/Modals**
  - [ ] Focus is trapped within dialog
  - [ ] Escape key closes dialog
  - [ ] Focus returns to trigger element on close
  - [ ] First focusable element receives focus on open

- [ ] **Data Tables**
  - [ ] Column headers are properly associated
  - [ ] Sort controls are keyboard accessible
  - [ ] Pagination controls work with keyboard
  - [ ] Row actions are accessible

- [ ] **Command Palette (Cmd+K)**
  - [ ] Opens with keyboard shortcut
  - [ ] Search is focusable
  - [ ] Arrow keys navigate results
  - [ ] Enter selects item
  - [ ] Escape closes palette

## Screen Reader Support

### Semantic HTML
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Landmarks are used (`<main>`, `<nav>`, `<header>`)
- [ ] Lists use `<ul>`/`<ol>` and `<li>` tags
- [ ] Buttons use `<button>`, not styled `<div>`
- [ ] Links use `<a>` with href
- [ ] Form controls have associated `<label>`

### ARIA Labels
- [ ] All icons have appropriate labels or are marked `aria-hidden`
- [ ] Custom components have proper roles
- [ ] Status badges have descriptive labels
- [ ] Interactive elements have meaningful names
- [ ] Loading states are announced
- [ ] Error states are announced
- [ ] Success messages are announced

### Dynamic Content
- [ ] Live regions announce updates (aria-live)
- [ ] Page title updates on navigation
- [ ] Form validation errors are announced
- [ ] Loading states are communicated
- [ ] Toast notifications are accessible

### Images & Icons
- [ ] Decorative images have `alt=""` or `aria-hidden`
- [ ] Meaningful images have descriptive alt text
- [ ] Icon-only buttons have labels
- [ ] Logo has appropriate alt text

## Visual Design

### Color Contrast (WCAG AA)
- [ ] Text has minimum 4.5:1 contrast ratio
- [ ] Large text (18pt+) has 3:1 ratio
- [ ] Interactive elements have sufficient contrast
- [ ] Focus indicators meet contrast requirements
- [ ] Icons and graphics have 3:1 contrast

### Color Independence
- [ ] Information not conveyed by color alone
- [ ] Status is indicated with icons + text
- [ ] Links are distinguishable without color
- [ ] Error states have icons + text
- [ ] Charts have patterns or labels

### Typography
- [ ] Font size is at least 16px for body text
- [ ] Line height is at least 1.5
- [ ] Text can be resized to 200% without loss
- [ ] Paragraphs have adequate spacing
- [ ] Reading width is comfortable (60-80 characters)

### Focus Indicators
- [ ] All interactive elements have visible focus
- [ ] Focus indicator has 3:1 contrast
- [ ] Focus is not hidden by other elements
- [ ] Focus order is logical
- [ ] Custom focus styles are clear

## Forms & Validation

### Labels
- [ ] All inputs have associated labels
- [ ] Label text is clear and descriptive
- [ ] Required fields are marked
- [ ] Optional fields are indicated
- [ ] Placeholder text is not used as labels

### Error Handling
- [ ] Errors are clearly identified
- [ ] Error messages are specific and helpful
- [ ] Errors are associated with fields (aria-describedby)
- [ ] Error summary is provided for multiple errors
- [ ] Successful submission is confirmed

### Input Types
- [ ] Correct input types used (email, tel, date)
- [ ] Autocomplete attributes added where appropriate
- [ ] Input constraints are communicated
- [ ] Format requirements are explained

## Responsive & Mobile

### Touch Targets
- [ ] Interactive elements are at least 44x44px
- [ ] Adequate spacing between touch targets
- [ ] Swipe gestures have keyboard alternatives

### Responsive Behavior
- [ ] Works at 320px viewport width
- [ ] Works at 200% zoom
- [ ] Content reflows properly
- [ ] No horizontal scrolling required
- [ ] Touch-friendly on mobile devices

## Testing Tools

### Automated Testing
- [ ] axe DevTools (Chrome extension)
- [ ] Lighthouse accessibility audit
- [ ] WAVE (Web Accessibility Evaluation Tool)
- [ ] Pa11y CI in build pipeline

### Manual Testing
- [ ] Keyboard-only navigation
- [ ] Screen reader testing (NVDA/JAWS/VoiceOver)
- [ ] Zoom to 200%
- [ ] High contrast mode
- [ ] Color blindness simulation

### Screen Readers to Test
- [ ] NVDA (Windows) with Firefox/Chrome
- [ ] JAWS (Windows) with Chrome
- [ ] VoiceOver (macOS) with Safari
- [ ] TalkBack (Android) with Chrome
- [ ] VoiceOver (iOS) with Safari

## Component-Specific

### Empty States
- [ ] Clear message about why content is empty
- [ ] Actionable next steps are provided
- [ ] Screen reader announces empty state

### Loading States
- [ ] Loading indicator has proper ARIA attributes
- [ ] Screen reader announces loading
- [ ] Skeleton loaders don't interfere with screen readers

### Error States
- [ ] Error icon and text are associated
- [ ] Retry action is keyboard accessible
- [ ] Error is announced to screen readers

### Data Visualizations
- [ ] Charts have text alternatives
- [ ] Data is available in table format
- [ ] Chart legends are accessible
- [ ] Interactive elements are keyboard accessible

### Command Palette
- [ ] Opens with keyboard shortcut
- [ ] Search results are announced
- [ ] Categories are properly labeled
- [ ] Navigation shortcuts are documented

## Content

### Page Titles
- [ ] Each page has unique, descriptive title
- [ ] Title format is consistent
- [ ] Title reflects current page content

### Headings
- [ ] Logical heading structure
- [ ] No heading levels skipped
- [ ] Headings describe content sections
- [ ] Page has only one h1

### Links
- [ ] Link text is descriptive ("Learn more" → "Learn more about applications")
- [ ] Links to external sites are indicated
- [ ] Links opening in new tabs are announced
- [ ] Empty links are fixed

## Motion & Animation

### Reduced Motion
- [ ] `prefers-reduced-motion` is respected
- [ ] Animations can be disabled
- [ ] Essential motion is minimal
- [ ] No auto-playing animations longer than 5 seconds

### Transitions
- [ ] Transitions are not too fast (<3 seconds)
- [ ] Parallax effects respect motion preferences
- [ ] Page transitions are smooth but not distracting

## Browser & Platform Support

### Browsers to Test
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome (Android)

### Screen Sizes
- [ ] 320px (small mobile)
- [ ] 768px (tablet)
- [ ] 1024px (small desktop)
- [ ] 1920px (large desktop)

## Documentation

- [ ] Accessibility statement on website
- [ ] Keyboard shortcuts documented
- [ ] Known issues documented
- [ ] Conformance level stated (WCAG 2.1 Level AA)
- [ ] Contact for accessibility feedback

## Priority Fixes

### Critical (Must Fix)
- Keyboard traps
- Missing form labels
- Insufficient color contrast
- Missing alt text on meaningful images
- Broken skip navigation

### High Priority
- Incorrect heading hierarchy
- Missing ARIA labels on icons
- Poor focus indicators
- Unlabeled form errors
- Missing live regions for dynamic content

### Medium Priority
- Verbose screen reader announcements
- Redundant ARIA attributes
- Minor contrast issues
- Missing landmarks

### Low Priority
- Optimization of ARIA usage
- Enhanced keyboard shortcuts
- Additional context for complex UIs

## Sign-Off

- [ ] Automated tests pass
- [ ] Manual keyboard test complete
- [ ] Screen reader test complete
- [ ] WCAG 2.1 Level AA compliance verified
- [ ] Accessibility documentation updated
