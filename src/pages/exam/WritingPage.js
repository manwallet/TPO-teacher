import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Input, 
  Space, 
  Progress, 
  message,
  Spin,
  Affix,
  Tabs,
  Divider,
  Collapse
} from 'antd';
import { 
  ClockCircleOutlined, 
  CheckOutlined, 
  EditOutlined,
  RobotOutlined,
  SaveOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { analyzeEssay } from '../../services/openaiService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// Mock writing task data
const mockWritingTask = {
  id: 'tpo1-writing1',
  type: 'integrated',
  title: 'The Impact of Technology on Education',
  prompt: `
    You have 30 minutes to plan and write an essay in response to the following prompt:
    
    Technology has significantly changed the way we learn and teach. Some educators believe that technology has improved the quality of education, while others argue that it has had negative effects on learning outcomes.
    
    Write an essay discussing the impact of technology on education. In your essay, be sure to:
    - Explain how technology has changed education
    - Discuss both positive and negative effects of technology on learning
    - State your own opinion on whether technology has overall improved education
    
    Support your ideas with specific examples and reasoning.
  `,
  timeLimit: 1800, // 30 minutes in seconds
  minWords: 300,
  maxWords: 500
};

const WritingPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.exam);
  const { openaiApiKey, openaiApiUrl, openaiModel } = useSelector(state => state.settings);
  
  // Local state
  const [task, setTask] = useState(mockWritingTask);
  const [essay, setEssay] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(task.timeLimit);
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedEssay, setSavedEssay] = useState('');
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          message.warning('时间到！');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Update word count when essay changes
  useEffect(() => {
    if (essay.trim() === '') {
      setWordCount(0);
      return;
    }
    
    const words = essay.trim().split(/\s+/);
    setWordCount(words.length);
  }, [essay]);
  
  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle essay change
  const handleEssayChange = (e) => {
    setEssay(e.target.value);
  };
  
  // Save essay
  const handleSaveEssay = () => {
    setSavedEssay(essay);
    message.success('文章已保存');
  };
  
  // Submit essay
  const handleSubmitEssay = () => {
    if (wordCount < task.minWords) {
      message.warning(`文章字数不足，至少需要 ${task.minWords} 个单词`);
      return;
    }
    
    setIsSubmitting(true);
    
    // Save essay
    setSavedEssay(essay);
    
    // Simulate submission
    setTimeout(() => {
      message.success('文章已提交');
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Analyze essay with AI
  const handleAnalyzeEssay = async () => {
    if (!openaiApiKey) {
      message.error('请先在设置中配置OpenAI API密钥');
      return;
    }
    
    if (essay.trim() === '') {
      message.warning('请先输入文章内容');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeEssay(essay, null, openaiApiKey, openaiApiUrl, openaiModel);
      setAnalysis(result);
      message.success('分析完成');
    } catch (error) {
      console.error('分析文章时出错:', error);
      message.error(`分析文章时出错: ${error.message || '未知错误'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }
  
  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2}>
              <EditOutlined /> 写作练习
            </Title>
            
            <Affix offsetTop={10} style={{ position: 'absolute', right: 24 }}>
              <Card size="small">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ClockCircleOutlined style={{ marginRight: 8, color: timeRemaining < 300 ? '#ff4d4f' : '#1890ff' }} />
                  <Text strong style={{ color: timeRemaining < 300 ? '#ff4d4f' : '#1890ff' }}>
                    {formatTime(timeRemaining)}
                  </Text>
                </div>
              </Card>
            </Affix>
          </div>
        </Col>
        
        <Col span={24} lg={12}>
          <Card 
            title={task.title} 
            style={{ marginBottom: 16 }}
          >
            <Paragraph>{task.prompt}</Paragraph>
            
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                字数要求: {task.minWords}-{task.maxWords} 单词 | 时间限制: {Math.floor(task.timeLimit / 60)} 分钟
              </Text>
            </div>
          </Card>
          
          <Card title="写作区域">
            <TextArea 
              value={essay}
              onChange={handleEssayChange}
              placeholder="在此输入您的文章..."
              autoSize={{ minRows: 15, maxRows: 20 }}
              disabled={timeRemaining === 0 || isSubmitting}
            />
            
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>
                字数: <Text strong>{wordCount}</Text> / {task.minWords}-{task.maxWords}
              </Text>
              
              <Progress 
                percent={Math.min(100, Math.round((wordCount / task.minWords) * 100))} 
                status={wordCount >= task.minWords ? "success" : "active"} 
                style={{ width: '200px' }}
              />
            </div>
            
            <Divider />
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                icon={<SaveOutlined />}
                onClick={handleSaveEssay}
                disabled={essay.trim() === '' || timeRemaining === 0 || isSubmitting}
              >
                保存
              </Button>
              
              <Space>
                <Button 
                  type="primary" 
                  icon={<RobotOutlined />}
                  onClick={handleAnalyzeEssay}
                  loading={isAnalyzing}
                  disabled={essay.trim() === '' || isSubmitting}
                >
                  AI分析
                </Button>
                
                <Button 
                  type="primary" 
                  icon={<CheckOutlined />}
                  onClick={handleSubmitEssay}
                  loading={isSubmitting}
                  disabled={timeRemaining === 0 || wordCount < task.minWords}
                >
                  提交
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
        
        <Col span={24} lg={12}>
          <Tabs defaultActiveKey="analysis">
            <TabPane 
              tab={
                <span>
                  <RobotOutlined /> AI分析
                </span>
              } 
              key="analysis"
            >
              <Card bodyStyle={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
                {isAnalyzing ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <Spin tip="正在分析文章..." />
                  </div>
                ) : analysis ? (
                  <div>
                    <Title level={4}>AI评估结果</Title>
                    <Paragraph>{analysis}</Paragraph>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column' }}>
                    <Text type="secondary" style={{ marginBottom: 16 }}>
                      点击"AI分析"按钮获取文章评估
                    </Text>
                    <Button 
                      type="primary" 
                      icon={<RobotOutlined />}
                      onClick={handleAnalyzeEssay}
                      disabled={essay.trim() === '' || isSubmitting}
                    >
                      开始分析
                    </Button>
                  </div>
                )}
              </Card>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <SaveOutlined /> 已保存的文章
                </span>
              } 
              key="saved"
            >
              <Card bodyStyle={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
                {savedEssay ? (
                  <Paragraph>{savedEssay}</Paragraph>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <Text type="secondary">尚未保存任何文章</Text>
                  </div>
                )}
              </Card>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <EditOutlined /> 写作技巧
                </span>
              } 
              key="tips"
            >
              <Card bodyStyle={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
                <Collapse defaultActiveKey={['1']}>
                  <Panel header="托福写作基本结构" key="1">
                    <Paragraph>
                      <strong>引言 (Introduction):</strong>
                      <ul>
                        <li>提供背景信息</li>
                        <li>明确表达论点</li>
                        <li>概述文章结构</li>
                      </ul>
                    </Paragraph>
                    <Paragraph>
                      <strong>主体段落 (Body Paragraphs):</strong>
                      <ul>
                        <li>每段一个主要观点</li>
                        <li>提供具体例子和证据</li>
                        <li>使用过渡词连接段落</li>
                      </ul>
                    </Paragraph>
                    <Paragraph>
                      <strong>结论 (Conclusion):</strong>
                      <ul>
                        <li>重申主要论点</li>
                        <li>总结关键观点</li>
                        <li>提供最终思考或建议</li>
                      </ul>
                    </Paragraph>
                  </Panel>
                  
                  <Panel header="常用过渡词" key="2">
                    <Paragraph>
                      <strong>添加信息:</strong> 此外 (Furthermore), 另外 (Additionally), 而且 (Moreover)
                    </Paragraph>
                    <Paragraph>
                      <strong>对比观点:</strong> 然而 (However), 相反 (In contrast), 尽管如此 (Nevertheless)
                    </Paragraph>
                    <Paragraph>
                      <strong>因果关系:</strong> 因此 (Therefore), 结果是 (As a result), 由于 (Due to)
                    </Paragraph>
                    <Paragraph>
                      <strong>举例说明:</strong> 例如 (For example), 具体来说 (Specifically), 比如 (Such as)
                    </Paragraph>
                  </Panel>
                  
                  <Panel header="评分标准" key="3">
                    <Paragraph>
                      <strong>内容和任务完成度 (0-5分):</strong> 文章是否充分回应了提示中的所有要求
                    </Paragraph>
                    <Paragraph>
                      <strong>组织结构 (0-5分):</strong> 文章是否有清晰的结构和逻辑流程
                    </Paragraph>
                    <Paragraph>
                      <strong>语言使用 (0-5分):</strong> 句子结构的多样性和复杂性
                    </Paragraph>
                    <Paragraph>
                      <strong>词汇多样性 (0-5分):</strong> 词汇的丰富性和准确性
                    </Paragraph>
                    <Paragraph>
                      <strong>语法准确性 (0-5分):</strong> 语法和拼写的正确性
                    </Paragraph>
                  </Panel>
                </Collapse>
              </Card>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default WritingPage;
