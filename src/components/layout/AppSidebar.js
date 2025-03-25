import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { 
  HomeOutlined, 
  ReadOutlined, 
  SoundOutlined, 
  AudioOutlined, 
  EditOutlined, 
  BookOutlined,
  BarChartOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Get the current path to highlight the active menu item
  const currentPath = location.pathname;
  
  // Menu items configuration
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
      onClick: () => navigate('/')
    },
    {
      key: 'exam',
      icon: <ReadOutlined />,
      label: '考试练习',
      children: [
        {
          key: '/reading',
          label: '阅读',
          onClick: () => navigate('/reading')
        },
        {
          key: '/listening',
          label: '听力',
          onClick: () => navigate('/listening')
        },
        {
          key: '/speaking',
          label: '口语',
          onClick: () => navigate('/speaking')
        },
        {
          key: '/writing',
          label: '写作',
          onClick: () => navigate('/writing')
        }
      ]
    },
    {
      key: '/vocabulary',
      icon: <BookOutlined />,
      label: '词汇学习',
      onClick: () => navigate('/vocabulary')
    },
    {
      key: '/progress',
      icon: <BarChartOutlined />,
      label: '学习进度',
      onClick: () => navigate('/progress')
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/settings')
    }
  ];
  
  // Find the open keys for the submenu
  const getOpenKeys = () => {
    if (currentPath.includes('/reading') || 
        currentPath.includes('/listening') || 
        currentPath.includes('/speaking') || 
        currentPath.includes('/writing')) {
      return ['exam'];
    }
    return [];
  };
  
  // Find the selected key
  const getSelectedKey = () => {
    if (currentPath === '/') return ['/'];
    
    // For exam sections
    if (currentPath.includes('/reading')) return ['/reading'];
    if (currentPath.includes('/listening')) return ['/listening'];
    if (currentPath.includes('/speaking')) return ['/speaking'];
    if (currentPath.includes('/writing')) return ['/writing'];
    
    // For other pages
    return [currentPath];
  };
  
  return (
    <Sider 
      width={200} 
      collapsible 
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{ background: '#fff' }}
    >
      <Menu
        mode="inline"
        defaultOpenKeys={getOpenKeys()}
        selectedKeys={getSelectedKey()}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
};

export default AppSidebar;
