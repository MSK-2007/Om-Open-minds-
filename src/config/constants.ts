/**
 * Application constants, route definitions, and structural configuration.
 */

export const APP_CONFIG = {
  name: 'OM OPEN MINDS',
  tagline: 'Specialized School for Children with Diverse Learning Needs',
  contactEmail: '', // Will be supplied with real client content
} as const;

export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    ABOUT: '/about',
    PROGRAMMES: '/programmes',
    OUR_APPROACH: '/our-approach',
    FACILITIES: '/facilities',
    OUR_TEAM: '/our-team',
    ACTIVITIES: '/activities',
    GALLERY: '/gallery',
    ADMISSIONS: '/admissions',
    PARENT_RESOURCES: '/parent-resources',
    CONTACT: '/contact',
  },
  ADMIN: {
    ROOT: '/admin',
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    ADMISSIONS: '/admin/admissions',
    CONTACT: '/admin/contact',
    PROGRAMMES: '/admin/programmes',
    FACILITIES: '/admin/facilities',
    TEAM: '/admin/team',
    ACTIVITIES: '/admin/activities',
    ANNOUNCEMENTS: '/admin/announcements',
    GALLERY: '/admin/gallery',
    RESOURCES: '/admin/resources',
    SETTINGS: '/admin/settings',
  },
} as const;

export const ACCESSIBILITY = {
  SKIP_CONTENT_ID: 'main-content',
  LIVE_ANNOUNCER_ID: 'a11y-live-announcer',
} as const;
