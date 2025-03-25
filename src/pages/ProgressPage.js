import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Statistic, 
  Progress, 
  Tabs, 
  Table, 
  Tag,
  DatePicker,
  Select,
  Space,
  Button,
  Divider
} from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined, 
  CalendarOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
  BookOutlined,
  ReadOutlined,
  SoundOutlined,
  AudioOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Mock progress data
const mockProgress = {
  reading: {
    completed: 12,
    total: 20,
    score: 24
  },
  listening: {
    completed: 10,
    total: 20,
    score: 22
  },
  speaking: {
    completed: 8,
    total: 20,
    score: 20
  },
  writing: {
    completed: 6,
    total: 20,
    score: 21
  },
  vocabulary: {
    learned: 120,
    total: 500
  }
};

// Mock history data
const mockHistory = [
  {
    id: 1,
    date: '2025-03-24',
    type: 'reading',
    title: 'TPO 1 阅读练习',
    score: 26,
    totalScore: 30,
    timeSpent: 45 // minutes
  },
  {
    id: 2,
    date: '2025-03-23',
    type: 'listening',
    title: 'TPO 2 听力练习',
    score: 24,
    totalScore: 30,
    timeSpent: 35
  },
  {
    id: 3,
    date: '2025-03-22',
    type: 'speaking',
    title: 'TPO 1 口语练习',
    score: 22,
    totalScore: 30,
    timeSpent: 25
  },
  {
    id: 4,
    date: '2025-03-21',
    type: 'writing',
    title: 'TPO 3 写作练习',
    score: 23,
    totalScore: 30,
    timeSpent: 40
  },
  {
    id: 5,
    date: '2025-03-20',
    type: 'reading',
    title: 'TPO 2 阅读练习',
    score: 25,
    totalScore: 30,
    timeSpent: 42
  },
  {
    id: 6,
    date: '2025-03-19',
    type: 'listening',
    title: 'TPO 1 听力练习',
    score: 23,
    totalScore: 30,
    timeSpent: 32
  },
  {
    id: 7,
    date: '2025-03-18',
    type: 'speaking',
    title: 'TPO 2 口语练习',
    score: 21,
    totalScore: 30,
    timeSpent: 28
  },
  {
    id: 8,
    date: '2025-03-17',
    type: 'writing',
    title: 'TPO 1 写作练习',
    score: 22,
    totalScore: 30,
    timeSpent: 38
  }
];

// Mock weekly study time data
const mockWeeklyStudyTime = [
  { day: '周一', hours: 2.5 },
  { day: '周二', hours: 1.8 },
  { day: '周三', hours: 3.2 },
  { day: '周四', hours: 2.0 },
  { day: '周五', hours: 1.5 },
  { day: '周六', hours: 4.0 },
  { day: '周日', hours: 3.5 }
];

// Mock score trend data
const mockScoreTrend = [
  { date: '3/1', reading: 20, listening: 18, speaking: 16, writing: 17 },
  { date: '3/8', reading: 22, listening: 19, speaking: 17, writing: 18 },
  { date: '3/15', reading: 23, listening: 21, speaking: 18, writing: 19 },
  { date: '3/22', reading: 24, listening: 22, speaking: 20, writing: 21 }
];

// Mock section distribution data
const mockSectionDistribution = [
  { name: '阅读', value: 12, color: '#1890ff' },
  { name: '听力', value: 10, color: '#52c41a' },
  { name: '口语', value: 8, color: '#fa8c16' },
  { name: '写作', value: 6, color: '#722ed1' }
];

// COLORS
const COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1'];

