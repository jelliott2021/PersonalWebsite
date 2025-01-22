import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Layout from './layout';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import { validate } from '../services/authService';
import PreLoginContext from '../contexts/PreLoginContext';
import ProfilePage from './main/profilePage';
import UsersPage from './main/usersPage';
import AboutPage from './main/aboutPage';
import ProjectPage from './main/projectPage';
import UnderConstructionPage from './main/underConstructionPage';
import LoginRegister from './loginRegister';

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
    return <Navigate to='/login' />;
  }

  // No need to wrap this with UserContext.Provider here, as it's already handled in the main app.
  return children;
};

/**
 * Represents the main component of the application.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [user, setUser] = useState<User | null>(null);
  const [preLoginUser, setPreLoginUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const validatedUser = await validate();
        setUser(validatedUser);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Session validation failed:', e);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return null; // Show a loading spinner or fallback UI if needed
  }

  return (
    <ConfigProvider>
      <LoginContext.Provider value={{ setUser }}>
        <PreLoginContext.Provider value={{ user: preLoginUser, setUser: setPreLoginUser }}>
          <UserContext.Provider value={{ user, socket }}>
            <Routes>
              {/* Public Routes */}
              <Route path='/login' element={<LoginRegister />} />

              {/* Routes with Layout */}
              <Route element={<Layout />}>
                <Route path='/projects' element={<ProjectPage />} />
                <Route path='/skills' element={<UnderConstructionPage />} />
                <Route path='/experience' element={<UnderConstructionPage />} />
                <Route path='/' element={<AboutPage />} />

                {/* Protected Routes */}
                <Route
                  path='/profile/:uid'
                  element={
                    <ProtectedRoute user={user} socket={socket}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/users'
                  element={
                    <ProtectedRoute user={user} socket={socket}>
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </UserContext.Provider>
        </PreLoginContext.Provider>
      </LoginContext.Provider>
    </ConfigProvider>
  );
};

export default FakeStackOverflow;
