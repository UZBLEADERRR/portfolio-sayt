// Shared data store using localStorage
// Portfolio website reads this data to display dynamic content

export interface ResumeItem {
  id: string;
  role: string;
  company: string;
  startYear: string;
  endYear: string;
  description: string;
  isPresent: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tech: string;
  url: string;
  imageUrl: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  lessons: number;
  hasCertificate: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  icon: string;
  details: string[];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface AISettings {
  systemPrompt: string;
  greeting: string;
  knowledgeBase: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sessionId: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

// Default data
const DEFAULT_RESUME: ResumeItem[] = [
  { id: '1', role: 'Senior Frontend Developer', company: 'Tech Company 1', startYear: '2023', endYear: '', description: 'Katta hajmdagi loyihalarni boshqarish va jamoa bilan ishlash tajribasi.', isPresent: true },
  { id: '2', role: 'Frontend Developer', company: 'Tech Company 2', startYear: '2022', endYear: '2023', description: 'React, TypeScript va Node.js texnologiyalaridan foydalanish.', isPresent: false },
  { id: '3', role: 'Junior Developer', company: 'Tech Company 3', startYear: '2021', endYear: '2022', description: 'Web dasturlash asoslarini o\'rganish va amaliy tajriba orttirish.', isPresent: false },
];

const DEFAULT_PROJECTS: ProjectItem[] = [
  { id: '1', title: 'E-commerce Platform', description: 'Full-stack online do\'kon', tech: 'React, Node.js, MongoDB', url: '#', imageUrl: '' },
  { id: '2', title: 'CRM System', description: 'Mijozlar boshqaruv tizimi', tech: 'React, TypeScript, Firebase', url: '#', imageUrl: '' },
  { id: '3', title: '3D Portfolio', description: 'Three.js bilan portfolio', tech: 'React, Three.js, TailwindCSS', url: '#', imageUrl: '' },
];

const DEFAULT_SERVICES: ServiceItem[] = [
  { id: '1', title: 'Web Development', description: 'Modern va tezkor veb saytlar', icon: 'Globe' },
  { id: '2', title: 'Mobile Apps', description: 'iOS va Android ilovalar', icon: 'Smartphone' },
  { id: '3', title: 'UI/UX Design', description: 'Foydalanuvchi uchun qulay dizayn', icon: 'Palette' },
  { id: '4', title: 'Backend Systems', description: 'Node.js va Python arxitekturasi', icon: 'Database' },
];

const DEFAULT_COURSES: CourseItem[] = [
  { id: '1', title: 'Frontend Masterclass 1', description: 'React va zamonaviy texnologiyalar', lessons: 24, hasCertificate: true },
  { id: '2', title: 'Frontend Masterclass 2', description: 'TypeScript va Next.js', lessons: 18, hasCertificate: true },
  { id: '3', title: 'Frontend Masterclass 3', description: 'Three.js va 3D Web', lessons: 12, hasCertificate: false },
];

const DEFAULT_STATS: StatItem[] = [
  { id: '1', value: '3+', label: 'Yil Tajriba', icon: 'Briefcase', details: ['Frontend Development', 'UI/UX Design', 'Backend Node.js'] },
  { id: '2', value: '15+', label: 'Loyihalar', icon: 'FolderKanban', details: ['E-commerce platforma', 'CRM tizimlar', 'Portfolio saytlar'] },
  { id: '3', value: '8+', label: 'Mijozlar', icon: 'Users', details: ['Mahalliy korxonalar', 'Xalqaro startaplar', 'Agentliklar'] },
  { id: '4', value: '4', label: 'Sertifikatlar', icon: 'Award', details: ['Google UX Design', 'Meta Front-End', 'AWS Cloud', 'IELTS'] },
];

const DEFAULT_SOCIALS: SocialLink[] = [
  { id: '1', platform: 'Instagram', url: '#', icon: 'Instagram' },
  { id: '2', platform: 'Telegram', url: '#', icon: 'Send' },
  { id: '3', platform: 'Email', url: 'mailto:example@email.com', icon: 'Mail' },
  { id: '4', platform: 'Phone', url: 'tel:+998901234567', icon: 'Phone' },
  { id: '5', platform: 'GitHub', url: '#', icon: 'Github' },
  { id: '6', platform: 'LinkedIn', url: '#', icon: 'Linkedin' },
];

const DEFAULT_AI_SETTINGS: AISettings = {
  systemPrompt: `Sen Sarvarning shaxsiy AI yordamchisisan. Sen portfolio saytida joylashgansan.
Sarvar - professional frontend developer, 3+ yil tajribaga ega.
U React, TypeScript, Node.js, Three.js, va boshqa zamonaviy texnologiyalar bilan ishlaydi.
Sen mehribon, professional va yordam berishga tayyor bo'lishingiz kerak.`,
  greeting: 'Salom! Men Sarvarning AI yordamchisiman. Sizga qanday yordam bera olaman?',
  knowledgeBase: '',
};

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  password: 'sarvar2024',
};

// Helper functions
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(`admin_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(`admin_${key}`, JSON.stringify(value));
}

// Data accessors
export const store = {
  // Resume
  getResume: (): ResumeItem[] => getItem('resume', DEFAULT_RESUME),
  setResume: (data: ResumeItem[]) => setItem('resume', data),

  // Projects
  getProjects: (): ProjectItem[] => getItem('projects', DEFAULT_PROJECTS),
  setProjects: (data: ProjectItem[]) => setItem('projects', data),

  // Services
  getServices: (): ServiceItem[] => getItem('services', DEFAULT_SERVICES),
  setServices: (data: ServiceItem[]) => setItem('services', data),

  // Courses
  getCourses: (): CourseItem[] => getItem('courses', DEFAULT_COURSES),
  setCourses: (data: CourseItem[]) => setItem('courses', data),

  // Stats
  getStats: (): StatItem[] => getItem('stats', DEFAULT_STATS),
  setStats: (data: StatItem[]) => setItem('stats', data),

  // Social Links
  getSocials: (): SocialLink[] => getItem('socials', DEFAULT_SOCIALS),
  setSocials: (data: SocialLink[]) => setItem('socials', data),

  // Blog
  getBlog: (): BlogPost[] => getItem('blog', []),
  setBlog: (data: BlogPost[]) => setItem('blog', data),

  // AI Settings
  getAISettings: (): AISettings => getItem('ai_settings', DEFAULT_AI_SETTINGS),
  setAISettings: (data: AISettings) => setItem('ai_settings', data),

  // Chat History
  getChatHistory: (): ChatMessage[] => getItem('chat_history', []),
  setChatHistory: (data: ChatMessage[]) => setItem('chat_history', data),

  // Credentials
  getCredentials: (): AdminCredentials => getItem('credentials', DEFAULT_CREDENTIALS),
  setCredentials: (data: AdminCredentials) => setItem('credentials', data),

  // Auth state
  isAuthenticated: (): boolean => sessionStorage.getItem('admin_auth') === 'true',
  setAuth: (val: boolean) => {
    if (val) sessionStorage.setItem('admin_auth', 'true');
    else sessionStorage.removeItem('admin_auth');
  },
};
