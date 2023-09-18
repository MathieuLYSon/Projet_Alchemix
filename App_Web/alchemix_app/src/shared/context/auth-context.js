import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  spotifyRefreshToken: null,
  spotifyAccessToken: null,
  login: () => {},
  logout: () => {},
  loginSpotify: () => {},
  refreshSpotifyToken: () => {}
});
