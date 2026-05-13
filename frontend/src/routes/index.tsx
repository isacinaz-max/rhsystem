import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppLayout } from '../layouts/AppLayout'
import { AuthLayout } from '../layouts/AuthLayout'

import Login from '../pages/auth/Login'
import Dashboard from '../pages/Dashboard'
import EmployeeList from '../pages/employees/EmployeeList'
import EmployeeForm from '../pages/employees/EmployeeForm'
import DepartmentList from '../pages/departments/DepartmentList'
import PositionList from '../pages/positions/PositionList'
import TimeRecordList from '../pages/time-records/TimeRecordList'
import VacationList from '../pages/vacations/VacationList'
import VacationForm from '../pages/vacations/VacationForm'
import PayrollList from '../pages/payroll/PayrollList'
import PayrollDetail from '../pages/payroll/PayrollDetail'
import PayrollEdit from '../pages/payroll/PayrollEdit'
import BenefitList from '../pages/benefits/BenefitList'
import RecruitmentList from '../pages/recruitments/RecruitmentList'
import RecruitmentForm from '../pages/recruitments/RecruitmentForm'
import CandidateList from '../pages/recruitments/CandidateList'
import ReportList from '../pages/reports/ReportList'
import Settings from '../pages/Settings'
import CompanyList from '../pages/companies/CompanyList'
import EmployeePayrollItemsPage from '../pages/employee-payroll-items/EmployeePayrollItemsPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><AuthLayout><Login /></AuthLayout></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/new" element={<EmployeeForm />} />
        <Route path="employees/:id/edit" element={<EmployeeForm />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="positions" element={<PositionList />} />
        <Route path="time-records" element={<TimeRecordList />} />
        <Route path="vacations" element={<VacationList />} />
        <Route path="vacations/new" element={<VacationForm />} />
        <Route path="payroll" element={<PayrollList />} />
        <Route path="payroll/:id" element={<PayrollDetail />} />
        <Route path="payroll/:id/edit" element={<PayrollEdit />} />
        <Route path="benefits" element={<BenefitList />} />
        <Route path="recruitments" element={<RecruitmentList />} />
        <Route path="recruitments/new" element={<RecruitmentForm />} />
        <Route path="recruitments/:id/edit" element={<RecruitmentForm />} />
        <Route path="candidates" element={<CandidateList />} />
        <Route path="reports" element={<ReportList />} />
        <Route path="settings" element={<Settings />} />
        <Route path="companies" element={<CompanyList />} />
        <Route path="employee-payroll-items" element={<EmployeePayrollItemsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
