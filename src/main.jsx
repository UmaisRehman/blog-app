import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Protectedroutes from './components/Protectedroutes';
import Profile from './pages/Profile';
import Userblogs from './pages/Userblogs';
import { ToastContainer } from 'react-toastify';  // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';   // Import the Toastify CSS


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "dashboard",
        element: <Protectedroutes component={<Dashboard />} />
      },
      {
        path: "profile",
        element: <Protectedroutes component={<Profile />} />
      },
      {
        path: "userblogs/:id",
        element: <Userblogs/>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <div>
    <RouterProvider router={router} />
    <ToastContainer /> {/* Global ToastContainer */}
  </div>
);
