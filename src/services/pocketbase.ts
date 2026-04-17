// PocketBase client integration for Edenify PWA
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Auth helpers
export const signIn = async (email: string, password: string) => {
  return pb.collection('users').authWithPassword(email, password);
};

export const signOut = () => pb.authStore.clear();

export const getCurrentUser = () => pb.authStore.model;

// CRUD helpers (example: tasks)
export const fetchTasks = async (page = 1, perPage = 20, filter = '') => {
  return pb.collection('tasks').getList(page, perPage, { filter });
};

export const createTask = async (data: any) => {
  return pb.collection('tasks').create(data);
};

export const updateTask = async (id: string, data: any) => {
  return pb.collection('tasks').update(id, data);
};

export const deleteTask = async (id: string) => {
  return pb.collection('tasks').delete(id);
};

export default pb;
