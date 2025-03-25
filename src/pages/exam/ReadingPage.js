import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Divider, 
  Radio, 
  Space, 
  Progress, 
  message,
  Spin,
  Affix,
  Tabs
} from 'antd';
import { 
  ClockCircleOutlined, 
  CheckOutlined, 
  RightOutlined, 
  LeftOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Mock reading passage data
const mockPassage = {
  id: 'tpo1-reading1',
  title: 'The Origins of Theater',
  content: `
    The art of theater has been central to many cultures throughout history. The ancient Greeks are often credited with creating what we now recognize as theater, but theatrical performances actually have a much longer history.

    The earliest theatrical presentations probably took place as part of religious ceremonies. In ancient Egypt, for example, festivals honoring the god Osiris featured performances that reenacted stories from Egyptian mythology. These performances included music, dance, and spoken elements, and they were performed by priests rather than by professional actors.

    The ancient Greeks transformed these religious ceremonies into a more secular form of entertainment. Greek theater began as part of the festival of Dionysus, the god of wine and fertility. The festival included competitions in which playwrights presented their works to be judged. The winners received prizes and prestige. The earliest Greek plays were probably performed by a chorus that sang and danced, with a single actor who wore different masks to portray various characters. Later, more actors were added, allowing for more complex stories and interactions between characters.

    Greek theaters were large, open-air structures built into hillsides. The audience sat in semicircular rows facing a circular area called the orchestra, where the chorus performed. Behind the orchestra was the skene, a building that served as a backdrop for the action and provided a place for actors to change costumes and masks.

    The Romans adopted and adapted Greek theatrical traditions. Roman theaters were similar to Greek theaters in design, but they were freestanding structures rather than being built into hillsides. Roman plays were often more spectacle-oriented than Greek plays, featuring elaborate costumes, sets, and special effects.

    In medieval Europe, theater took the form of religious plays performed in churches or public spaces. These plays, known as mystery plays or miracle plays, depicted biblical stories or the lives of saints. They were performed by amateur actors, often members of craft guilds.

    During the Renaissance, theater became more secular and professional. In England, companies of professional actors performed in public theaters like the Globe, where Shakespeare's plays were first performed. These theaters were open-air structures with a stage that projected into the audience, allowing for a more intimate connection between actors and spectators.

    In Asia, theatrical traditions developed independently of Western influences. In China, traditional theater combines music, dance, acrobatics, and elaborate costumes and makeup. Japanese Noh theater, which dates back to the 14th century, features masked performers and stylized movements.

    Today, theater continues to evolve, incorporating new technologies and reflecting changing social and cultural values. But it remains, at its core, a form of storytelling that brings people together to share in a communal experience.
  `,
  questions: [
    {
      id: 'tpo1-reading1-q1',
      text: 'According to the passage, where did the earliest theatrical performances likely take place?',
      options: [
        'In ancient Greek theaters',
        'As part of religious ceremonies',
        'In Roman freestanding structures',
        'During Renaissance festivals'
      ],
      correctAnswer: 1
    },
    {
      id: 'tpo1-reading1-q2',
      text: 'The passage indicates that Greek theater differed from earlier Egyptian performances in that Greek theater:',
      options: [
        'Did not include music or dance',
        'Was performed exclusively by priests',
        'Was more secular in nature',
        'Featured only a single actor'
      ],
      correctAnswer: 2
    },
    {
      id: 'tpo1-reading1-q3',
      text: 'According to the passage, what was the function of the skene in Greek theaters?',
      options: [
        'It was where the audience sat',
        'It was where the chorus performed',
        'It served as a backdrop and changing area',
        'It was where religious ceremonies took place'
      ],
      correctAnswer: 2
    },
    {
      id: 'tpo1-reading1-q4',
      text: 'The passage mentions all of the following as characteristics of medieval theater EXCEPT:',
      options: [
        'It often depicted religious stories',
        'It was performed by professional actors',
        'It took place in churches or public spaces',
        'It was performed by members of craft guilds'
      ],
      correctAnswer: 1
    },
    {
      id: 'tpo1-reading1-q5',
      text: 'What does the passage indicate about theatrical traditions in Asia?',
      options: [
        'They were directly influenced by Western theater',
        'They developed independently of Western influences',
        'They began during the Renaissance period',
        'They were less elaborate than Western theatrical forms'
      ],
      correctAnswer: 1
    }
  ]
};

const ReadingPage = () => {
  const dispatch = useDispatch();
  const { loading, currentSection, answers } = useSelector(state => state.exam);
  
  // Local state
  const [passage, setPassage] = useState(mockPassage);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(1200); // 20 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle answer selection
  const handleAnswerSelect = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
  };
  
  // Navigate to next/previous question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < passage.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Submit answers
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Calculate score
    let correctCount = 0;
    Object.keys(selectedAnswers).forEach(questionId => {
      const question = passage.questions.find(q => q.id === questionId);
      if (question && selectedAnswers[questionId] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / passage.questions.length) * 100);
    
    // Show result
    setTimeout(() => {
      message.success(`您的得分: ${score}%`);
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Current question
  const currentQuestion = passage.questions[currentQuestionIndex];
  
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
              <BookOutlined /> 阅读练习
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
        
        <Col span={24} lg={14}>
          <Card 
            title={passage.title} 
            style={{ marginBottom: 16 }}
            bodyStyle={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}
          >
            {passage.content.split('\n\n').map((paragraph, index) => (
              <Paragraph key={index}>{paragraph}</Paragraph>
            ))}
          </Card>
        </Col>
        
        <Col span={24} lg={10}>
          <Card title={`问题 ${currentQuestionIndex + 1} / ${passage.questions.length}`}>
            <div style={{ minHeight: '300px' }}>
              <Paragraph strong>{currentQuestion.text}</Paragraph>
              
              <Radio.Group 
                onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                value={selectedAnswers[currentQuestion.id]}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {currentQuestion.options.map((option, index) => (
                    <Radio key={index} value={index} style={{ marginBottom: 8 }}>
                      {option}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
            
            <Divider />
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                type="default" 
                onClick={goToPrevQuestion}
                disabled={currentQuestionIndex === 0}
                icon={<LeftOutlined />}
              >
                上一题
              </Button>
              
              {currentQuestionIndex === passage.questions.length - 1 ? (
                <Button 
                  type="primary" 
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  icon={<CheckOutlined />}
                >
                  提交答案
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  onClick={goToNextQuestion}
                  icon={<RightOutlined />}
                >
                  下一题
                </Button>
              )}
            </div>
          </Card>
          
          <Card style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>完成进度</Text>
              <Text>{Object.keys(selectedAnswers).length} / {passage.questions.length}</Text>
            </div>
            <Progress 
              percent={Math.round((Object.keys(selectedAnswers).length / passage.questions.length) * 100)} 
              status="active" 
            />
            
            <div style={{ marginTop: 16 }}>
              {passage.questions.map((_, index) => (
                <Button 
                  key={index}
                  type={selectedAnswers[passage.questions[index].id] !== undefined ? 'primary' : 'default'}
                  shape="circle"
                  size="small"
                  style={{ margin: '0 8px 8px 0' }}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReadingPage;
