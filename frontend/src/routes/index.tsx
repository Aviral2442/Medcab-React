import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router";
import MainLayout from "@/layouts/MainLayout.tsx";
import ProtectedRoute from "@/routes/components/ProtectedRoute";

// Dashboards
const Dashboard = lazy(() => import("@/views/dashboard"));

// AI
const TonAI = lazy(() => import("@/views/ai/ton-ai"));

// Apps
const Calendar = lazy(() => import("@/views/apps/calendar"));
const Directory = lazy(() => import("@/views/apps/directory"));

// Pages
const EmptyPage = lazy(() => import("@/views/pages/empty"));
const Invoice = lazy(() => import("@/views/pages/invoice"));
const Pricing = lazy(() => import("@/views/pages/pricing"));
const TermsConditions = lazy(() => import("@/views/pages/terms-conditions"));
const Timeline = lazy(() => import("@/views/pages/timeline"));
const Manpower = lazy(() => import("@/views/pages/manpower"));
const Booking = lazy(() => import("@/views/pages/booking"));
const BookingDetails = lazy(() => import("@/views/pages/booking/bookingDetails"));
const VendorList = lazy(() => import('@/views/pages/vendorlist'))
const ConsumerList = lazy(() => import('@/views/pages/consumer'))
const VendorDetails = lazy(() => import('@/views/pages/vendorlist/vendorDetails'))
const ConsumerDetails = lazy(() => import('@/views/pages/consumer/consumerDetails'))

// Auth
const AuthSignIn = lazy(() => import("@/views/auth/sign-in"));
const AuthSignUp = lazy(() => import("@/views/auth/sign-up"));
// const AuthResetPassword = lazy(() => import("@/views/auth/reset-password"));
// const AuthNewPassword = lazy(() => import("@/views/auth/new-password"));
// const AuthLockScreen = lazy(() => import("@/views/auth/lock-screen"));
// const AuthTwoFactor = lazy(() => import("@/views/auth/two-factor"));

// Error
const Error404 = lazy(() => import("@/views/error/404"));

// UI
const CoreElements = lazy(() => import("@/views/ui/core-elements"));
const InteractiveFeatures = lazy(
  () => import("@/views/ui/interactive-features")
);
const MenuLinks = lazy(() => import("@/views/ui/menu-links"));
const Utilities = lazy(() => import("@/views/ui/utilities"));
const VisualFeedback = lazy(() => import("@/views/ui/visual-feedback"));

// Charts
const Charts = lazy(() => import("@/views/charts"));

// Forms
const BasicElements = lazy(() => import("@/views/forms/basic"));
const TextEditors = lazy(() => import("@/views/forms/editors"));
const FileUploads = lazy(() => import("@/views/forms/file-uploads"));
const Plugins = lazy(() => import("@/views/forms/plugins"));
const Validation = lazy(() => import("@/views/forms/validation"));
const Wizard = lazy(() => import("@/views/forms/wizard"));

// Tables
const StaticTables = lazy(() => import("@/views/tables/static"));
const AjaxDataTable = lazy(() => import("@/views/tables/data-tables/ajax"));
const BasicDataTable = lazy(() => import("@/views/tables/data-tables/basic"));
const CheckboxSelectDataTable = lazy(
  () => import("@/views/tables/data-tables/checkbox-select")
);
const ChildRowsDataTable = lazy(
  () => import("@/views/tables/data-tables/child-rows")
);
const ColumnsDataTable = lazy(
  () => import("@/views/tables/data-tables/columns")
);
const DataRenderingDataTable = lazy(
  () => import("@/views/tables/data-tables/data-rendering")
);
const JavaScriptSourceDataTable = lazy(
  () => import("@/views/tables/data-tables/javascript-source")
);
const SelectDataTable = lazy(() => import("@/views/tables/data-tables/select"));

// Icons
const Flags = lazy(() => import("@/views/icons/flags"));
const LucideIcons = lazy(() => import("@/views/icons/lucide"));
const TablerIcons = lazy(() => import("@/views/icons/tabler"));

// Maps
const VectorMap = lazy(() => import("@/views/maps/vector"));
const LeafletMap = lazy(() => import("@/views/maps/leaflet"));

