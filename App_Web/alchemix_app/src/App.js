import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import Users from './user/pages/Users';
import UserProfil from './user/pages/ProfilPage'
import NewPlace from './pages/NewPlace';
import UserPlaces from './pages/UserPlaces';
import UpdatePlace from './pages/UpdatePlace';
import MusicsPage from './music/pages/MusicsPage';
import WelcomePage from './pages/WelcomePage';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
// import Error404 from './pages/Error';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
  const { token, login, logout, userId } = useAuth();
  console.log("App Token == ", token);
  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />}/>
        <Route path="/:userId/places" element={<UserPlaces />}/>
        <Route path='/:userId/profil' element={<UserProfil />}/>
        <Route path="/places/new/" element={<NewPlace />}/>
        <Route path="/places/:placeId" element={<UpdatePlace />}/>
        <Route path="/music" element={<MusicsPage />}/>
        <Route path ='*' element={<Users />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/welcome" element={<WelcomePage />}/>
        <Route path="/" element={<Users />}/>
        <Route path="/:userId/places" element={<UserPlaces />}/>
        <Route path='/profil' element={<UserProfil />}/>
        <Route path="/music" element={<MusicsPage />}/>
        <Route path="/auth" element={<Auth />}/>
        {/* <Route path ='*' element={<Users />} /> */}
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
