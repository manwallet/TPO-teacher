import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Divider, 
  Row, 
  Col,
  message,
  Modal
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined,
  EditOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';

const { Title, Paragraph } = Typography;

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Initialize form with user data
  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        name: user.name,
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [form, user]);
  
  const handleEdit = () => {
    setEditing(true);
  };
  
  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };
  
  const handleSave = async (values) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to update the user profile
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('个人资料已更新');
      setEditing(false);
      setLoading(false);
    } catch (error) {
      console.error('更新个人资料时出错:', error);
      message.error('更新个人资料时出错');
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = () => {
    Modal.confirm({
      title: '确认注销账号',
      content: '您确定要注销您的账号吗？此操作不可撤销，您的所有数据将被永久删除。',
      okText: '确认注销',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          // In a real app, this would be an API call to delete the user account
          // For now, we'll just simulate a successful deletion
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Remove user from localStorage
          localStorage.removeItem('user');
          
          // Dispatch logout action
          dispatch({ type: 'LOGOUT' });
          
          message.success('账号已成功注销');
          
          // Redirect to login page
          window.location.href = '/login';
        } catch (error) {
          console.error('注销账号时出错:', error);
          message.error('注销账号时出错');
        }
      }
    });
  };
  
  if (!user) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={4}>未登录</Title>
          <Paragraph>请先登录以查看个人资料</Paragraph>
        </Card>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <UserOutlined /> 个人资料
      </Title>
      <Paragraph type="secondary">
        查看和编辑您的个人信息
      </Paragraph>
      
      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <Avatar 
              size={120} 
              icon={<UserOutlined />} 
              style={{ marginBottom: 16 }}
            />
            <Title level={4}>{user.name}</Title>
            <Paragraph>{user.role === 'student' ? '学生' : '教师'}</Paragraph>
          </Col>
          
          <Col xs={24} md={16}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{
                username: user.username,
                name: user.name,
                email: user.email || '',
                phone: user.phone || ''
              }}
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  disabled={!editing}
                />
              </Form.Item>
              
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  disabled={!editing}
                />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  disabled={!editing}
                />
              </Form.Item>
              
              <Form.Item
                name="phone"
                label="手机号"
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  disabled={!editing}
                />
              </Form.Item>
              
              {editing ? (
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />}
                    loading={loading}
                    style={{ marginRight: 8 }}
                  >
                    保存
                  </Button>
                  <Button 
                    onClick={handleCancel}
                  >
                    取消
                  </Button>
                </Form.Item>
              ) : (
                <Form.Item>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                  >
                    编辑资料
                  </Button>
                </Form.Item>
              )}
            </Form>
            
            <Divider />
            
            <Title level={4}>账号管理</Title>
            <Paragraph type="secondary">
              更改密码或注销账号
            </Paragraph>
            
            <Button 
              icon={<LockOutlined />}
              style={{ marginRight: 8 }}
            >
              修改密码
            </Button>
            
            <Button 
              danger
              onClick={handleDeleteAccount}
            >
              注销账号
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Profile;
