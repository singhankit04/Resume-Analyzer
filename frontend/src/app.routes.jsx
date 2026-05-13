import {createBrowserRouter} from "react-router";
import Login from "./features/auth/login";
import Register from "./features/auth/register";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>,
    },
]);