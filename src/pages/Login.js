import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/authActions';

const { Title, Text } = Typography;

const Login = ({ setAuth }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [localLoading, setLocalLoading] = useState(false);
  
  const onFinish = async (values) => {
    setLocalLoading(true);
    try {
      const success = await dispatch(login(values));
      if (success) {
        message.success('登录成功！');
        setAuth(true);
      } else {
        message.error(error || '登录失败，请检查用户名和密码');
      }
    } catch (err) {
      message.error('登录过程中出错，请重试');
      console.error('Login error:', err);
    } finally {
      setLocalLoading(false);
    }
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 8 }}>TPO托福教师</Title>
          <Text type="secondary">登录您的账户</Text>
        </div>
        
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={loading || localLoading}
            >
              登录
            </Button>
          </Form.Item>
          
          <Divider plain>或者</Divider>
          
          <div style={{ textAlign: 'center' }}>
            <Text>还没有账户？</Text> <Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
