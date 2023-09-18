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
import RecommendationsPage from './music/pages/RecommendationsPage';
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
        <Route path="/:userId/places" element={<UserPlaces />} exact={true} />
        <Route path='/profil' element={<UserProfil />} exact={true} />
        <Route path="/places/new/" element={<NewPlace />} exact={true} />
        <Route path="/places/:placeId" element={<UpdatePlace />} exact={true} />
        <Route path="/music" element={<MusicsPage />} exact={true} />
        <Route path='/recommandation' element={<RecommendationsPage />} exact={true} />
        <Route path ='*' element={<Users />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} exact={true}/>
        <Route path="/" element={<Users />} exact={true} />
        <Route path="/:userId/places" element={<UserPlaces />} exact={true}/>
        <Route path='/profil' element={<UserProfil />} exact={true}/>
        <Route path="/music" element={<MusicsPage />} exact={true}/>
        <Route path="/auth" element={<Auth />} exact={true}/>
        <Route path ='*' element={<WelcomePage />} />
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
