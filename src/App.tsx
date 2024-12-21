import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProfileSetup from './pages/ProfileSetup';
import Portfolio from './pages/Portfolio';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Research from './pages/Research';
import Personal from './pages/Personal';
import Settings from './pages/Settings';
import Forums from './pages/Forums';


function App() {
  return (
    <BrowserRouter>
      {/* Toaster Notifications */}
      <Toaster position="top-center" />
      
      {/* Routes */}
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        
        {/* Authentication Pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/forums" element={<Forums />} />
        <Route path="/research" element={<Research />} />
        <Route path="/personal" element={<Personal />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;