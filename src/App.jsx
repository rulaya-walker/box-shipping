import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import GetAQuote from "./pages/GetAQuote"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ProductManagement from "./pages/admin/ProductManagement"
import UserManagement from "./pages/admin/UserManagement"
import AdminDebug from "./pages/admin/AdminDebug"
import OrderManagement from "./pages/admin/OrderManagement"
import MyAccount from "./pages/user/MyAccount"
import MyOrders from "./pages/user/MyOrders"
import OrderDetails from "./pages/user/OrderDetails"
import UpdatePassword from "./pages/user/UpdatePassword"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import UnauthorizedAccess from "./components/UnauthorizedAccess"
import AuthNotifications from "./components/AuthNotifications"
import StripePayment from "./components/StripePayment"
import Checkout from "./pages/Checkout"
import Price from './pages/admin/PriceManagement'
import CategoryManagement from './pages/admin/CategoryManagement'

function App() {

  return (
    <>
      <AuthNotifications />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-quote" element={<GetAQuote />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        
        {/* Admin Routes - Only accessible by admin role */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="prices" element={<Price />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="debug" element={<AdminDebug />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
        
        {/* User Routes - Accessible by authenticated users */}
        <Route path="/user/account" element={
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        } />
        <Route path="/user/stripe-payment" element={
          <ProtectedRoute>
            <StripePayment />
          </ProtectedRoute>
        } />
        
        {/* User Orders */}
        <Route path="/user/orders" element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        } />
        <Route path="/user/orders/:orderId" element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        } />
        <Route path="/user/password" element={
          <ProtectedRoute>
            <UpdatePassword />
          </ProtectedRoute>
        } />
        
        {/* Unauthorized Access Page */}
        <Route path="/unauthorized" element={<UnauthorizedAccess />} />
      </Routes>
    </>
  )
}

export default App
