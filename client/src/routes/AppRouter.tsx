import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/landing/Landing";


export const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
    },
    {

       path: "*",
       element: <div>Not Found</div>,
    },
]) 
