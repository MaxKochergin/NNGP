import { createBrowserRouter } from "react-router-dom";

import { publicRoutes } from "./PublicRoutes";


export const AppRouter = createBrowserRouter([
    ...publicRoutes,
    // ...privateRoutes,
    {
        path: "*",
        element: <div>Not Found</div>,
    },
]) 
