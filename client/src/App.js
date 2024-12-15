import './App.css';
import { Route, Routes } from 'react-router-dom';
import AdminHome from './pages/AdminHome';
import Layout from './component/Layout';
import AdminAchievements from './pages/AdminAchievements';
import AdminCareer from './pages/AdminCareer';
import AdminContact from './pages/AdminContact';
import AdminGallery from './pages/AdminGallery';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Routes>
      <Route path='/admin' element={<Layout/>}>
      <Route index element={<AdminHome/>}/>
      <Route path='achievements' element={<AdminAchievements/>}/>
      <Route path='career' element={<AdminCareer/>}/>
      <Route path='contact' element={<AdminContact/>}/>
      <Route path='gallery' element={<AdminGallery/>}/>
      </Route>
      <Route path='/admin/login' element={<AdminLogin/>}/>
    </Routes>
  );
}

export default App;
