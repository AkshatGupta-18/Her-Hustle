// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Register from './register/Register';
import Login from './login/Login';
import SeekerDashboard from './seeker/SeekerDashboard';
import AvailableJobs from './Available/AvailableJobs';
import OrganizerDashboard from './organizer/OrganizerDashboard';
import OrganizerPostJob from './postJob/OrganizerPostJob';
import MyProfile from './profile/MyProfile';
import LearnSkills from './learn/LearnSkills';
import { UserProvider } from './context/UserContext';
import AboutPage from './About/AboutPage';
import ContactPage from './Contact/ContactPage';
import organizerdashboard from './organizer/OrganizerDashboard';
import Applications from './applications/Applications';

function App() {
  return (
    <Router>
      <UserProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
        <Route path="/available-jobs" element={<AvailableJobs />} />
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/organizer/post-job" element={<OrganizerPostJob />} />
        <Route path='my-profile' element={<MyProfile />} ></Route>
        <Route path="/learn-skills" element={<LearnSkills />} />
        <Route path='/about' element={<AboutPage/>} ></Route>
        <Route path='/contact' element={<ContactPage/>} ></Route>
        <Route path='/organizer/about' element = {<AboutPage/>} ></Route>
        <Route path='/organizer/dashboard' element={<OrganizerDashboard />} />
        <Route path='/organizer/applications' element={<Applications />} />

      </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