const authRoutes: RouteObject[] = [
  { path: "/auth/sign-in", element: <AuthSignIn /> },
  { path: "/auth/sign-up", element: <AuthSignUp /> },
  // { path: "/auth/reset-password", element: <AuthResetPassword /> },
  // { path: "/auth/new-password", element: <AuthNewPassword /> },
  // { path: "/auth/two-factor", element: <AuthTwoFactor /> },
  // { path: "/auth/lock-screen", element: <AuthLockScreen /> },
];

const errorRoutes: RouteObject[] = [
  { path: "/error/404", element: <Error404 /> },
];

const dashboardRoutes: RouteObject[] = [
  { path: "/dashboard", element: <Dashboard /> },
];

const appsRoutes: RouteObject[] = [
  { path: "/ton-ai", element: <TonAI /> },
  { path: "/calendar", element: <Calendar /> },
  { path: "/directory", element: <Directory /> },
];

const pagesRoutes: RouteObject[] = [
  { path: "/pages/empty", element: <EmptyPage /> },
  { path: "/pages/invoice", element: <Invoice /> },
  { path: "/pages/pricing", element: <Pricing /> },
  { path: "/pages/terms-conditions", element: <TermsConditions /> },
  { path: "/pages/timeline", element: <Timeline /> },
  { path: "/manpower", element: <Manpower /> },
  { path: "/booking-list", element: <Booking/> },
  { path: "/booking-details/:id", element: <BookingDetails/> },
  { path: "/vendor-list", element: <VendorList/>},
  { path: "/consumer-list", element: <ConsumerList/>},
  { path: "/vendor-details/:id", element: <VendorDetails/>},
  { path: "/consumer-details/:id", element: <ConsumerDetails/> }
];

const uiRoutes: RouteObject[] = [
  { path: "/ui/core-elements", element: <CoreElements /> },
  { path: "/ui/interactive-features", element: <InteractiveFeatures /> },
  { path: "/ui/menu-links", element: <MenuLinks /> },
  { path: "/ui/utilities", element: <Utilities /> },
  { path: "/ui/visual-feedback", element: <VisualFeedback /> },
];

const graphRoutes: RouteObject[] = [{ path: "/charts", element: <Charts /> }];

const formRoutes: RouteObject[] = [
  { path: "/forms/basic", element: <BasicElements /> },
  { path: "/forms/editors", element: <TextEditors /> },
  { path: "/forms/file-uploads", element: <FileUploads /> },
  { path: "/forms/plugins", element: <Plugins /> },
  { path: "/forms/validation", element: <Validation /> },
  { path: "/forms/wizard", element: <Wizard /> },
];

const tableRoutes: RouteObject[] = [
  { path: "/tables/static", element: <StaticTables /> },
  { path: "/tables/data-tables/basic", element: <BasicDataTable /> },
  { path: "/tables/data-tables/select", element: <SelectDataTable /> },
  { path: "/tables/data-tables/ajax", element: <AjaxDataTable /> },
  {
    path: "/tables/data-tables/javascript-source",
    element: <JavaScriptSourceDataTable />,
  },
  {
    path: "/tables/data-tables/data-rendering",
    element: <DataRenderingDataTable />,
  },
  { path: "/tables/data-tables/columns", element: <ColumnsDataTable /> },
  { path: "/tables/data-tables/child-rows", element: <ChildRowsDataTable /> },
  {
    path: "/tables/data-tables/checkbox-select",
    element: <CheckboxSelectDataTable />,
  },
];

const iconRoutes: RouteObject[] = [
  { path: "/icons/flags", element: <Flags /> },
  { path: "/icons/lucide", element: <LucideIcons /> },
  { path: "/icons/tabler", element: <TablerIcons /> },
];

const mapRoutes: RouteObject[] = [
  { path: "/maps/vector", element: <VectorMap /> },
  { path: "/maps/leaflet", element: <LeafletMap /> },
];

const allRoutes: RouteObject[] = [
  {
    element: (
      <ProtectedRoute isAuthenticated={!!localStorage.getItem("token")}>
      {/* <ProtectedRoute isAuthenticated={true}> */}
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      ...dashboardRoutes,
      ...appsRoutes,
      ...pagesRoutes,
      ...uiRoutes,
      ...graphRoutes,
      ...formRoutes,
      ...tableRoutes,
      ...iconRoutes,
      ...mapRoutes,
    ],
  },
];

const otherRoutes: RouteObject[] = [...authRoutes, ...errorRoutes];

export const routes: RouteObject[] = [...allRoutes, ...otherRoutes];
