import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Input, 
  Space, 
  List, 
  Tag, 
  Divider, 
  Modal, 
  Form,
  Select,
  Tabs,
  Progress,
  Statistic,
  message,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  BookOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined,
  SoundOutlined,
  SearchOutlined,
  FilterOutlined,
  ImportOutlined,
  ExportOutlined,
  StarOutlined,
  StarFilled
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// Mock vocabulary data
const mockVocabularies = [
  {
    id: 1,
    word: 'ubiquitous',
    phonetic: '/juːˈbɪkwɪtəs/',
    partOfSpeech: 'adjective',
    definition: 'present, appearing, or found everywhere',
    example: 'Mobile phones are now ubiquitous in modern society.',
    translation: '无处不在的',
    tags: ['academic', 'TPO 1'],
    learned: false,
    favorite: true,
    lastReviewed: '2025-03-20'
  },
  {
    id: 2,
    word: 'mitigate',
    phonetic: '/ˈmɪtɪɡeɪt/',
    partOfSpeech: 'verb',
    definition: 'make less severe, serious, or painful',
    example: 'The government took steps to mitigate the effects of the economic crisis.',
    translation: '减轻，缓和',
    tags: ['academic', 'TPO 2'],
    learned: true,
    favorite: false,
    lastReviewed: '2025-03-22'
  },
  {
    id: 3,
    word: 'pragmatic',
    phonetic: '/præɡˈmætɪk/',
    partOfSpeech: 'adjective',
    definition: 'dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations',
    example: 'We need a pragmatic approach to solving this problem.',
    translation: '务实的，实用的',
    tags: ['academic', 'TPO 3'],
    learned: false,
    favorite: true,
    lastReviewed: '2025-03-18'
  },
  {
    id: 4,
    word: 'ambiguous',
    phonetic: '/æmˈbɪɡjuəs/',
    partOfSpeech: 'adjective',
    definition: 'open to more than one interpretation; not having one obvious meaning',
    example: 'The results of the experiment were ambiguous.',
    translation: '模棱两可的，不明确的',
    tags: ['academic', 'TPO 1'],
    learned: false,
    favorite: false,
    lastReviewed: '2025-03-15'
  },
  {
    id: 5,
    word: 'resilient',
    phonetic: '/rɪˈzɪliənt/',
    partOfSpeech: 'adjective',
    definition: 'able to withstand or recover quickly from difficult conditions',
    example: 'The resilient economy quickly bounced back after the recession.',
    translation: '有弹性的，能快速恢复的',
    tags: ['academic', 'TPO 2'],
    learned: true,
    favorite: true,
    lastReviewed: '2025-03-21'
  }
];

