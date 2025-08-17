# Settings & Onboarding Implementation

This document describes the comprehensive Settings tab and Multi-step Onboarding form implementation for SnapFuse.

## 🎯 Features Implemented

### Settings Tab (`/dashboard/settings`)

A comprehensive settings interface with 6 main sections:

#### 1. **Profile Settings**
- Personal information management
- Avatar upload functionality
- Bio, website, and location fields
- Integration with Clerk user management

#### 2. **Preferences Settings**
- Default generation settings (image style, size, video length)
- Quality preferences (speed vs quality)
- Creativity level slider
- Content safety settings (NSFW filter, content moderation)
- Auto-save and watermark options

#### 3. **Billing Settings**
- Current subscription plan display
- Credits overview with progress bar
- Credit top-up options
- Payment method management
- Billing history with downloadable invoices

#### 4. **Notification Settings**
- Multiple notification channels (email, browser, SMS)
- Granular notification type controls
- Frequency settings
- Low credit threshold configuration

#### 5. **Security Settings**
- Password change functionality
- Two-factor authentication setup
- Active session management
- Privacy controls (data collection, analytics)
- Account data export and deletion

#### 6. **API Settings**
- API key generation and management
- Usage statistics and monitoring
- Webhook configuration
- CORS settings
- API documentation links

### Multi-Step Onboarding (`/onboarding`)

A comprehensive 5-step onboarding flow:

#### Step 1: **Welcome**
- Introduction to SnapFuse features
- Overview of AI image and video generation
- Sets expectations for the onboarding process

#### Step 2: **Personal Information**
- Name, company, role collection
- Industry and team size selection
- Helps personalize the experience

#### Step 3: **Preferences & Use Cases**
- Primary use case selection (marketing, e-commerce, etc.)
- Goals and objectives (multiple selection)
- Experience level assessment
- Content type preferences
- Quality vs speed preference

#### Step 4: **Plan Selection**
- Visual plan comparison
- Credit system explanation
- Free plan option with no commitment
- Integration with pricing system

#### Step 5: **Completion**
- Summary of selected preferences
- Communication preferences setup
- Welcome message and next steps

## 🏗️ Technical Implementation

### Database Schema Updates

Extended the Convex `users` table with new fields:

```typescript
// Onboarding and preferences
onboardingCompleted: v.optional(v.boolean()),
company: v.optional(v.string()),
role: v.optional(v.string()),
industry: v.optional(v.string()),
teamSize: v.optional(v.string()),
primaryUseCase: v.optional(v.string()),
goals: v.optional(v.array(v.string())),
experienceLevel: v.optional(v.string()),
contentTypes: v.optional(v.array(v.string())),
qualityPreference: v.optional(v.string()),

// Generation preferences
defaultImageStyle: v.optional(v.string()),
defaultImageSize: v.optional(v.string()),
defaultVideoLength: v.optional(v.string()),
defaultVideoStyle: v.optional(v.string()),
creativityLevel: v.optional(v.number()),
autoSaveGenerations: v.optional(v.boolean()),
showWatermark: v.optional(v.boolean()),
nsfwFilter: v.optional(v.boolean()),
contentModeration: v.optional(v.boolean()),

// Notification preferences
emailNotifications: v.optional(v.boolean()),
pushNotifications: v.optional(v.boolean()),
smsNotifications: v.optional(v.boolean()),
generationComplete: v.optional(v.boolean()),
creditLowWarning: v.optional(v.boolean()),
subscriptionUpdates: v.optional(v.boolean()),
marketingEmails: v.optional(v.boolean()),
securityAlerts: v.optional(v.boolean()),
weeklyDigest: v.optional(v.boolean()),
creditThreshold: v.optional(v.number()),
notificationFrequency: v.optional(v.string()),
```

### Convex Functions

Created `convex/userPreferences.ts` with:

- `updateUserPreferences` - Update user preference settings
- `getUserPreferences` - Retrieve user preferences with defaults
- `completeOnboarding` - Mark onboarding as complete and save data
- `checkOnboardingStatus` - Check if user needs onboarding

### UI Components

#### New UI Components Created:
- `Avatar` - User avatar display
- `Select` - Dropdown selection component
- `Switch` - Toggle switch component
- `Slider` - Range slider component
- `Checkbox` - Checkbox input component

#### Settings Components:
- `ProfileSettings` - Profile management
- `PreferencesSettings` - Generation preferences
- `BillingSettings` - Subscription and billing
- `NotificationSettings` - Notification preferences
- `SecuritySettings` - Security and privacy
- `ApiSettings` - API management

#### Onboarding Components:
- `MultiStepOnboarding` - Main onboarding container
- `WelcomeStep` - Introduction step
- `PersonalInfoStep` - Personal information collection
- `PreferencesStep` - Use case and preferences
- `PlanSelectionStep` - Plan selection
- `CompletionStep` - Final step with summary

## 🎨 Design Features

### Visual Design
- Consistent with existing SnapFuse design system
- Responsive layout for all screen sizes
- Progress indicators for multi-step flows
- Clear visual hierarchy and spacing
- Accessible color contrast and focus states

### User Experience
- Form validation with helpful error messages
- Auto-save functionality where appropriate
- Skip options for non-essential steps
- Clear navigation between steps
- Loading states and success feedback

### Accessibility
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management in multi-step flows

## 🔧 Integration Points

### Clerk Authentication
- Profile updates sync with Clerk user data
- Metadata storage for preferences
- Avatar management through Clerk

### Stripe Billing
- Plan selection integration
- Payment flow redirection
- Billing history display

### Convex Database
- User preference storage
- Onboarding status tracking
- Settings persistence

## 🚀 Usage

### Settings Access
Users can access settings via:
```
/dashboard/settings
```

### Onboarding Flow
New users are directed to:
```
/onboarding
```

### Programmatic Access
```typescript
// Check onboarding status
const status = await checkOnboardingStatus({ userId });

// Update preferences
await updateUserPreferences({ 
  userId, 
  preferences: { defaultImageStyle: "artistic" } 
});

// Get user preferences
const prefs = await getUserPreferences({ userId });
```

## 🔮 Future Enhancements

### Planned Features
1. **Advanced API Management**
   - Rate limiting configuration
   - Custom webhook events
   - API analytics dashboard

2. **Enhanced Security**
   - Two-factor authentication implementation
   - Session management improvements
   - Security audit logs

3. **Smart Recommendations**
   - AI-powered preference suggestions
   - Usage-based optimization tips
   - Personalized onboarding paths

4. **Team Management**
   - Organization settings
   - Team member invitations
   - Role-based permissions

5. **Advanced Notifications**
   - Push notification implementation
   - SMS integration
   - Custom notification rules

## 📝 Notes

- All forms include proper validation and error handling
- Settings are persisted immediately upon change
- Onboarding can be skipped but is encouraged for better UX
- All components are fully typed with TypeScript
- Responsive design works on mobile, tablet, and desktop
- Integration with existing pricing and billing systems

This implementation provides a solid foundation for user management and can be easily extended with additional features as needed.