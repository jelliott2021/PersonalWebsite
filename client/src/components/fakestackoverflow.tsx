import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Layout from './layout';
import Login from './login';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import Register from './register';
import { validate } from '../services/authService';
import Verify from './verify';
import PreLoginContext from '../contexts/PreLoginContext';
import ProfilePage from './main/profilePage';
import UsersPage from './main/usersPage';
import AboutPage from './main/aboutPage';
import ProjectPage from './main/projectPage';
import UnderConstructionPage from './main/underConstructionPage';

const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: User | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  if (!user || !socket || !user.verified) {
    return <Navigate to='/' />;
  }

  return <UserContext.Provider value={{ user, socket }}>{children}</UserContext.Provider>;
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [user, setUser] = useState<User | null>(null);
  const [preLoginUser, setPreLoginUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const validatedUser = await validate();
        setUser(validatedUser);
        setLoading(false);
        navigate('/home');
      } catch (e) {
        setLoading(false);
      }
    };

    if (loading) {
      checkSession();
    }
  }, [navigate, loading]);

  return !loading ? (
    <ConfigProvider>
      <LoginContext.Provider value={{ setUser }}>
        <PreLoginContext.Provider value={{ user: preLoginUser, setUser: setPreLoginUser }}>
          <Routes>
            {/* Public Route */}
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/verify' element={<Verify />} />

            {/* Protected Routes */}
            {
              <Route
                element={
                  <ProtectedRoute user={user} socket={socket}>
                    <Layout />
                  </ProtectedRoute>
                }>
                <>
                  <Route path='/home' element={<AboutPage />} />
                  <Route path='/profile/:uid' element={<ProfilePage />} />
                  <Route path='/users' element={<UsersPage />} />
                  <Route path='/projects' element={<ProjectPage />} />
                  <Route path='/skills' element={<UnderConstructionPage />} />
                  <Route path='/experience' element={<UnderConstructionPage />} />
                </>
              </Route>
            }
          </Routes>
        </PreLoginContext.Provider>
      </LoginContext.Provider>
    </ConfigProvider>
  ) : null;
};

export default FakeStackOverflow;
