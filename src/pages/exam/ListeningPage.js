import React, { useState, useEffect, useRef } from 'react';
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
  Tabs,
  Slider,
  Alert
} from 'antd';
import { 
  ClockCircleOutlined, 
  CheckOutlined, 
  RightOutlined, 
  LeftOutlined,
  SoundOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Mock listening passage data
const mockListeningPassage = {
  id: 'tpo1-listening1',
  title: 'Conversation about Student Housing',
  audioUrl: null, // In a real app, this would be a URL to an audio file
  transcript: `
    Woman: Hi, I'm looking for some information about on-campus housing for next semester.
    
    Man: Sure, I can help you with that. Are you a current student or an incoming student?
    
    Woman: I'm a current student. I've been living off-campus for the past year, but I'm thinking about moving into a dormitory next semester.
    
    Man: I see. Well, we have several housing options available. There are traditional dormitories with shared rooms and communal bathrooms, suite-style accommodations where four students share a bathroom, and apartment-style housing with private bathrooms and kitchens.
    
    Woman: I'm most interested in the apartment-style housing. Could you tell me more about that option?
    
    Man: The apartment-style units are in the West Campus Complex. Each apartment has two bedrooms, a bathroom, a small kitchen, and a living area. Usually, four students share an apartment, with two in each bedroom.
    
    Woman: Are there any single-occupancy bedrooms available?
    
    Man: There are a limited number of single rooms in the apartment units, but they're typically reserved for upperclassmen and they cost more. Let me check if there are any available for next semester... It looks like all the singles are already taken, but you could join the waiting list.
    
    Woman: Hmm, I was really hoping for a single room. What about the suite-style accommodations? Do they have any single rooms?
    
    Man: Yes, the North Hall has suite-style accommodations with some single rooms. Each suite has four single bedrooms, and the four residents share a bathroom. There's no kitchen, but there's a small common area in each suite.
    
    Woman: That sounds promising. How much does a single room in North Hall cost?
    
    Man: A single room in North Hall is $4,500 per semester, which includes utilities and internet. The apartment-style doubles are $3,800 per semester.
    
    Woman: And what about meal plans? Are they required if I live in North Hall?
    
    Man: Yes, all dormitory residents are required to purchase a meal plan. We have several options ranging from $1,500 to $2,200 per semester, depending on how many meals you want.
    
    Woman: I see. And what's the application process like? Is there a deadline?
    
    Man: The deadline for current students to apply for on-campus housing for next semester is March 15th. You'll need to fill out an online application and pay a $200 deposit, which will be applied to your housing fee if you're assigned a room.
    
    Woman: OK, and how are room assignments determined?
    
    Man: Room assignments for current students are based on a lottery system. Each student is assigned a random number, and students with lower numbers get to choose their rooms first.
    
    Woman: I understand. One last question: if I apply for a single room in North Hall but don't get one, can I be considered for other housing options?
    
    Man: Yes, on the application, you can list your housing preferences in order. If your first choice isn't available, you'll be considered for your second choice, and so on.
    
    Woman: Great, thanks for your help. I'll fill out the application right away.
    
    Man: You're welcome. Good luck with the housing lottery!
  `,
  questions: [
    {
      id: 'tpo1-listening1-q1',
      text: 'Why does the woman go to the housing office?',
      options: [
        'To complain about her current roommate',
        'To inquire about on-campus housing options',
        'To apply for a job in student housing',
        'To request repairs in her dormitory room'
      ],
      correctAnswer: 1
    },
    {
      id: 'tpo1-listening1-q2',
      text: 'What type of housing is the woman most interested in initially?',
      options: [
        'Traditional dormitories',
        'Suite-style accommodations',
        'Apartment-style housing',
        'Off-campus apartments'
      ],
      correctAnswer: 2
    },
    {
      id: 'tpo1-listening1-q3',
      text: 'According to the man, what is true about single rooms in apartment-style housing?',
      options: [
        'They are available to all students',
        'They are less expensive than shared rooms',
        'They are reserved for upperclassmen',
        'They are located in North Hall'
      ],
      correctAnswer: 2
    },
    {
      id: 'tpo1-listening1-q4',
      text: 'What is the cost of a single room in North Hall per semester?',
      options: [
        '$1,500',
        '$2,200',
        '$3,800',
        '$4,500'
      ],
      correctAnswer: 3
    },
    {
      id: 'tpo1-listening1-q5',
      text: 'What is required for all dormitory residents?',
      options: [
        'A meal plan',
        'A parking permit',
        'Renter\'s insurance',
        'A security deposit'
      ],
      correctAnswer: 0
    },
    {
      id: 'tpo1-listening1-q6',
      text: 'How are room assignments determined for current students?',
      options: [
        'First-come, first-served basis',
        'Based on academic performance',
        'Based on seniority',
        'Random lottery system'
      ],
      correctAnswer: 3
    }
  ]
};

// Mock audio player functionality
const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // In a real app, this would be a ref to an actual audio element
  const audioRef = useRef(null);
  
  // Simulate audio loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setDuration(180); // 3 minutes in seconds
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate audio playback
  useEffect(() => {
    let interval;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, duration]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const stop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };
  
  const seek = (time) => {
    setCurrentTime(time);
  };
  
  const skipForward = () => {
    setCurrentTime(prev => Math.min(prev + 10, duration));
  };
  
  const skipBackward = () => {
    setCurrentTime(prev => Math.max(prev - 10, 0));
  };
  
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return {
    isPlaying,
    duration,
    currentTime,
    loading,
    togglePlay,
    stop,
    seek,
    skipForward,
    skipBackward,
    formatTime
  };
};

