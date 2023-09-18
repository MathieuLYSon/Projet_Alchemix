import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

let logoutTimer;
let refreshTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useState(false);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState(false);
  const [spotifyAccessTokenExpDate, setSpotifyAccessTokenExpDate] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setSpotifyRefreshToken(null);
    setSpotifyAccessToken(null);
    setSpotifyAccessTokenExpDate(null);
    localStorage.removeItem('userData');
  }, []);

  const loginSpotify = useCallback((spotifyAccessToken, spotifyRefreshToken) => {
    setSpotifyRefreshToken(spotifyRefreshToken);
    setSpotifyAccessToken(spotifyAccessToken);
    const spotifyAccessTokenExpDate = new Date(new Date().getTime() + 1000 * 60 * 60);
    setSpotifyAccessTokenExpDate(spotifyAccessTokenExpDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        spotifyRefreshToken: spotifyRefreshToken,
        spotifyAccessToken: spotifyAccessToken,
        spotifyAccessTokenExpDate: spotifyAccessTokenExpDate.toISOString()
      })
    );
  }, []);

  const refreshSpotifyToken = useCallback(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    axios
      .get(`http://localhost:8082/api/services/spotify/refresh_token`,  {
        headers: {
          Authorization: storedData.token,
        }
      })
      .then((response) => {
        setSpotifyAccessToken(response.data.access_token);
        const spotifyAccessTokenExpDate = new Date(new Date().getTime() + 1000 * 60 * 60);
        setSpotifyAccessTokenExpDate(spotifyAccessTokenExpDate);
        localStorage.setItem(
          'userData',
          JSON.stringify({
            spotifyAccessToken: spotifyAccessToken,
            spotifyAccessTokenExpDate: spotifyAccessTokenExpDate.toISOString()
          })
        );
      })
      .catch((error) => {
        console.error("Erreur lors du refresh du access_token Spotify :", error);
      });
  }, [spotifyAccessToken]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
      if (storedData.spotifyRefreshToken) {
        refreshSpotifyToken();
      }
    }
  }, [login, refreshSpotifyToken]);

  useEffect(() => {
    if (spotifyAccessToken && spotifyAccessTokenExpDate) {
      const remainingTime = spotifyAccessTokenExpDate.getTime() - new Date().getTime();
      refreshTimer = setTimeout(refreshSpotifyToken, remainingTime);
    } else {
      clearTimeout(refreshTimer);
    }
  }, [spotifyAccessToken, refreshSpotifyToken, spotifyAccessTokenExpDate]);

  return { token, login, logout, userId, loginSpotify, refreshSpotifyToken, spotifyAccessToken, spotifyRefreshToken };
};