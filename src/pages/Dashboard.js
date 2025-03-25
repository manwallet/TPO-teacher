import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, List, Button, Progress, Divider } from 'antd';
import { 
  ReadOutlined, 
  SoundOutlined, 
  AudioOutlined, 
  EditOutlined, 
  BookOutlined,
  RightOutlined,
  ClockCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { progress } = useSelector(state => state.progress);
  
  // Mock recent activities data
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'reading',
      title: 'TPO 1 阅读练习',
      date: '2025-03-24',
      score: 26,
      totalScore: 30
    },
    {
      id: 2,
      type: 'listening',
      title: 'TPO 2 听力练习',
      date: '2025-03-23',
      score: 24,
      totalScore: 30
    },
    {
      id: 3,
      type: 'speaking',
      title: 'TPO 1 口语练习',
      date: '2025-03-22',
      score: 22,
      totalScore: 30
    }
  ]);
  
  // Mock recommended exercises
  const [recommendedExercises, setRecommendedExercises] = useState([
    {
      id: 1,
      type: 'reading',
      title: 'TPO 3 阅读练习',
      difficulty: '中等'
    },
    {
      id: 2,
      type: 'listening',
      title: 'TPO 4 听力练习',
      difficulty: '中等'
    },
    {
      id: 3,
      type: 'speaking',
      title: 'TPO 2 口语练习',
      difficulty: '困难'
    },
    {
      id: 4,
      type: 'writing',
      title: 'TPO 3 写作练习',
      difficulty: '中等'
    }
  ]);
  
  // Get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'reading':
        return <ReadOutlined style={{ color: '#1890ff' }} />;
      case 'listening':
        return <SoundOutlined style={{ color: '#52c41a' }} />;
      case 'speaking':
        return <AudioOutlined style={{ color: '#fa8c16' }} />;
      case 'writing':
        return <EditOutlined style={{ color: '#722ed1' }} />;
      case 'vocabulary':
        return <BookOutlined style={{ color: '#eb2f96' }} />;
      default:
        return <ReadOutlined />;
    }
  };
  
  // Navigate to section
  const navigateToSection = (type) => {
    navigate(`/${type}`);
  };
  
  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={2}>欢迎回来，{user?.name || '同学'}</Title>
          <Text type="secondary">继续您的托福备考之旅</Text>
        </Col>
        
        {/* Stats Cards */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="阅读能力"
              value={progress?.reading?.score || 0}
              suffix="/ 30"
              prefix={<ReadOutlined style={{ marginRight: 8 }} />}
            />
            <Progress percent={((progress?.reading?.score || 0) / 30) * 100} status="active" />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="听力能力"
              value={progress?.listening?.score || 0}
              suffix="/ 30"
              prefix={<SoundOutlined style={{ marginRight: 8 }} />}
            />
            <Progress percent={((progress?.listening?.score || 0) / 30) * 100} status="active" />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="口语能力"
              value={progress?.speaking?.score || 0}
              suffix="/ 30"
              prefix={<AudioOutlined style={{ marginRight: 8 }} />}
            />
            <Progress percent={((progress?.speaking?.score || 0) / 30) * 100} status="active" />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="写作能力"
              value={progress?.writing?.score || 0}
              suffix="/ 30"
              prefix={<EditOutlined style={{ marginRight: 8 }} />}
            />
            <Progress percent={((progress?.writing?.score || 0) / 30) * 100} status="active" />
          </Card>
        </Col>
        
        {/* Recent Activities */}
        <Col span={24} md={16}>
          <Card title="最近活动" extra={<Button type="link">查看全部</Button>}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getActivityIcon(item.type)}
                    title={item.title}
                    description={
                      <div>
                        <Text type="secondary"><ClockCircleOutlined /> {item.date}</Text>
                        <div style={{ marginTop: 4 }}>
                          <Text>得分: </Text>
                          <Text strong>{item.score}</Text>
                          <Text> / {item.totalScore}</Text>
                        </div>
                      </div>
                    }
                  />
                  <Button 
                    type="link" 
                    icon={<RightOutlined />}
                    onClick={() => navigateToSection(item.type)}
                  >
                    查看详情
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        {/* Recommended Exercises */}
        <Col span={24} md={8}>
          <Card title="推荐练习" extra={<Button type="link">更多</Button>}>
            <List
              itemLayout="horizontal"
              dataSource={recommendedExercises}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getActivityIcon(item.type)}
                    title={item.title}
                    description={`难度: ${item.difficulty}`}
                  />
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={() => navigateToSection(item.type)}
                  >
                    开始
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        {/* Study Time */}
        <Col span={24}>
          <Card>
            <Row gutter={24}>
              <Col span={12}>
                <Statistic
                  title="本周学习时间"
                  value={12.5}
                  suffix="小时"
                  prefix={<ClockCircleOutlined style={{ marginRight: 8 }} />}
                />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">比上周增加了 2.5 小时</Text>
                </div>
              </Col>
              <Col span={12}>
                <Statistic
                  title="完成练习数"
                  value={24}
                  prefix={<TrophyOutlined style={{ marginRight: 8 }} />}
                />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">继续保持！</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
