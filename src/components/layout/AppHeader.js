import React from 'react';
import { Layout, Menu, Dropdown, Button, Avatar, Space } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/actions/authActions';

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>
        <UserOutlined /> 个人资料
      </Menu.Item>
      <Menu.Item key="settings" onClick={() => navigate('/settings')}>
        <SettingOutlined /> 设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> 退出登录
      </Menu.Item>
    </Menu>
  );
  
  return (
    <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo" style={{ fontSize: '18px', fontWeight: 'bold' }}>
          TPO托福教师
        </div>
        
        <Space>
          <Button 
            type="text" 
            icon={<BellOutlined />} 
            style={{ marginRight: 8 }}
            onClick={() => navigate('/notifications')}
          />
          
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name || '用户'}</span>
            </Space>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
