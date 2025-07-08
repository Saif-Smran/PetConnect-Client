import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home/Home";
import PetListing from "../pages/PetListing";
import DonationCampaigns from "../pages/DonationCampaigns";
import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

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
                element: <PetListing></PetListing>
            },
            {
                path: "/donations",
                element: <DonationCampaigns></DonationCampaigns>
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
                element: <Dashboard></Dashboard>
            }
        ]
    },
])

export default route;