export enum RouteNames {
  Page = 'page',
  Home = 'home',
  Profile = 'profile',
  SubscriptionPlan = 'plan',
  Words = 'my-words',
  Phrases = 'my-phrases',
  Verbs = 'my-verbs',
  Chat = 'my-chat',
  Scenarios = 'escenarios',
  Topics = 'topics',
  Lessons = 'lecciones',
  Info = 'informacion',
  // TODO quiza debo quitar CreateLesson de aquí
  CreateLesson = 'create-lesson',
  Admin = 'admin',
  Teacher = 'teacher',
  VoiceDictation = 'dictado',
  Discovery = 'ejemplos',
  Signup = 'signup',
  Signin = 'signin',
  Terms = 'terms',
  Main = 'main',
  Auth = 'auth',
  Stack = 'stack',
  ConversationDetails = 'conversation-details',
}

export const Endpoints = {
  GetUser: 'api/user',
  PostUser: 'api/user',
  AdminUser: 'api/admin/user',
  Generics: {
    Generics: 'api/generics',
    GenericsFiltered: 'api/generics/query',
  },
  Admin: {
    Claims: 'api/admin/claims', // :email
  },
  Tools: {
    DownloadYoutubeSong: 'api/tools/download-youtube-song',
  },
  ConversationCard: {
    TranslateConversation: 'api/conversation_card/translate',
    Conversation: 'api/conversation-ai-cards/conversation',
    ConversationQuery: 'api/conversation-ai-cards/conversation/query',
    AgentChat: 'api/conversation/agent/chat',
    ListModels: 'api/conversation/agent/list_models',
    Whisper: 'api/conversation/whisper',
  },

  VideoGenerators: {
    VideoGenerator: 'api/video-generator',
    VideoGeneratorsFiltered: 'api/video-generator/query',
  },

  Tasks: {
    Task: 'api/agent-tasks', // GET
    List: 'api/agent-tasks', // GET
    Save: 'api/agent-tasks', // POST
    Execute: 'api/agent-tasks/execute', // GET /:ID
    Query: 'api/agent-tasks/query', // GET
  },
  Jobs: {
    ByTask: 'api/agent-jobs/task', // GET /:ID
    Job: 'api/agent-jobs', // GET
    List: 'api/agent-jobs', // GET
    Save: 'api/agent-jobs', // POST
    Execute: 'api/agent-jobs/execute', // GET /:ID
  },
  Notion: {
    ListDBs: 'api/notion/list-databases',
    ListPages: 'api/notion/list-pages',
    Save: 'api/notion/save', // POST
    CreatePage: 'api/notion-agent-tasks/create-agent-page', // Get :id
    PageInSpecificFormat: 'api/notion/page-in-specific-format', // Get /{pageId}
  },

  Lessons: {
    Lesson: 'api/lessonv2/lesson',
    QueryLessons: 'api/lessonv2/query',
  },

  Sources: {
    Source: 'api/sources-llm',
    QuerySources: 'api/sources-llm/query',
    YoutubeTranscript: 'api/sources-llm/youtube-transcript',
    Notion: {
      ListDBs: 'api/notion/list-dbs',
      ListPages: 'api/notion/list-pages',
      CreatePage: 'api/notion/create-page',
      PageInSpecificFormat: 'api/notion/page-in-specific-format', // Get /{pageId}
    },
  },

  VideoAnalysis: {
    TiktokData: 'api/video-analizer/tiktok/data',
  },
};

export enum AppHttpCode {
  GoodRefreshToken = 211,
  ErrorRefreshToken = 411,
}
