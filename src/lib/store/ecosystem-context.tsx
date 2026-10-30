'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Department,
  Website,
  Project,
  Task,
  Announcement,
  DocumentItem,
  MentalHealthResource,
  YouthVoiceSubmission,
  AuditLog,
} from '@/types';
import {
  initialDepartments,
  initialWebsites,
  initialProjects,
  initialTasks,
  initialAnnouncements,
  initialDocuments,
  initialMentalHealthResources,
  initialYouthVoices,
  initialAuditLogs,
} from '@/lib/store/tk-store';
import { useAuth } from '@/lib/auth/auth-context';

interface EcosystemContextType {
  departments: Department[];
  websites: Website[];
  projects: Project[];
  tasks: Task[];
  announcements: Announcement[];
  documents: DocumentItem[];
  resources: MentalHealthResource[];
  youthVoices: YouthVoiceSubmission[];
  auditLogs: AuditLog[];

  // Department actions
  updateDepartment: (dept: Department) => void;

  // Website actions
  addWebsite: (site: Partial<Website>) => void;
  updateWebsite: (site: Website) => void;
  toggleWebsiteStatus: (id: string) => void;

  // Project & Task actions
  addProject: (proj: Partial<Project>) => void;
  updateProjectProgress: (id: string, progress: number, status?: Project['status']) => void;
  addTask: (task: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  deleteTask: (id: string) => void;

  // Announcement actions
  addAnnouncement: (ann: Partial<Announcement>) => void;

  // Document actions
  addDocument: (doc: Partial<DocumentItem>) => void;
  recordDocumentDownload: (id: string) => void;

  // Mental Health & Voice actions
  addYouthVoiceSubmission: (item: Partial<YouthVoiceSubmission>) => void;
  approveYouthVoice: (id: string) => void;
  likeYouthVoice: (id: string) => void;

  // Log action
  logAction: (action: string, entityType: string, details: string, entityId?: string) => void;
}

const EcosystemContext = createContext<EcosystemContextType | undefined>(undefined);

export const EcosystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [departments, setDepartments] = useState<Department[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tk_departments');
      if (saved) try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialDepartments;
  });

  const [websites, setWebsites] = useState<Website[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tk_websites');
      if (saved) try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialWebsites;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tk_projects');
      if (saved) try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialProjects;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tk_tasks');
      if (saved) try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialTasks;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tk_announcements');
      if (saved) try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialAnnouncements;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tk_documents');
      if (saved) try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialDocuments;
  });

  const [resources] = useState<MentalHealthResource[]>(initialMentalHealthResources);

  const [youthVoices, setYouthVoices] = useState<YouthVoiceSubmission[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tk_youth_voices');
      if (saved) try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialYouthVoices;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tk_audit_logs');
      if (saved) try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialAuditLogs;
  });

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tk_departments', JSON.stringify(departments));
      localStorage.setItem('tk_websites', JSON.stringify(websites));
      localStorage.setItem('tk_projects', JSON.stringify(projects));
      localStorage.setItem('tk_tasks', JSON.stringify(tasks));
      localStorage.setItem('tk_announcements', JSON.stringify(announcements));
      localStorage.setItem('tk_documents', JSON.stringify(documents));
      localStorage.setItem('tk_youth_voices', JSON.stringify(youthVoices));
      localStorage.setItem('tk_audit_logs', JSON.stringify(auditLogs));
    }
  }, [departments, websites, projects, tasks, announcements, documents, youthVoices, auditLogs]);

  const logAction = (action: string, entityType: string, details: string, entityId?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user_name: currentUser.full_name,
      user_role: currentUser.role,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const updateDepartment = (dept: Department) => {
    setDepartments(prev => prev.map(d => d.id === dept.id ? dept : d));
    logAction('UPDATE_DEPARTMENT', 'departments', `Updated details for ${dept.name}`, dept.id);
  };

  const addWebsite = (siteData: Partial<Website>) => {
    const newSite: Website = {
      id: `site-${Date.now()}`,
      slug: siteData.slug || `site-${Date.now()}`,
      title: siteData.title || 'Untitled TK Portal',
      tagline: siteData.tagline || 'Empowering Filipino Youth',
      description: siteData.description || '',
      department_id: siteData.department_id,
      department_name: siteData.department_name,
      primary_color: siteData.primary_color || '#31556B',
      accent_color: siteData.accent_color || '#DCEAF7',
      status: siteData.status || 'draft',
      url_path: siteData.url_path || `/${siteData.slug}`,
      nav_links: siteData.nav_links || [{ label: 'Home', href: `/${siteData.slug}` }],
      pages_count: 1,
      created_at: new Date().toISOString(),
    };
    setWebsites(prev => [...prev, newSite]);
    logAction('CREATE_WEBSITE', 'websites', `Registered new portal: ${newSite.title}`, newSite.id);
  };

  const updateWebsite = (site: Website) => {
    setWebsites(prev => prev.map(s => s.id === site.id ? site : s));
    logAction('UPDATE_WEBSITE', 'websites', `Updated configuration for ${site.title}`, site.id);
  };

  const toggleWebsiteStatus = (id: string) => {
    setWebsites(prev => prev.map(site => {
      if (site.id === id) {
        const nextStatus = site.status === 'published' ? 'draft' : 'published';
        logAction('TOGGLE_WEBSITE_STATUS', 'websites', `Changed ${site.title} status to ${nextStatus}`, site.id);
        return { ...site, status: nextStatus };
      }
      return site;
    }));
  };

  const addProject = (projData: Partial<Project>) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      department_id: projData.department_id || 'dept-admin',
      department_name: projData.department_name || 'Main Administration Office',
      title: projData.title || 'New Initiative',
      code: projData.code || `TK-${Math.floor(100 + Math.random() * 900)}`,
      description: projData.description || '',
      lead_id: currentUser.id,
      lead_name: projData.lead_name || currentUser.full_name,
      status: projData.status || 'planning',
      priority: projData.priority || 'medium',
      progress: projData.progress || 0,
      start_date: projData.start_date || new Date().toISOString().split('T')[0],
      due_date: projData.due_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      budget_notes: projData.budget_notes || 'Allocated from youth operating budget',
      tasks_count: 0,
      completed_tasks_count: 0,
      created_at: new Date().toISOString(),
    };
    setProjects(prev => [newProj, ...prev]);
    logAction('CREATE_PROJECT', 'projects', `Created initiative: ${newProj.title}`, newProj.id);
  };

  const updateProjectProgress = (id: string, progress: number, status?: Project['status']) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const updatedStatus = status || (progress === 100 ? 'completed' : p.status);
        return { ...p, progress, status: updatedStatus };
      }
      return p;
    }));
  };

  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      project_id: taskData.project_id || 'proj-1',
      project_title: taskData.project_title || 'General Department Operations',
      department_id: taskData.department_id || 'dept-admin',
      title: taskData.title || 'Untitled Action Item',
      description: taskData.description || '',
      assigned_to: taskData.assigned_to || currentUser.id,
      assignee_name: taskData.assignee_name || currentUser.full_name,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      due_date: taskData.due_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    logAction('CREATE_TASK', 'tasks', `Assigned task: ${newTask.title}`, newTask.id);
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    logAction('UPDATE_TASK_STATUS', 'tasks', `Updated task status to ${status}`, id);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    logAction('DELETE_TASK', 'tasks', `Deleted task`, id);
  };

  const addAnnouncement = (annData: Partial<Announcement>) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      department_id: annData.department_id,
      department_name: annData.department_name,
      title: annData.title || 'Official Announcement',
      content: annData.content || '',
      target_audience: annData.target_audience || 'all_hq',
      priority: annData.priority || 'normal',
      is_pinned: Boolean(annData.is_pinned),
      created_by_name: currentUser.full_name,
      created_at: new Date().toISOString(),
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    logAction('CREATE_ANNOUNCEMENT', 'announcements', `Broadcasted: ${newAnn.title}`, newAnn.id);
  };

  const addDocument = (docData: Partial<DocumentItem>) => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      category_id: docData.category_id || 'cat-gov',
      category_name: docData.category_name || 'Governance & Policies',
      department_id: docData.department_id || 'dept-admin',
      department_name: docData.department_name || 'Main Administration Office',
      title: docData.title || 'Untitled Document',
      description: docData.description || 'Organizational document entry.',
      file_url: docData.file_url || '#',
      file_size_kb: docData.file_size_kb || 512,
      file_type: docData.file_type || 'pdf',
      access_level: docData.access_level || 'internal',
      version: docData.version || 'v1.0',
      author_name: currentUser.full_name,
      tags: docData.tags || ['General', 'TK-Document'],
      downloads_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDocuments(prev => [newDoc, ...prev]);
    logAction('UPLOAD_DOCUMENT', 'documents', `Uploaded to Knowledge Brain: ${newDoc.title}`, newDoc.id);
  };

  const recordDocumentDownload = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, downloads_count: d.downloads_count + 1 } : d));
  };

  const addYouthVoiceSubmission = (item: Partial<YouthVoiceSubmission>) => {
    const newSub: YouthVoiceSubmission = {
      id: `yv-${Date.now()}`,
      author_display_name: item.author_display_name || 'Anonymous Youth',
      age_group: item.age_group || '18-24',
      region: item.region || 'Nationwide',
      topic: item.topic || 'General Reflection',
      content: item.content || '',
      status: 'pending_review',
      likes_count: 0,
      created_at: new Date().toISOString(),
    };
    setYouthVoices(prev => [newSub, ...prev]);
  };

  const approveYouthVoice = (id: string) => {
    setYouthVoices(prev => prev.map(y => y.id === id ? { ...y, status: 'published' } : y));
    logAction('APPROVE_YOUTH_VOICE', 'youth_voices', `Approved youth story for public wall`, id);
  };

  const likeYouthVoice = (id: string) => {
    setYouthVoices(prev => prev.map(y => y.id === id ? { ...y, likes_count: y.likes_count + 1 } : y));
  };

  return (
    <EcosystemContext.Provider
      value={{
        departments,
        websites,
        projects,
        tasks,
        announcements,
        documents,
        resources,
        youthVoices,
        auditLogs,
        updateDepartment,
        addWebsite,
        updateWebsite,
        toggleWebsiteStatus,
        addProject,
        updateProjectProgress,
        addTask,
        updateTaskStatus,
        deleteTask,
        addAnnouncement,
        addDocument,
        recordDocumentDownload,
        addYouthVoiceSubmission,
        approveYouthVoice,
        likeYouthVoice,
        logAction,
      }}
    >
      {children}
    </EcosystemContext.Provider>
  );
};

export const useEcosystem = () => {
  const context = useContext(EcosystemContext);
  if (!context) {
    throw new Error('useEcosystem must be used within an EcosystemProvider');
  }
  return context;
};
