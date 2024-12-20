import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/todos`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTodos = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch todos');
  }
};

export const getTodoById = async (todoId) => {
  try {
    const response = await api.get(`/${todoId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch todo');
  }
};

export const createTodo = async (newTodo) => {
  try {
    const response = await api.post('/', newTodo);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create todo');
  }
};

export const updateTodo = async (updatedTodo) => {
  try {
    const response = await api.put(`/`, {
      _id: updatedTodo.id,
      progress: updatedTodo.progress,
      name: updatedTodo.name,
      description: updatedTodo.description,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update todo');
  }
};

export const deleteTodo = async (todoId) => {
  try {
    const response = await api.delete(`/${todoId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete todo');
  }
};
