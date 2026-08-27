import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { CustomThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes inside Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/notes" element={<Notes />} />
              
              {/* Admin Only Routes */}
              <Route element={<RoleBasedRoute allowedRoles={['Admin']} />}>
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>
            </Route>
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<div style={{ padding: 20 }}><h1>404 - Not Found</h1></div>} />
        </Routes>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;
