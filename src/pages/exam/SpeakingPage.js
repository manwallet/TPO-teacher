import React, { useState, useEffect, useRef } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Space, 
  Progress, 
  message,
  Spin,
  Affix,
  Tabs,
  Divider,
  Alert,
  List
} from 'antd';
import { 
  ClockCircleOutlined, 
  AudioOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  RobotOutlined,
  StopOutlined,
  SoundOutlined,
  RightOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { transcribeSpeech, analyzeSpeaking } from '../../services/openaiService';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Mock speaking task data
const mockSpeakingTasks = [
  {
    id: 'tpo1-speaking1',
    type: 'independent',
    title: 'Describe a Memorable Experience',
    prompt: 'Describe a memorable experience from your childhood. Explain why it was memorable and how it has influenced you. You will have 15 seconds to prepare and 45 seconds to speak.',
    prepTime: 15, // seconds
    speakTime: 45, // seconds
  },
  {
    id: 'tpo1-speaking2',
    type: 'independent',
    title: 'Agree or Disagree',
    prompt: 'Some people prefer to travel alone, while others prefer to travel with companions. Which do you prefer and why? You will have 15 seconds to prepare and 45 seconds to speak.',
    prepTime: 15, // seconds
    speakTime: 45, // seconds
  },
  {
    id: 'tpo1-speaking3',
    type: 'integrated',
    title: 'Campus Situation',
    prompt: 'Read the following announcement about a change in the university\'s policy:\n\n"The university has decided to implement a new attendance policy. Starting next semester, attendance will be mandatory for all lectures, and students who miss more than three lectures without a valid excuse will have their final grade reduced by one letter grade."\n\nExplain why you think the university has implemented this policy and what effects it might have on students. You will have 30 seconds to prepare and 60 seconds to speak.',
    prepTime: 30, // seconds
    speakTime: 60, // seconds
  }
];

const SpeakingPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.exam);
  const { openaiApiKey, openaiApiUrl, openaiModel, whisperModel } = useSelector(state => state.settings);
  
  // Local state
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [tasks, setTasks] = useState(mockSpeakingTasks);
  const [phase, setPhase] = useState('intro'); // intro, prep, speak, review
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);
  const timerRef = useRef(null);
  
  const currentTask = tasks[currentTaskIndex];
  
  // Timer effect
  useEffect(() => {
    if (phase === 'prep' || phase === 'speak') {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            
            // Auto transition from prep to speak
            if (phase === 'prep') {
              startSpeaking();
            } 
            // Auto stop recording when time is up
            else if (phase === 'speak' && isRecording) {
              stopRecording();
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [phase, isRecording]);
  
  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  // Format time remaining
  const formatTime = (seconds) => {
    return `${seconds.toString().padStart(2, '0')}`;
  };
  
  // Start preparation phase
  const startPrep = () => {
    setPhase('prep');
    setTimeRemaining(currentTask.prepTime);
    setTranscript('');
    setAnalysis('');
    setAudioBlob(null);
    setAudioUrl(null);
  };
  
  // Start speaking phase
  const startSpeaking = () => {
    setPhase('speak');
    setTimeRemaining(currentTask.speakTime);
    startRecording();
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        
        // Stop all tracks of the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('录音时出错:', error);
      message.error('无法访问麦克风，请检查权限设置');
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setPhase('review');
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  // Play recorded audio
  const playAudio = () => {
    if (audioPlayerRef.current && audioUrl) {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };
  
  // Pause recorded audio
  const pauseAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  // Handle audio ended
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  // Transcribe speech using Whisper
  const transcribeSpeechHandler = async () => {
    if (!openaiApiKey) {
      message.error('请先在设置中配置OpenAI API密钥');
      return;
    }
    
    if (!audioBlob) {
      message.warning('请先录制语音');
      return;
    }
    
    setIsTranscribing(true);
    
    try {
      const result = await transcribeSpeech(audioBlob, openaiApiKey, openaiApiUrl, whisperModel);
      setTranscript(result);
      message.success('转录完成');
    } catch (error) {
      console.error('转录语音时出错:', error);
      message.error(`转录语音时出错: ${error.message || '未知错误'}`);
    } finally {
      setIsTranscribing(false);
    }
  };
  
  // Analyze speech
  const analyzeSpeechHandler = async () => {
    if (!openaiApiKey) {
      message.error('请先在设置中配置OpenAI API密钥');
      return;
    }
    
    if (!transcript) {
      message.warning('请先转录语音');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const prompt = `
        请分析以下托福口语回答，并提供详细的评分和反馈。评估以下几个方面：
        1. 内容完整性（0-5分）
        2. 语言使用（0-5分）
        3. 发音和语调（0-5分）
        4. 流利度（0-5分）
        
        请提供具体的改进建议。总分计算为各项得分之和。
        
        问题：${currentTask.prompt}
        
        口语回答内容：
        ${transcript}
      `;
      
      const result = await analyzeSpeaking(transcript, prompt, openaiApiKey, openaiApiUrl, openaiModel);
      setAnalysis(result);
      message.success('分析完成');
    } catch (error) {
      console.error('分析口语时出错:', error);
      message.error(`分析口语时出错: ${error.message || '未知错误'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Go to next task
  const goToNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setPhase('intro');
      
      // Clean up
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioBlob(null);
      setAudioUrl(null);
      setTranscript('');
      setAnalysis('');
    }
  };
  
  // Go to previous task
  const goToPrevTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
      setPhase('intro');
      
      // Clean up
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioBlob(null);
      setAudioUrl(null);
      setTranscript('');
      setAnalysis('');
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
              <AudioOutlined /> 口语练习
            </Title>
            
            {(phase === 'prep' || phase === 'speak') && (
              <Affix offsetTop={10} style={{ position: 'absolute', right: 24 }}>
                <Card size="small">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ClockCircleOutlined style={{ marginRight: 8, color: timeRemaining < 5 ? '#ff4d4f' : '#1890ff' }} />
                    <Text strong style={{ color: timeRemaining < 5 ? '#ff4d4f' : '#1890ff' }}>
                      {formatTime(timeRemaining)}
                    </Text>
                  </div>
                </Card>
              </Affix>
            )}
          </div>
        </Col>
        
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{currentTask.title}</span>
                <Text type="secondary">任务 {currentTaskIndex + 1} / {tasks.length}</Text>
              </div>
            }
          >
            <Paragraph>{currentTask.prompt}</Paragraph>
            
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                准备时间: {currentTask.prepTime} 秒 | 回答时间: {currentTask.speakTime} 秒
              </Text>
            </div>
            
            {phase === 'intro' && (
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ClockCircleOutlined />}
                  onClick={startPrep}
                >
                  开始准备
                </Button>
              </div>
            )}
            
            {phase === 'prep' && (
              <div style={{ marginTop: 24 }}>
                <Alert
                  message="准备阶段"
                  description={`请在 ${currentTask.prepTime} 秒内准备您的回答。时间结束后将自动开始录音。`}
                  type="info"
                  showIcon
                />
                
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Progress 
                    type="circle" 
                    percent={Math.round(((currentTask.prepTime - timeRemaining) / currentTask.prepTime) * 100)} 
                    format={() => formatTime(timeRemaining)}
                    status={timeRemaining < 5 ? "exception" : "active"}
                    width={120}
                  />
                </div>
                
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Button 
                    type="primary" 
                    onClick={startSpeaking}
                  >
                    跳过准备
                  </Button>
                </div>
              </div>
            )}
            
            {phase === 'speak' && (
              <div style={{ marginTop: 24 }}>
                <Alert
                  message={isRecording ? "正在录音" : "回答阶段"}
                  description={`请在 ${currentTask.speakTime} 秒内完成您的回答。`}
                  type="warning"
                  showIcon
                />
                
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Progress 
                    type="circle" 
                    percent={Math.round(((currentTask.speakTime - timeRemaining) / currentTask.speakTime) * 100)} 
                    format={() => formatTime(timeRemaining)}
                    status={timeRemaining < 5 ? "exception" : "active"}
                    width={120}
                  />
                </div>
                
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  {isRecording ? (
                    <Button 
                      type="primary" 
                      danger
                      icon={<StopOutlined />}
                      onClick={stopRecording}
                    >
                      停止录音
                    </Button>
                  ) : (
                    <Button 
                      type="primary" 
                      icon={<AudioOutlined />}
                      onClick={startRecording}
                    >
                      开始录音
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {phase === 'review' && (
              <div style={{ marginTop: 24 }}>
                <Tabs defaultActiveKey="recording">
                  <TabPane 
                    tab={
                      <span>
                        <SoundOutlined /> 录音回放
                      </span>
                    } 
                    key="recording"
                  >
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <audio 
                        ref={audioPlayerRef}
                        src={audioUrl} 
                        controls={false}
                        onEnded={handleAudioEnded}
                      />
                      
                      <div style={{ marginTop: 16 }}>
                        <Space>
                          {isPlaying ? (
                            <Button 
                              icon={<PauseCircleOutlined />} 
                              onClick={pauseAudio}
                            >
                              暂停
                            </Button>
                          ) : (
                            <Button 
                              icon={<PlayCircleOutlined />} 
                              onClick={playAudio}
                              disabled={!audioUrl}
                            >
                              播放
                            </Button>
                          )}
                          
                          <Button 
                            type="primary"
                            icon={<AudioOutlined />}
                            onClick={startPrep}
                          >
                            重新录制
                          </Button>
                        </Space>
                      </div>
                    </div>
                    
                    <Divider />
                    
                    <div>
                      <Title level={4}>转录与分析</Title>
                      <Paragraph>
                        使用AI将您的口语回答转录为文字，并获取详细的评估和反馈。
                      </Paragraph>
                      
                      <Space>
                        <Button 
                          type="primary"
                          icon={<SoundOutlined />}
                          onClick={transcribeSpeechHandler}
                          loading={isTranscribing}
                          disabled={!audioBlob}
                        >
                          转录语音
                        </Button>
                        
                        <Button 
                          type="primary"
                          icon={<RobotOutlined />}
                          onClick={analyzeSpeechHandler}
                          loading={isAnalyzing}
                          disabled={!transcript}
                        >
                          AI分析
                        </Button>
                      </Space>
                      
                      {transcript && (
                        <div style={{ marginTop: 16 }}>
                          <Title level={5}>转录结果</Title>
                          <Paragraph>{transcript}</Paragraph>
                        </div>
                      )}
                      
                      {analysis && (
                        <div style={{ marginTop: 16 }}>
                          <Title level={5}>AI分析结果</Title>
                          <Paragraph>{analysis}</Paragraph>
                        </div>
                      )}
                    </div>
                  </TabPane>
                  
                  <TabPane 
                    tab={
                      <span>
                        <AudioOutlined /> 口语技巧
                      </span>
                    } 
                    key="tips"
                  >
                    <Title level={4}>托福口语应答技巧</Title>
                    
                    <List
                      bordered
                      dataSource={[
                        '直接回应问题，不要偏离主题',
                        '使用清晰的结构：引言、主体、结论',
                        '提供具体的例子和细节来支持您的观点',
                        '使用过渡词连接不同的想法',
                        '控制语速，不要说得太快或太慢',
                        '注意发音和语调，尤其是重要单词的强调',
                        '避免长时间停顿，可以使用填充词如"well"、"you know"等',
                        '练习常见的口语表达和短语',
                        '时间管理很重要，确保在规定时间内完成回答',
                        '自信地表达，即使犯错也不要停下来纠正'
                      ]}
                      renderItem={item => (
                        <List.Item>
                          <Text>{item}</Text>
                        </List.Item>
                      )}
                    />
                  </TabPane>
                </Tabs>
              </div>
            )}
          </Card>
        </Col>
        
        <Col span={24}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              icon={<LeftOutlined />}
              onClick={goToPrevTask}
              disabled={currentTaskIndex === 0}
            >
              上一题
            </Button>
            
            <Button 
              type="primary"
              icon={<RightOutlined />}
              onClick={goToNextTask}
              disabled={currentTaskIndex === tasks.length - 1}
            >
              下一题
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SpeakingPage;
