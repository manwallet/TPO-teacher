# TPO托福教师应用

TPO托福教师是一款全方位的托福备考应用程序，专为帮助学生准备托福考试而设计。它提供了阅读、听力、口语和写作的练习模块，以及词汇学习和进度跟踪功能。

## 功能特点

### 考试练习模块

- **阅读练习**：提供托福阅读文章和问题，实时评分和反馈
- **听力练习**：模拟托福听力考试，包括对话和讲座
- **口语练习**：提供托福口语题目，支持录音和AI评估
- **写作练习**：提供托福写作题目，支持AI评估和反馈

### 词汇学习

- 词汇管理：添加、编辑、删除单词
- 学习进度跟踪：标记已掌握的单词
- 词汇分类：通过标签组织单词
- 发音功能：听取单词发音

### 学习进度跟踪

- 各项能力得分统计
- 学习时间记录
- 历史练习记录
- 进度可视化展示

### AI辅助功能

- 口语评估：使用OpenAI Whisper转录语音，使用GPT分析口语表现
- 写作评估：使用GPT分析写作内容，提供详细反馈
- 可配置API设置：支持自定义API URL和模型选择

### 个性化设置

- 语言设置：支持中文和英文
- 主题设置：浅色/深色模式
- OpenAI API配置：API密钥、API URL、模型选择
- 数据导入/导出功能

## 技术栈

- **前端**：React、React Router、Redux、Ant Design
- **后端**：Electron、Node.js
- **AI集成**：OpenAI API (GPT-4, Whisper)
- **数据存储**：Electron Store (本地数据持久化)

## 安装与运行

### 系统要求

- Node.js 14.0 或更高版本
- npm 6.0 或更高版本
- macOS 10.13 或更高版本 (也支持Windows和Linux)

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/tpo-teacher.git
cd tpo-teacher
```

2. 安装依赖

```bash
npm install
```

3. 开发模式运行

```bash
npm run dev
```

4. 构建应用程序

```bash
npm run build
```

构建完成后，可以在`dist`目录找到打包好的应用程序。

## 使用指南

### 首次使用

1. 启动应用后，首先在"设置"页面配置OpenAI API密钥和其他设置
2. 在主页面查看学习进度和推荐练习
3. 通过侧边栏导航到不同的学习模块
4. 完成练习后，系统会自动记录进度和成绩

### API配置

为了使用AI辅助功能，您需要配置OpenAI API：

1. 获取OpenAI API密钥：[https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. 在应用的"设置"页面中，填入API密钥
3. 如果使用代理或自定义API端点，可以在API URL字段中填入
4. 选择或输入自定义的GPT和Whisper模型名称

### 数据管理

- **导出数据**：在"设置"页面的"数据管理"选项卡中，可以导出所有学习数据和设置
- **导入数据**：可以导入之前导出的数据备份
- **清除数据**：重置所有设置和学习数据
- **注销账号**：永久删除账号和所有相关数据

## 文件结构

```
tpo-teacher/
├── main.js                 # Electron主进程
├── preload.js              # Electron预加载脚本
├── package.json            # 项目配置
├── public/                 # 静态资源
└── src/                    # 源代码
    ├── assets/             # 图片等资源
    ├── components/         # React组件
    │   └── layout/         # 布局组件
    ├── pages/              # 页面组件
    │   └── exam/           # 考试相关页面
    ├── redux/              # Redux状态管理
    │   ├── actions/        # Redux actions
    │   ├── reducers/       # Redux reducers
    │   └── types/          # Action类型定义
    ├── services/           # 服务层
    ├── utils/              # 工具函数
    ├── App.js              # 应用入口组件
    ├── index.js            # React入口文件
    └── index.css           # 全局样式
```

## 配置文件

用户设置存储在以下位置：

- macOS: `~/Library/Application Support/TPO Teacher/settings.json`
- Windows: `%APPDATA%\TPO Teacher\settings.json`
- Linux: `~/.config/TPO Teacher/settings.json`

## 开发者指南

### 添加新的练习内容

1. 在`src/pages/exam`目录下创建新的页面组件
2. 在`src/redux/reducers`中添加相应的reducer
3. 在`src/redux/actions`中添加相应的action
4. 在`src/App.js`中添加新的路由
5. 在`src/components/layout/AppSidebar.js`中添加导航链接

### 自定义主题

应用使用Ant Design的主题系统。要自定义主题，可以修改`src/index.js`中的主题配置。

## 许可证

MIT

## 联系方式

如有问题或建议，请联系：A107406821@gmail.com
