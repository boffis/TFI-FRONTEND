import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { initMercadoPago } from '@mercadopago/sdk-react'
import Home from './components/home/Home'
import Classes from './components/home/Classes'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import SuccessfulRegister from './components/auth/SuccessfulRegister'
import ConfirmEmail from './components/auth/ConfirmEmail'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import Membership from './components/membership/Membership'
import CheckoutPage from './components/membership/CheckoutPage'
import AdminDashboard from './components/dashboard/admin/AdminDashboard'
import TrainerDashboard from './components/dashboard/trainer/TrainerDashboard'
import UserDetail from './components/dashboard/admin/UserDetail/UserDetail'
import NewGymClassForm from './components/dashboard/admin/forms/NewGymClassForm'
import NewGymClassScheduleForm from './components/dashboard/admin/forms/NewGymClassScheduleForm'
import NewMembershipPlanForm from './components/dashboard/admin/forms/NewMembershipPlanForm'
import GymClassDetail from './components/dashboard/admin/GymClassDetail/GymClassDetail'
import GymClassScheduleDetail from './components/dashboard/admin/GymClassScheduleDetail/GymClassScheduleDetail'
import MembershipPlanDetail from './components/dashboard/admin/MembershipPlanDetail/MembershipPlanDetail'
import Account from './components/user/Account'
import UserGymClassDetail from './components/classes/GymClassDetail'
import UserGymClassScheduleDetail from './components/classes/GymClassScheduleDetail'
import ProtectedLogin from './components/protected/ProtectedLogin'
import ProtectedStatus from './components/protected/ProtectedStatus'

function App() {
  initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/success" element={<SuccessfulRegister />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/memberships" element={<Membership />} />

        {/* Protected Routes - require authentication */}
        <Route element={<ProtectedLogin />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/class/:id" element={<UserGymClassDetail />} />
          <Route path="/schedule/:id" element={<UserGymClassScheduleDetail />} />

          {/* Protected Routes - require Trainer role */}
          <Route element={<ProtectedStatus roleNeeded="Trainer" />}>
            <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          </Route>

          {/* Protected Routes - require Admin role */}
          <Route element={<ProtectedStatus roleNeeded="Admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/user/:userId" element={<UserDetail />} />
            <Route path="/admin/gymclass/:id" element={<GymClassDetail />} />
            <Route path="/admin/gymclassschedule/:id" element={<GymClassScheduleDetail />} />
            <Route path="/admin/new/gymclass" element={<NewGymClassForm />} />
            <Route path="/admin/new/gymclassschedule" element={<NewGymClassScheduleForm />} />
            <Route path="/admin/new/membershipplan" element={<NewMembershipPlanForm />} />
            <Route path="/admin/membershipplan/:id" element={<MembershipPlanDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
