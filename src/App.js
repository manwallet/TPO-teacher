import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Spin, message } from 'antd';
import { useDispatch } from 'react-redux';

// Components
import AppHeader from './components/layout/AppHeader';
import AppSidebar from './components/layout/AppSidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ReadingPage from './pages/exam/ReadingPage';
import ListeningPage from './pages/exam/ListeningPage';
import SpeakingPage from './pages/exam/SpeakingPage';
import WritingPage from './pages/exam/WritingPage';
import VocabularyPage from './pages/VocabularyPage';
import ProgressPage from './pages/ProgressPage';
import NotFound from './pages/NotFound';

// Actions
import { setSettings } from './redux/actions/settingsActions';

// Services
import { checkAuth } from './services/authService';

const { Content } = Layout;

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load settings from Electron store
        if (window.electron) {
          const settings = await window.electron.getSettings();
          dispatch(setSettings(settings));
        }
        
        // Check if user is authenticated
        const authResult = await checkAuth();
        setIsAuthenticated(authResult);
      } catch (error) {
        console.error('初始化应用程序时出错:', error);
        message.error('初始化应用程序时出错，请重试');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Layout className="app-container">
        {isAuthenticated && <AppHeader />}
        <Layout className="content-container">
          {isAuthenticated && <AppSidebar />}
          <Content className="main-content">
            <Routes>
              <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/" />} />
              <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
              
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/reading" element={<ProtectedRoute><ReadingPage /></ProtectedRoute>} />
              <Route path="/listening" element={<ProtectedRoute><ListeningPage /></ProtectedRoute>} />
              <Route path="/speaking" element={<ProtectedRoute><SpeakingPage /></ProtectedRoute>} />
              <Route path="/writing" element={<ProtectedRoute><WritingPage /></ProtectedRoute>} />
              <Route path="/vocabulary" element={<ProtectedRoute><VocabularyPage /></ProtectedRoute>} />
              <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