const ProgressPage = () => {
  const { progress, history } = useSelector(state => state.progress);
  
  // Local state
  const [localProgress, setLocalProgress] = useState(mockProgress);
  const [localHistory, setLocalHistory] = useState(mockHistory);
  const [dateRange, setDateRange] = useState([moment().subtract(30, 'days'), moment()]);
  const [filterType, setFilterType] = useState('all');
  
  // Filter history based on date range and type
  const filteredHistory = localHistory.filter(item => {
    const itemDate = moment(item.date);
    const inDateRange = dateRange ? 
      (itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1])) : 
      true;
    
    const matchesType = filterType === 'all' ? true : item.type === filterType;
    
    return inDateRange && matchesType;
  });
  
  // Calculate total study time
  const totalStudyTime = filteredHistory.reduce((total, item) => total + item.timeSpent, 0);
  
  // Calculate average scores
  const calculateAverageScore = (type) => {
    const items = filteredHistory.filter(item => item.type === type);
    if (items.length === 0) return 0;
    
    const sum = items.reduce((total, item) => total + (item.score / item.totalScore) * 100, 0);
    return Math.round(sum / items.length);
  };
  
  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };
  
  // Handle type filter change
  const handleTypeFilterChange = (value) => {
    setFilterType(value);
  };
  
  // Table columns
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: text => moment(text).format('YYYY-MM-DD')
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: type => {
        let color = '';
        let icon = null;
        
        switch (type) {
          case 'reading':
            color = 'blue';
            icon = <ReadOutlined />;
            break;
          case 'listening':
            color = 'green';
            icon = <SoundOutlined />;
            break;
          case 'speaking':
            color = 'orange';
            icon = <AudioOutlined />;
            break;
          case 'writing':
            color = 'purple';
            icon = <EditOutlined />;
            break;
          default:
            color = 'default';
        }
        
        return (
          <Tag color={color} icon={icon}>
            {type === 'reading' ? '阅读' : 
             type === 'listening' ? '听力' : 
             type === 'speaking' ? '口语' : 
             type === 'writing' ? '写作' : type}
          </Tag>
        );
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      render: (score, record) => `${score} / ${record.totalScore}`
    },
    {
      title: '用时',
      dataIndex: 'timeSpent',
      key: 'timeSpent',
      render: time => `${time} 分钟`
    }
  ];
  
  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={2}>
            <BarChartOutlined /> 学习进度
          </Title>
        </Col>
        
        {/* Overall Progress */}
        <Col span={24}>
          <Card title="总体进度">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={6}>
                <Statistic 
                  title="阅读能力" 
                  value={localProgress.reading.score} 
                  suffix="/ 30" 
                  prefix={<ReadOutlined style={{ marginRight: 8 }} />}
                />
                <Progress 
                  percent={Math.round((localProgress.reading.score / 30) * 100)} 
                  status="active" 
                  strokeColor="#1890ff"
                />
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Statistic 
                  title="听力能力" 
                  value={localProgress.listening.score} 
                  suffix="/ 30" 
                  prefix={<SoundOutlined style={{ marginRight: 8 }} />}
                />
                <Progress 
                  percent={Math.round((localProgress.listening.score / 30) * 100)} 
                  status="active" 
                  strokeColor="#52c41a"
                />
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Statistic 
                  title="口语能力" 
                  value={localProgress.speaking.score} 
                  suffix="/ 30" 
                  prefix={<AudioOutlined style={{ marginRight: 8 }} />}
                />
                <Progress 
                  percent={Math.round((localProgress.speaking.score / 30) * 100)} 
                  status="active" 
                  strokeColor="#fa8c16"
                />
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Statistic 
                  title="写作能力" 
                  value={localProgress.writing.score} 
                  suffix="/ 30" 
                  prefix={<EditOutlined style={{ marginRight: 8 }} />}
                />
                <Progress 
                  percent={Math.round((localProgress.writing.score / 30) * 100)} 
                  status="active" 
                  strokeColor="#722ed1"
                />
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={8}>
                <Statistic 
                  title="完成练习数" 
                  value={localProgress.reading.completed + 
                         localProgress.listening.completed + 
                         localProgress.speaking.completed + 
                         localProgress.writing.completed} 
                  suffix={`/ ${localProgress.reading.total + 
                            localProgress.listening.total + 
                            localProgress.speaking.total + 
                            localProgress.writing.total}`}
                  prefix={<TrophyOutlined style={{ marginRight: 8 }} />}
                />
              </Col>
              
              <Col xs={24} sm={12} md={8}>
                <Statistic 
                  title="总学习时间" 
                  value={totalStudyTime} 
                  suffix="分钟"
                  prefix={<ClockCircleOutlined style={{ marginRight: 8 }} />}
                />
              </Col>
              
              <Col xs={24} sm={12} md={8}>
                <Statistic 
                  title="词汇量" 
                  value={localProgress.vocabulary.learned} 
                  suffix={`/ ${localProgress.vocabulary.total}`}
                  prefix={<BookOutlined style={{ marginRight: 8 }} />}
                />
                <Progress 
                  percent={Math.round((localProgress.vocabulary.learned / localProgress.vocabulary.total) * 100)} 
                  status="active" 
                />
              </Col>
            </Row>
          </Card>
        </Col>
        
        {/* Charts */}
        <Col span={24}>
          <Tabs defaultActiveKey="history">
            <TabPane 
              tab={
                <span>
                  <CalendarOutlined /> 学习历史
                </span>
              } 
              key="history"
            >
              <Card>
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <RangePicker 
                      value={dateRange}
                      onChange={handleDateRangeChange}
                    />
                    
                    <Select 
                      style={{ width: 120 }} 
                      defaultValue="all"
                      onChange={handleTypeFilterChange}
                    >
                      <Option value="all">所有类型</Option>
                      <Option value="reading">阅读</Option>
                      <Option value="listening">听力</Option>
                      <Option value="speaking">口语</Option>
                      <Option value="writing">写作</Option>
                    </Select>
                  </Space>
                </div>
                
                <Table 
                  columns={columns} 
                  dataSource={filteredHistory} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <LineChartOutlined /> 成绩趋势
                </span>
              } 
              key="trend"
            >
              <Card>
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={mockScoreTrend}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 30]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="reading" stroke="#1890ff" name="阅读" />
                      <Line type="monotone" dataKey="listening" stroke="#52c41a" name="听力" />
                      <Line type="monotone" dataKey="speaking" stroke="#fa8c16" name="口语" />
                      <Line type="monotone" dataKey="writing" stroke="#722ed1" name="写作" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <BarChartOutlined /> 学习时间
                </span>
              } 
              key="time"
            >
              <Card>
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={mockWeeklyStudyTime}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hours" name="学习时间（小时）" fill="#1890ff" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <PieChartOutlined /> 练习分布
                </span>
              } 
              key="distribution"
            >
              <Card>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={mockSectionDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {mockSectionDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Title level={4}>练习分布分析</Title>
                    <Paragraph>
                      您的练习分布显示您在各个部分的练习情况。从图表中可以看出：
                    </Paragraph>
                    <ul>
                      <li>阅读部分：完成了最多的练习，占总练习量的 {Math.round((mockSectionDistribution[0].value / mockSectionDistribution.reduce((sum, item) => sum + item.value, 0)) * 100)}%</li>
                      <li>听力部分：是您第二多练习的部分</li>
                      <li>口语和写作部分：需要更多的练习</li>
                    </ul>
                    <Paragraph>
                      建议：尝试平衡各部分的练习，特别是增加口语和写作的练习量，以提高整体托福成绩。
                    </Paragraph>
                  </Col>
                </Row>
              </Card>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default ProgressPage;