const VocabularyPage = () => {
  const dispatch = useDispatch();
  const { vocabularies: storeVocabularies, loading } = useSelector(state => state.vocabulary);
  
  // Local state
  const [vocabularies, setVocabularies] = useState(mockVocabularies);
  const [filteredVocabularies, setFilteredVocabularies] = useState(mockVocabularies);
  const [searchText, setSearchText] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [filterLearned, setFilterLearned] = useState('all');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentVocabulary, setCurrentVocabulary] = useState(null);
  const [form] = Form.useForm();
  
  // Get all unique tags
  const allTags = [...new Set(vocabularies.flatMap(vocab => vocab.tags))];
  
  // Filter vocabularies based on search text, tag, and learned status
  useEffect(() => {
    let filtered = [...vocabularies];
    
    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(vocab => 
        vocab.word.toLowerCase().includes(searchText.toLowerCase()) ||
        vocab.definition.toLowerCase().includes(searchText.toLowerCase()) ||
        vocab.translation.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Filter by tag
    if (filterTag !== 'all') {
      filtered = filtered.filter(vocab => vocab.tags.includes(filterTag));
    }
    
    // Filter by learned status
    if (filterLearned === 'learned') {
      filtered = filtered.filter(vocab => vocab.learned);
    } else if (filterLearned === 'unlearned') {
      filtered = filtered.filter(vocab => !vocab.learned);
    }
    
    setFilteredVocabularies(filtered);
  }, [vocabularies, searchText, filterTag, filterLearned]);
  
  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
  };
  
  // Handle tag filter change
  const handleTagFilterChange = (value) => {
    setFilterTag(value);
  };
  
  // Handle learned filter change
  const handleLearnedFilterChange = (value) => {
    setFilterLearned(value);
  };
  
  // Show add vocabulary modal
  const showAddModal = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };
  
  // Show edit vocabulary modal
  const showEditModal = (vocabulary) => {
    setCurrentVocabulary(vocabulary);
    form.setFieldsValue({
      ...vocabulary,
      tags: vocabulary.tags.join(',')
    });
    setIsEditModalVisible(true);
  };
  
  // Handle modal cancel
  const handleModalCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  };
  
  // Handle add vocabulary
  const handleAddVocabulary = (values) => {
    const tags = values.tags.split(',').map(tag => tag.trim());
    
    const newVocabulary = {
      id: vocabularies.length + 1,
      ...values,
      tags,
      learned: false,
      favorite: false,
      lastReviewed: new Date().toISOString().split('T')[0]
    };
    
    setVocabularies([...vocabularies, newVocabulary]);
    setIsAddModalVisible(false);
    message.success('单词添加成功');
  };
  
  // Handle edit vocabulary
  const handleEditVocabulary = (values) => {
    const tags = values.tags.split(',').map(tag => tag.trim());
    
    const updatedVocabularies = vocabularies.map(vocab => 
      vocab.id === currentVocabulary.id 
        ? { ...vocab, ...values, tags } 
        : vocab
    );
    
    setVocabularies(updatedVocabularies);
    setIsEditModalVisible(false);
    message.success('单词更新成功');
  };
  
  // Handle delete vocabulary
  const handleDeleteVocabulary = (id) => {
    const updatedVocabularies = vocabularies.filter(vocab => vocab.id !== id);
    setVocabularies(updatedVocabularies);
    message.success('单词删除成功');
  };
  
  // Toggle learned status
  const toggleLearned = (id) => {
    const updatedVocabularies = vocabularies.map(vocab => 
      vocab.id === id 
        ? { ...vocab, learned: !vocab.learned, lastReviewed: new Date().toISOString().split('T')[0] } 
        : vocab
    );
    
    setVocabularies(updatedVocabularies);
  };
  
  // Toggle favorite status
  const toggleFavorite = (id) => {
    const updatedVocabularies = vocabularies.map(vocab => 
      vocab.id === id 
        ? { ...vocab, favorite: !vocab.favorite } 
        : vocab
    );
    
    setVocabularies(updatedVocabularies);
  };
  
  // Speak word using browser's speech synthesis
  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      message.warning('您的浏览器不支持语音合成');
    }
  };
  
  // Calculate statistics
  const totalWords = vocabularies.length;
  const learnedWords = vocabularies.filter(vocab => vocab.learned).length;
  const learnedPercentage = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;
  const favoriteWords = vocabularies.filter(vocab => vocab.favorite).length;
  
  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={2}>
            <BookOutlined /> 词汇学习
          </Title>
        </Col>
        
        {/* Statistics Cards */}
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="总词汇量" 
              value={totalWords} 
              prefix={<BookOutlined />} 
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="已掌握" 
              value={learnedWords} 
              suffix={`/ ${totalWords}`} 
              prefix={<CheckCircleOutlined />} 
            />
            <Progress percent={learnedPercentage} status="active" />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="收藏单词" 
              value={favoriteWords} 
              prefix={<StarFilled style={{ color: '#faad14' }} />} 
            />
          </Card>
        </Col>
        
        {/* Search and Filters */}
        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Search
                  placeholder="搜索单词、释义或翻译"
                  allowClear
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                />
              </Col>
              
              <Col xs={24} md={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="按标签筛选"
                  onChange={handleTagFilterChange}
                  defaultValue="all"
                >
                  <Option value="all">所有标签</Option>
                  {allTags.map(tag => (
                    <Option key={tag} value={tag}>{tag}</Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} md={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="按学习状态筛选"
                  onChange={handleLearnedFilterChange}
                  defaultValue="all"
                >
                  <Option value="all">所有单词</Option>
                  <Option value="learned">已掌握</Option>
                  <Option value="unlearned">未掌握</Option>
                </Select>
              </Col>
              
              <Col xs={24} md={4}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={showAddModal}
                  style={{ width: '100%' }}
                >
                  添加单词
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        
        {/* Vocabulary List */}
        <Col span={24}>
          <Card title={`词汇列表 (${filteredVocabularies.length})`}>
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                pageSize: 10,
                showSizeChanger: false
              }}
              dataSource={filteredVocabularies}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  actions={[
                    <Tooltip title="发音">
                      <Button 
                        icon={<SoundOutlined />} 
                        onClick={() => speakWord(item.word)}
                      />
                    </Tooltip>,
                    <Tooltip title={item.learned ? "标记为未掌握" : "标记为已掌握"}>
                      <Button 
                        icon={item.learned ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CheckCircleOutlined />} 
                        onClick={() => toggleLearned(item.id)}
                      />
                    </Tooltip>,
                    <Tooltip title={item.favorite ? "取消收藏" : "收藏"}>
                      <Button 
                        icon={item.favorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />} 
                        onClick={() => toggleFavorite(item.id)}
                      />
                    </Tooltip>,
                    <Tooltip title="编辑">
                      <Button 
                        icon={<EditOutlined />} 
                        onClick={() => showEditModal(item)}
                      />
                    </Tooltip>,
                    <Tooltip title="删除">
                      <Popconfirm
                        title="确定要删除这个单词吗？"
                        onConfirm={() => handleDeleteVocabulary(item.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong style={{ fontSize: '18px' }}>{item.word}</Text>
                        <Text type="secondary">{item.phonetic}</Text>
                        <Tag color="blue">{item.partOfSpeech}</Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        {item.tags.map(tag => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                        {item.learned && <Tag color="success">已掌握</Tag>}
                      </Space>
                    }
                  />
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Text strong>定义：</Text>
                      <Paragraph>{item.definition}</Paragraph>
                    </Col>
                    <Col span={24}>
                      <Text strong>例句：</Text>
                      <Paragraph>{item.example}</Paragraph>
                    </Col>
                    <Col span={24}>
                      <Text strong>翻译：</Text>
                      <Paragraph>{item.translation}</Paragraph>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Add Vocabulary Modal */}
      <Modal
        title="添加新单词"
        visible={isAddModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddVocabulary}
        >
          <Form.Item
            name="word"
            label="单词"
            rules={[{ required: true, message: '请输入单词' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="phonetic"
            label="音标"
          >
            <Input placeholder="例如: /ˈsæmpəl/" />
          </Form.Item>
          
          <Form.Item
            name="partOfSpeech"
            label="词性"
            rules={[{ required: true, message: '请选择词性' }]}
          >
            <Select>
              <Option value="noun">名词 (noun)</Option>
              <Option value="verb">动词 (verb)</Option>
              <Option value="adjective">形容词 (adjective)</Option>
              <Option value="adverb">副词 (adverb)</Option>
              <Option value="preposition">介词 (preposition)</Option>
              <Option value="conjunction">连词 (conjunction)</Option>
              <Option value="pronoun">代词 (pronoun)</Option>
              <Option value="interjection">感叹词 (interjection)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="definition"
            label="定义"
            rules={[{ required: true, message: '请输入定义' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          
          <Form.Item
            name="example"
            label="例句"
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          
          <Form.Item
            name="translation"
            label="翻译"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="tags"
            label="标签"
            help="多个标签请用逗号分隔，例如: academic,TPO 1"
          >
            <Input />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              添加
            </Button>
            <Button onClick={handleModalCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Edit Vocabulary Modal */}
      <Modal
        title="编辑单词"
        visible={isEditModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditVocabulary}
        >
          <Form.Item
            name="word"
            label="单词"
            rules={[{ required: true, message: '请输入单词' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="phonetic"
            label="音标"
          >
            <Input placeholder="例如: /ˈsæmpəl/" />
          </Form.Item>
          
          <Form.Item
            name="partOfSpeech"
            label="词性"
            rules={[{ required: true, message: '请选择词性' }]}
          >
            <Select>
              <Option value="noun">名词 (noun)</Option>
              <Option value="verb">动词 (verb)</Option>
              <Option value="adjective">形容词 (adjective)</Option>
              <Option value="adverb">副词 (adverb)</Option>
              <Option value="preposition">介词 (preposition)</Option>
              <Option value="conjunction">连词 (conjunction)</Option>
              <Option value="pronoun">代词 (pronoun)</Option>
              <Option value="interjection">感叹词 (interjection)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="definition"
            label="定义"
            rules={[{ required: true, message: '请输入定义' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          
          <Form.Item
            name="example"
            label="例句"
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          
          <Form.Item
            name="translation"
            label="翻译"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="tags"
            label="标签"
            help="多个标签请用逗号分隔，例如: academic,TPO 1"
          >
            <Input />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              保存
            </Button>
            <Button onClick={handleModalCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VocabularyPage;
