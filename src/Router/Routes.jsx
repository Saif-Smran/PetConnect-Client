import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import MyAddedPets from "../pages/MyAddedPets";
import UpdatePet from "../pages/UpdatePet";
import Home from "../pages/Home/Home";

import PetDetails from "../pages/PetDetails";
import DonationCampaigns from "../pages/DonationCampaigns";
import DonationDetails from "../pages/DonationDetails";
import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import AddPet from "../pages/AddPet";
import Petlist from "../pages/PetList/Petlist";
import ProtectedRoute from "../components/ProtectedRoute";
import UserRoute from "../components/UserRoute";
import CreateDonationCampaign from "../pages/CreateDonationCampaign";
import MyDonationCampaigns from "../pages/MyDonationCampaigns";
import EditDonationCampaign from "../pages/EditDonationCampaign";
import MyDonations from "../pages/MyDonations";
import AdoptionRequests from "../pages/AdoptionRequests";
import AdminRoute from "../components/Admin/AdminRoute";
import AdminLayoutRoute from "../Layout/AdminLayoutRoute";
import UserDashboardLayout from "../Layout/UserDashboardLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminAllPets from "../pages/Admin/AdminAllPets";
import AdminAllDonations from "../pages/Admin/AdminAllDonations";
import { NotFound, Unauthorized, Forbidden, ServerError } from "../pages/ErrorPages";

const route = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout></MainLayout>,
        children:[
            {
                index: true,
                element:<Home></Home>
            },
            {
                path: "/pets",
                element: <Petlist></Petlist>
            },
            {
                path: "/pet/:id",
                element: <PetDetails></PetDetails>
            },
            {
                path: "/donations",
                element: <DonationCampaigns></DonationCampaigns>
            },
            {
                path: "/donations/:id",
                element: <DonationDetails></DonationDetails>
            },
            {
                path: "/about",
                element: <About></About>
            },
            {
                path: "/login",
                element: <Login></Login>
            },
            {
                path: "/register",
                element: <Register></Register>
            },
            {
                path: "/dashboard",
                element: (
                    <UserRoute>
                        <UserDashboardLayout />
                    </UserRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <Dashboard />
                    },
                    {
                        path: "add-pet",
                        element: <AddPet />
                    },
                    {
                        path: "my-pets",
                        element: <MyAddedPets />
                    },
                    {
                        path: "create-donation-campaign",
                        element: <CreateDonationCampaign />
                    },
                    {
                        path: "my-donation-campaigns",
                        element: <MyDonationCampaigns />
                    },
                    {
                        path: "edit-donation-campaign/:id",
                        element: <EditDonationCampaign />
                    },
                    {
                        path: "my-donations",
                        element: <MyDonations />
                    },
                    {
                        path: "adoption-requests",
                        element: <AdoptionRequests />
                    }
                ]
            },
            {
                path: "/update-pet/:id",
                element: (
                    <ProtectedRoute>
                        <UpdatePet />
                    </ProtectedRoute>
                )
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <Profile></Profile>
                    </ProtectedRoute>
                )
            }
            ,
            {
                path: "/settings",
                element: (
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                )
            }
        ]
    },
    {
        path: "/admin",
        element: (
            <AdminRoute>
                <AdminLayoutRoute />
            </AdminRoute>
        ),
        children: [
            {
                index: true,
                element: <AdminDashboard />
            },
            {
                path: "dashboard",
                element: <AdminDashboard />
            },
            {
                path: "users",
                element: <AdminUsers />
            },
            {
                path: "pets",
                element: <AdminAllPets />
            },
            {
                path: "pets",
                element: <AdminAllPets />
            },
            {
                path: "donations",
                element: <AdminAllDonations />
            },
            // Admin access to user functions
            {
                path: "add-pet",
                element: <AddPet />
            },
            {
                path: "my-pets",
                element: <MyAddedPets />
            },
            {
                path: "create-donation-campaign",
                element: <CreateDonationCampaign />
            },
            {
                path: "my-donation-campaigns",
                element: <MyDonationCampaigns />
            },
            {
                path: "edit-donation-campaign/:id",
                element: <EditDonationCampaign />
            },
            {
                path: "my-donations",
                element: <MyDonations />
            },
            {
                path: "adoption-requests",
                element: <AdoptionRequests />
            }
        ]
    },
    {
        path: "/my-pets",
        element: (
            <ProtectedRoute>
                <MyAddedPets />
            </ProtectedRoute>
        )
    },
    {
        path: "/update-pet/:id",
        element: (
            <ProtectedRoute>
                <UpdatePet />
            </ProtectedRoute>
        )
    },
    // Error Routes
    {
        path: "/error/404",
        element: <NotFound />
    },
    {
        path: "/error/401",
        element: <Unauthorized />
    },
    {
        path: "/error/403",
        element: <Forbidden />
    },
    {
        path: "/error/500",
        element: <ServerError />
    },
    // Catch all route for 404 (must be last)
    {
        path: "*",
        element: <NotFound />
    }
])

export default route;