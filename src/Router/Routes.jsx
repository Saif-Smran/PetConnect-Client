import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home/Home";

import PetDetails from "../pages/PetDetails";
import DonationCampaigns from "../pages/DonationCampaigns";
import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Petlist from "../pages/PetList/Petlist";

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