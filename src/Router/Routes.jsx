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
import AddPet from "../pages/AddPet";
import Petlist from "../pages/PetList/Petlist";
import ProtectedRoute from "../components/ProtectedRoute";

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
                path: "/add-pet",
                element: (
                    <ProtectedRoute>
                        <AddPet></AddPet>
                    </ProtectedRoute>
                )
            },
            {
                path: "/dashboard",
                element: (
                    <ProtectedRoute>
                        <Dashboard></Dashboard>
                    </ProtectedRoute>
                )
            },
            {
                path: "/dashboard/my-pets",
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
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <Profile></Profile>
                    </ProtectedRoute>
                )
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
    }
])

export default route;