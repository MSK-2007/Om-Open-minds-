import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout, AdminLayout } from '@/layouts';
import {
  HomePage,
  AboutPage,
  ProgrammesPage,
  OurApproachPage,
  FacilitiesPage,
  OurTeamPage,
  ActivitiesPage,
  GalleryPage,
  AdmissionsPage,
  ParentResourcesPage,
  ContactPage,
  NotFoundPage,
} from '@/pages/public';
import { AdminLoginPage, AdminDashboardPage } from '@/pages/admin';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from '@/config/constants';

export const router = createBrowserRouter([
  // Public Routes
  {
    path: ROUTES.PUBLIC.HOME,
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'programmes',
        element: <ProgrammesPage />,
      },
      {
        path: 'our-approach',
        element: <OurApproachPage />,
      },
      {
        path: 'facilities',
        element: <FacilitiesPage />,
      },
      {
        path: 'our-team',
        element: <OurTeamPage />,
      },
      {
        path: 'activities',
        element: <ActivitiesPage />,
      },
      {
        path: 'gallery',
        element: <GalleryPage />,
      },
      {
        path: 'admissions',
        element: <AdmissionsPage />,
      },
      {
        path: 'parent-resources',
        element: <ParentResourcesPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },

  // Administrative Public Route (Login)
  {
    path: ROUTES.ADMIN.LOGIN,
    element: <AdminLoginPage />,
  },

  // Administrative Protected Routes
  {
    path: ROUTES.ADMIN.ROOT,
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />,
          },
          {
            path: 'dashboard',
            element: <AdminDashboardPage />,
          },
        ],
      },
    ],
  },
]);
