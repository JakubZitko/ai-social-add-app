import { db } from '@/lib/firebase/config';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { Project } from './types';

/**
 * Create a new project/video
 */
export async function createProject(
  userId: string,
  projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'views' | 'status'>
): Promise<string> {
  const projectRef = doc(collection(db, 'projects'));

  const project: Partial<Project> = {
    ...projectData,
    userId,
    status: 'draft',
    views: 0,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(projectRef, project);
  console.log('✅ Project created:', projectRef.id);

  return projectRef.id;
}

/**
 * Get a single project by ID
 */
export async function getProject(projectId: string): Promise<Project | null> {
  const projectRef = doc(db, 'projects', projectId);
  const projectDoc = await getDoc(projectRef);

  if (projectDoc.exists()) {
    return {
      id: projectDoc.id,
      ...projectDoc.data(),
    } as Project;
  }

  return null;
}

/**
 * Get all projects for a user
 */
export async function getUserProjects(
  userId: string,
  options?: {
    status?: Project['status'];
    limitCount?: number;
    orderByField?: 'createdAt' | 'updatedAt';
  }
): Promise<Project[]> {
  const projectsRef = collection(db, 'projects');

  let q = query(
    projectsRef,
    where('userId', '==', userId),
    orderBy(options?.orderByField || 'createdAt', 'desc')
  );

  if (options?.status) {
    q = query(q, where('status', '==', options.status));
  }

  if (options?.limitCount) {
    q = query(q, limit(options.limitCount));
  }

  const querySnapshot = await getDocs(q);

  const projects: Project[] = [];
  querySnapshot.forEach((doc) => {
    projects.push({
      id: doc.id,
      ...doc.data(),
    } as Project);
  });

  return projects;
}

/**
 * Update project status
 */
export async function updateProjectStatus(
  projectId: string,
  status: Project['status'],
  additionalData?: Partial<Project>
): Promise<void> {
  const projectRef = doc(db, 'projects', projectId);

  const updateData: any = {
    status,
    updatedAt: serverTimestamp(),
    ...additionalData,
  };

  if (status === 'completed') {
    updateData.completedAt = serverTimestamp();
  }

  await updateDoc(projectRef, updateData);
  console.log(`✅ Project ${projectId} status updated to ${status}`);
}

/**
 * Update project with generated video
 */
export async function updateProjectWithVideo(
  projectId: string,
  videoUrl: string,
  thumbnailUrl: string,
  duration: number
): Promise<void> {
  const projectRef = doc(db, 'projects', projectId);

  await updateDoc(projectRef, {
    videoUrl,
    thumbnailUrl,
    duration,
    status: 'completed',
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  console.log(`✅ Project ${projectId} updated with video URL`);
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<void> {
  const projectRef = doc(db, 'projects', projectId);
  await deleteDoc(projectRef);
  console.log(`✅ Project ${projectId} deleted`);
}

/**
 * Increment project views
 */
export async function incrementProjectViews(projectId: string): Promise<void> {
  const projectRef = doc(db, 'projects', projectId);
  const projectDoc = await getDoc(projectRef);

  if (projectDoc.exists()) {
    const currentViews = projectDoc.data().views || 0;
    await updateDoc(projectRef, {
      views: currentViews + 1,
    });
  }
}

/**
 * Get project statistics for a user
 */
export async function getProjectStats(userId: string): Promise<{
  total: number;
  completed: number;
  processing: number;
  failed: number;
  draft: number;
}> {
  const projects = await getUserProjects(userId);

  return {
    total: projects.length,
    completed: projects.filter((p) => p.status === 'completed').length,
    processing: projects.filter((p) => p.status === 'processing').length,
    failed: projects.filter((p) => p.status === 'failed').length,
    draft: projects.filter((p) => p.status === 'draft').length,
  };
}
