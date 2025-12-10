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


// Dashboard Pages
const AmbulanceDashboard = lazy(() => import('@/views/pages/Dashboard/ambulance'))


// Pages
const EmptyPage = lazy(() => import("@/views/pages/empty"));
const Invoice = lazy(() => import("@/views/pages/invoice"));
const Pricing = lazy(() => import("@/views/pages/pricing"));
const TermsConditions = lazy(() => import("@/views/pages/terms-conditions"));
const Timeline = lazy(() => import("@/views/pages/timeline"));
const ConsumerList = lazy(() => import('@/views/pages/consumer'))
const ConsumerDetails = lazy(() => import('@/views/pages/consumer/consumerDetails'))
const BlogList = lazy(() => import('@/views/pages/content-writing/blogs'))
const AddBlogs = lazy(() => import('@/views/pages/content-writing/blogs/components/AddBlogs'))
const CityList = lazy(() => import('@/views/pages/content-writing/city'))
const AddCity = lazy(() => import('@/views/pages/content-writing/city/components/AddCity'))
const EditCity = lazy(() => import('@/views/pages/content-writing/city/components/AddCity'))
const DriverEmergency = lazy(() => import('@/views/pages/emergency/driver'))
const ConsumerEmergency = lazy(() => import('@/views/pages/emergency/consumer'))

//manpower
const ManpowerCategory = lazy(() => import("@/views/pages/manpower/category"));
const Booking = lazy(() => import("@/views/pages/manpower/booking"));
const BookingDetails = lazy(() => import("@/views/pages/manpower/booking/bookingDetails"));
const VendorList = lazy(() => import('@/views/pages/manpower/vendorlist'))
const VendorDetails = lazy(() => import('@/views/pages/manpower/vendorlist/vendorDetails'))

//amblulance Pages
const AmbulanceList = lazy(() => import('@/views/pages/ambulance/category'))
const PartnerList = lazy(() => import('@/views/pages/ambulance/partner'))
const DriverList = lazy(() => import('@/views/pages/ambulance/driver'))
const AmbulanceBooking = lazy(() => import('@/views/pages/ambulance/booking'))
const DriverDuty = lazy(() => import('@/views/pages/ambulance/driver-duty'))
const DriverDutyDetails = lazy(() => import('@/views/pages/ambulance/driver-duty/components/DriverDuty'))
const AddDriver = lazy(() => import('@/views/pages/ambulance/driver/components/AddDriver'))
const EditDriver = lazy(() => import('@/views/pages/ambulance/driver/components/AddDriver'))
const DriverDutyMap = lazy(() => import('@/views/pages/ambulance/driver-duty/components/DriverDutyMap'))
const AddPartner = lazy(() => import('@/views/pages/ambulance/partner/components/AddPartner'));
const EditPartner = lazy(() => import('@/views/pages/ambulance/partner/components/AddPartner'));
const DriverDetails = lazy(() => import('@/views/pages/ambulance/driver/DriverDetailed'));
const PartnerDetails = lazy(() => import('@/views/pages/ambulance/partner/PartnerDetailed'));
const VehicalList = lazy(() => import('@/views/pages/ambulance/vehicle'));
const AddVehicle = lazy(() => import('@/views/pages/ambulance/vehicle/components/AddVehicle'));
const EditVehicle = lazy(() => import('@/views/pages/ambulance/vehicle/components/AddVehicle'));
const DriverTransactionDetails = lazy(() => import('@/views/pages/ambulance/driver/'));
const AmbulanceBookingDetails = lazy(() => import('@/views/pages/ambulance/booking/BookingDetails'));


//transaction Pages
const ConsumerTransactionList = lazy(() => import('@/views/pages/transaction/Consumer'));
const DriverTransactionList = lazy(() => import('@/views/pages/transaction/ambulance/Driver'));
const PartnerTransactionList = lazy(() => import('@/views/pages/transaction/ambulance/Partner'));
const VendorTransactionList = lazy(() => import('@/views/pages/transaction/manpower/Vendor'));

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
  { path: "/manpower-dashboard", element: <Dashboard /> },
  { path: "/ambulance-dashboard", element: <AmbulanceDashboard /> },
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

  //manpower
  { path: "/manpower-category", element: <ManpowerCategory /> },
  { path: "/manpower-bookings", element: <Booking/> },
  { path: "/manpower/booking/details/:id", element: <BookingDetails/> },
  { path: "/manpower-vendors", element: <VendorList/>},

  { path: "/consumer-list", element: <ConsumerList/>},
  { path: "/vendor-details/:id", element: <VendorDetails/>},
  { path: "/consumer-details/:id", element: <ConsumerDetails/> },
  { path: "/content-seo/blogs", element: <BlogList/> },
  { path: "/add-blog", element: <AddBlogs/> },
  { path: "/edit-blog/:id", element: <AddBlogs/> },
  { path: "/city/:section", element: <CityList/> },
  { path: "/city/:section/add-city", element: <AddCity/> },
  { path: "/city/:section/edit-city/:id", element: <EditCity/> },
  { path: "/emergency/driver", element: <DriverEmergency/> },
  { path: "/emergency/consumer", element: <ConsumerEmergency/> },
  
  //ambulance Pages
  { path: "/ambulance/partner", element: <PartnerList/> },
  { path: "/ambulance/driver", element: <DriverList/> },
  { path: "/ambulance/add-driver", element: <AddDriver/> },
  { path: "/ambulance/category", element: <AmbulanceList/> },
  { path: "/ambulance/booking", element: <AmbulanceBooking/> },
  { path: "/ambulance/driver-duty", element: <DriverDuty/> },
  { path: "/ambulance/driver-duty/:id", element: <DriverDutyDetails/> },
  { path: "/ambulance/driver-duty-map", element: <DriverDutyMap/> },
  { path: "/ambulance/partner/add-partner", element: <AddPartner/> },
  { path: "/ambulance/vehicle", element: <VehicalList/> },
  { path: "/ambulance/vehicle/add-vehicle", element: <AddVehicle/> },
  { path: "/ambulance/vehicle/edit/:id", element: <EditVehicle/> },
  { path: "/ambulance/booking/details/:id", element: <AmbulanceBookingDetails/> },
  { path: "/edit-driver/:id", element: <EditDriver/> },
  { path: "/edit-partner/:id", element: <EditPartner/> },
  { path: "/driver-detail/:id", element: <DriverDetails/> },
  { path: "/partner-detail/:id", element: <PartnerDetails/> },
  { path: "/driver-transaction-details/:id", element: <DriverTransactionDetails/> },


  //transaction pages
  { path: "/transaction/consumer", element: <ConsumerTransactionList/> },
  { path: "/transaction/driver", element: <DriverTransactionList/> },
  { path: "/transaction/partner", element: <PartnerTransactionList/> },
  { path: "/transaction/vendor", element: <VendorTransactionList/> },
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
        element: <Navigate to="/manpower-dashboard" replace />,
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
