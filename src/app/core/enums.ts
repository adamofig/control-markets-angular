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
  Whisper: {
    TranscribeBytes: 'api/whisper/transcribe-bytes',
  },
  Vertex: {
    tts: 'api/vertex/tts/synthesize',
  },
  Admin: {
    Claims: 'api/admin/claims', // :email
  },
  Tools: {
    DownloadYoutubeSong: 'api/tools/download-youtube-song',
  },
  AgentCard: {
    TranslateConversation: 'api/conversation_card/translate',
    Card: 'api/agent-cards',
    ConversationQuery: 'api/agent-cards/query',
    Chat: 'api/agent-cards/chat',
    ListModels: 'api/agent-cards/list_models',
    Whisper: 'api/agent-cards/whisper',
  },

  VideoGenerators: {
    VideoGenerator: 'video-generator',
    VideoGeneratorsFiltered: 'video-generator/query',
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
    Save: 'api/lesson/lesson',
    Main: 'api/lesson',
    QueryLessons: 'api/lesson/query',
  },

  Sources: {
    Source: 'api/agent-sources',
    QuerySources: 'api/agent-sources/query',
    YoutubeTranscript: 'api/agent-sources/youtube-transcript',
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
