# Design Document

## Overview

The domain navigation fix addresses URL synchronization and page refresh issues when users switch between domains. The solution involves improving the React Router integration, enhancing the domain switching logic, and ensuring proper cache management during domain transitions.

## Architecture

The fix involves three main architectural components:

1. **URL Management Layer**: Enhanced React Router integration with proper navigation and URL updates
2. **Domain State Management**: Improved domain switching logic with proper state synchronization
3. **Data Cache Management**: Enhanced cache invalidation and data refresh mechanisms

## Components and Interfaces

### Enhanced App Component (`src/App.jsx`)

**Current Issues:**
- Domain switching doesn't immediately update the URL
- Navigation state isn't properly synchronized with URL parameters
- Cache clearing happens but URL doesn't reflect the change immediately

**Design Changes:**
- Use `useNavigate` hook to programmatically navigate to new domain URLs
- Implement immediate URL updates when domain is selected
- Ensure proper route parameter synchronization

**Key Methods:**
```javascript
const handleDomainSelect = async (domainKey) => {
  // 1. Set loading state
  // 2. Clear cache for previous domain
  // 3. Navigate to new domain URL immediately
  // 4. Update selected domain state
  // 5. Clear loading state
}
```

### Enhanced Navbar Component (`src/components/Navbar.jsx`)

**Current Issues:**
- Menu items use relative paths that may not update correctly after domain switches
- Active state detection might not work properly with new domain URLs

**Design Changes:**
- Ensure all navigation links use absolute paths with current domain parameter
- Improve active state detection to work with domain-specific URLs
- Add proper key prop to force re-render when domain changes

### Page Components Enhancement

**Current Issues:**
- Pages might not re-render properly when domain parameter changes
- useParams might not trigger re-renders in all cases

**Design Changes:**
- Add useEffect hooks that depend on domainKey parameter
- Implement proper cleanup when domain changes
- Ensure data fetching is triggered when domain parameter changes

## Data Models

### Domain Navigation State
```javascript
{
  selectedDomain: string,        // Current domain key
  isDomainChanging: boolean,     // Loading state during domain switch
  previousDomain: string | null, // For cleanup purposes
  navigationHistory: Array       // For browser navigation support
}
```

### Cache Management
```javascript
{
  cacheKey: `${domainKey}_${dataType}`,
  invalidationPattern: domainKey,
  refreshTrigger: domainKey change
}
```

## Error Handling

### Navigation Errors
- Handle cases where domain parameter is invalid
- Redirect to default domain if current domain doesn't exist
- Show error states for failed domain switches

### Cache Management Errors
- Handle failed cache invalidation gracefully
- Provide fallback data loading mechanisms
- Show appropriate loading states during cache operations

### URL Synchronization Errors
- Handle browser navigation edge cases
- Ensure URL always reflects current application state
- Provide recovery mechanisms for URL/state mismatches

## Testing Strategy

### Unit Tests
- Test domain switching logic in isolation
- Test URL generation and navigation functions
- Test cache invalidation patterns

### Integration Tests
- Test complete domain switching flow
- Test browser navigation (back/forward) behavior
- Test URL synchronization across different scenarios

### User Acceptance Tests
- Test domain switching from user perspective
- Test menu navigation after domain switches
- Test browser refresh behavior with domain URLs
- Test bookmark and URL sharing functionality

## Implementation Approach

### Phase 1: URL Management Enhancement
1. Add `useNavigate` hook to App component
2. Implement immediate URL updates in domain selection
3. Ensure proper route parameter handling

### Phase 2: Component Re-rendering
1. Add proper dependency arrays to useEffect hooks
2. Implement component keys for forced re-renders
3. Enhance active state detection in navigation

### Phase 3: Cache and Data Management
1. Improve cache invalidation timing
2. Add proper loading states during domain switches
3. Ensure data consistency across domain changes

### Phase 4: Browser Navigation Support
1. Test and fix browser back/forward button behavior
2. Ensure URL bookmarking works correctly
3. Handle edge cases in browser navigation

## Key Design Decisions

### Immediate URL Updates
**Decision**: Update URL immediately when domain is selected, before data loading completes
**Rationale**: Provides immediate user feedback and ensures URL always reflects user intent

### Cache Invalidation Strategy
**Decision**: Clear cache for previous domain and new domain during switch
**Rationale**: Ensures fresh data loading and prevents stale data display

### Component Re-rendering Strategy
**Decision**: Use React keys and proper dependency arrays to force re-renders
**Rationale**: Ensures components properly update when domain parameters change

### Navigation State Management
**Decision**: Keep domain state in App component and pass down as props
**Rationale**: Centralized state management for domain-related navigation