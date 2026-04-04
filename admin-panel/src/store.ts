// API-based store — reads/writes to PostgreSQL via server API

export interface ResumeItem { id: string; role: string; company: string; startYear: string; endYear: string; description: string; isPresent: boolean; }
export interface ProjectItem { id: string; title: string; description: string; tech: string; url: string; imageUrl: string; }
export interface ServiceItem { id: string; title: string; description: string; icon: string; }
export interface CourseItem { id: string; title: string; description: string; lessons: number; hasCertificate: boolean; }
export interface BlogPost { id: string; title: string; content: string; date: string; }
export interface StatItem { id: string; value: string; label: string; icon: string; details: string[]; }
export interface SocialLink { id: string; platform: string; url: string; icon: string; }
export interface AISettings { systemPrompt: string; greeting: string; knowledgeBase: string; }
export interface MessageItem { id: string; name: string; email: string; subject: string; message: string; created_at: string; is_read: boolean; }

function getAuthHeader(): string {
  const creds = sessionStorage.getItem('admin_creds');
  return creds ? `Basic ${btoa(creds)}` : '';
}

async function apiGet(key: string) {
  try {
    const res = await fetch(key.startsWith('/') ? key : `/api/data/${key}`);
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

async function apiDelete(url: string) {
  try {
    await fetch(url, { method: 'DELETE' });
  } catch (err) { console.error('Delete error:', err); }
}

async function apiSet(key: string, data: any) {
  try {
    const res = await fetch(`/api/data/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.error(`Save failed for ${key}:`, res.status, await res.text());
    }
  } catch (err) {
    console.error('Save error:', err);
  }
}

export const store = {
  // Auth
  login: async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('admin_creds', `${username}:${password}`);
        return true;
      }
      return false;
    } catch { return false; }
  },
  
  isAuthenticated: (): boolean => {
    try {
      return sessionStorage.getItem('admin_auth') === 'true';
    } catch { return false; }
  },
  setAuth: (val: boolean) => {
    try {
      if (!val) { 
        sessionStorage.removeItem('admin_auth'); 
        sessionStorage.removeItem('admin_creds'); 
      }
    } catch (err) { console.error('Auth storage error:', err); }
  },

  // Data accessors
  getResume: (): Promise<ResumeItem[]> => apiGet('resume'),
  setResume: (d: ResumeItem[]) => apiSet('resume', d),
  getProjects: (): Promise<ProjectItem[]> => apiGet('projects'),
  setProjects: (d: ProjectItem[]) => apiSet('projects', d),
  getServices: (): Promise<ServiceItem[]> => apiGet('services'),
  setServices: (d: ServiceItem[]) => apiSet('services', d),
  getCourses: (): Promise<CourseItem[]> => apiGet('courses'),
  setCourses: (d: CourseItem[]) => apiSet('courses', d),
  getStats: (): Promise<StatItem[]> => apiGet('stats'),
  setStats: (d: StatItem[]) => apiSet('stats', d),
  getSocials: (): Promise<SocialLink[]> => apiGet('socials'),
  setSocials: (d: SocialLink[]) => apiSet('socials', d),
  getBlog: (): Promise<BlogPost[]> => apiGet('blog'),
  setBlog: (d: BlogPost[]) => apiSet('blog', d),
  getAISettings: (): Promise<AISettings> => apiGet('ai_settings') as any,
  setAISettings: (d: AISettings) => apiSet('ai_settings', d),
  getChatHistory: (): Promise<any[]> => apiGet('chat_history'),
  setChatHistory: (d: any[]) => apiSet('chat_history', d),
  
  // Messages
  getMessages: (): Promise<MessageItem[]> => apiGet('/api/messages'),
  deleteMessage: (id: string) => apiDelete(`/api/messages/${id}`),
};