const ListeningPage = () => {
  const dispatch = useDispatch();
  const { loading: examLoading } = useSelector(state => state.exam);
  
  // Local state
  const [passage, setPassage] = useState(mockListeningPassage);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [phase, setPhase] = useState('listening'); // listening, questions, review
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Audio player hooks
  const {
    isPlaying,
    duration,
    currentTime,
    loading: audioLoading,
    togglePlay,
    stop,
    seek,
    skipForward,
    skipBackward,
    formatTime
  } = useAudioPlayer();
  
  // Current question
  const currentQuestion = passage.questions[currentQuestionIndex];
  
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
  
  // Start answering questions
  const startQuestions = () => {
    stop();
    setPhase('questions');
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
      setPhase('review');
    }, 1500);
  };
  
  if (examLoading) {
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
          <Title level={2}>
            <SoundOutlined /> 听力练习
          </Title>
        </Col>
        
        {phase === 'listening' && (
          <>
            <Col span={24}>
              <Card title={passage.title}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  {audioLoading ? (
                    <Spin tip="加载音频..." />
                  ) : (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <Space>
                          <Button 
                            icon={<StepBackwardOutlined />} 
                            onClick={skipBackward}
                            disabled={currentTime < 10}
                          />
                          <Button 
                            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />} 
                            onClick={togglePlay}
                            type="primary"
                            size="large"
                          />
                          <Button 
                            icon={<StepForwardOutlined />} 
                            onClick={skipForward}
                            disabled={currentTime > duration - 10}
                          />
                        </Space>
                      </div>
                      
                      <div style={{ width: '80%', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Text>{formatTime(currentTime)}</Text>
                          <Text>{formatTime(duration)}</Text>
                        </div>
                        <Slider 
                          value={currentTime} 
                          max={duration} 
                          onChange={seek}
                          tooltipVisible={false}
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <Alert
                  message="听力练习说明"
                  description="请仔细听取对话或讲座，然后回答相关问题。您可以在听取过程中做笔记，但不能查看文字记录。"
                  type="info"
                  showIcon
                />
                
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={startQuestions}
                  >
                    开始回答问题
                  </Button>
                </div>
              </Card>
            </Col>
          </>
        )}
        
        {phase === 'questions' && (
          <>
            <Col span={24} lg={16}>
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
            </Col>
            
            <Col span={24} lg={8}>
              <Card title="答题进度">
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
          </>
        )}
        
        {phase === 'review' && (
          <>
            <Col span={24}>
              <Card title="听力练习结果">
                <Tabs defaultActiveKey="results">
                  <TabPane 
                    tab={
                      <span>
                        <CheckOutlined /> 答题结果
                      </span>
                    } 
                    key="results"
                  >
                    <div>
                      {passage.questions.map((question, index) => {
                        const userAnswer = selectedAnswers[question.id];
                        const isCorrect = userAnswer === question.correctAnswer;
                        
                        return (
                          <Card 
                            key={index}
                            size="small" 
                            title={`问题 ${index + 1}`}
                            style={{ 
                              marginBottom: 16,
                              borderLeft: isCorrect ? '4px solid #52c41a' : '4px solid #ff4d4f'
                            }}
                          >
                            <Paragraph strong>{question.text}</Paragraph>
                            
                            <div>
                              {question.options.map((option, optIndex) => (
                                <div 
                                  key={optIndex}
                                  style={{ 
                                    padding: '8px',
                                    marginBottom: '4px',
                                    backgroundColor: 
                                      optIndex === question.correctAnswer ? '#f6ffed' :
                                      optIndex === userAnswer && userAnswer !== question.correctAnswer ? '#fff2f0' :
                                      'transparent',
                                    border: 
                                      optIndex === question.correctAnswer ? '1px solid #b7eb8f' :
                                      optIndex === userAnswer && userAnswer !== question.correctAnswer ? '1px solid #ffccc7' :
                                      '1px solid transparent',
                                    borderRadius: '4px'
                                  }}
                                >
                                  <Space>
                                    {optIndex === question.correctAnswer && (
                                      <CheckOutlined style={{ color: '#52c41a' }} />
                                    )}
                                    <Text 
                                      style={{ 
                                        color: 
                                          optIndex === question.correctAnswer ? '#52c41a' :
                                          optIndex === userAnswer && userAnswer !== question.correctAnswer ? '#ff4d4f' :
                                          'inherit'
                                      }}
                                    >
                                      {option}
                                    </Text>
                                  </Space>
                                </div>
                              ))}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </TabPane>
                  
                  <TabPane 
                    tab={
                      <span>
                        <SoundOutlined /> 对话文本
                      </span>
                    } 
                    key="transcript"
                  >
                    <Card>
                      {passage.transcript.split('\n\n').map((paragraph, index) => (
                        <Paragraph key={index}>{paragraph}</Paragraph>
                      ))}
                    </Card>
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};

export default ListeningPage;
