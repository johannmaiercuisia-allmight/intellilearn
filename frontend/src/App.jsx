import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCoursesListPage from './pages/student/StudentCoursesListPage';
import StudentCoursePage from './pages/student/StudentCoursePage';
import StudentQuizPage from './pages/student/StudentQuizPage';
import StudentLessonPage from './pages/student/StudentLessonPage';
import StudentMaterialViewerPage from './pages/student/StudentMaterialViewerPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentCalendarPage from './pages/student/StudentCalendarPage';
import StudentRiskCheckPage from './pages/student/StudentRiskCheckPage';

// Instructor
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorCoursesListPage from './pages/instructor/InstructorCoursesListPage';
import InstructorCoursePage from './pages/instructor/InstructorCoursePage';
import InstructorAssessmentPage from './pages/instructor/InstructorAssessmentPage';
import InstructorStudentsPage from './pages/instructor/InstructorStudentsPage';
import InstructorGradePage from './pages/instructor/InstructorGradePage';
import InstructorCreateCoursePage from './pages/instructor/InstructorCreateCoursePage';
import InstructorAiSummaryPage from './pages/instructor/InstructorAiSummaryPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCreateCoursePage from './pages/admin/AdminCreateCoursePage';

// Utility
import { PlaceholderPage, UnauthorizedPage } from './pages/PlaceholderPage';

function RoleRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'instructor') return <Navigate to="/instructor" />;
  return <Navigate to="/student" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/" element={<RoleRedirect />} />

          {/* ── Student ── */}
          <Route path="/student" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/courses" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentCoursesListPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/courses/:courseId" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentCoursePage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/courses/:courseId/lessons/:lessonId" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentLessonPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/courses/:courseId/lessons/:lessonId/materials/:materialId" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentMaterialViewerPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/courses/:courseId/assessments/:assessmentId" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentQuizPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/calendar" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentCalendarPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentProfilePage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/risk-check" element={
            <ProtectedRoute roles={['student']}>
              <DashboardLayout><StudentRiskCheckPage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* ── Instructor ── */}
          <Route path="/instructor" element={
            <ProtectedRoute roles={['instructor']}>
              <DashboardLayout><InstructorDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          {/* FIX: /instructor/courses now shows the full list, not the dashboard */}
          <Route path="/instructor/courses" element={
            <ProtectedRoute roles={['instructor']}>
              <DashboardLayout><InstructorCoursesListPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/instructor/courses/create" element={
            <ProtectedRoute roles={['instructor']}>
              <DashboardLayout><InstructorCreateCoursePage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/instructor/courses/:courseId" element={
            <ProtectedRoute roles={['instructor']}>
              <DashboardLayout><InstructorCoursePage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/instructor/courses/:courseId/assessments/:assessmentId" element={
            <ProtectedRoute roles={['instructor']}>
              <DashboardLayout><InstructorAssessmentPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/instructor/students" element={
            <ProtectedRoute roles={['instructor']}>
              <DashboardLayout><InstructorStudentsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/instructor/grading" element={
            <ProtectedRoute roles={['instructor']}>
              <DashboardLayout><InstructorGradePage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/instructor/courses/:courseId/ai-summary" element={
            <ProtectedRoute roles={['instructor']}>
              <DashboardLayout><InstructorAiSummaryPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/instructor/profile" element={
            <ProtectedRoute roles={['instructor']}>
              <DashboardLayout><StudentProfilePage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* ── Admin ── */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><AdminUsersPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/create" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><AdminCreateCoursePage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout><PlaceholderPage title="Reports" /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}