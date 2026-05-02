import api from './axios';

// POST /auth/signup — always registers as CUSTOMER (backend ignores role)
export const signup = (data) =>
  api.post('/auth/signup', data);

// POST /auth/login — returns token + role + name + email
export const login = (data) =>
  api.post('/auth/login', data);

// GET /auth/validate?token=...
export const validateToken = (token) =>
  api.get('/auth/validate', { params: { token } });

// GET /auth/users — admin
export const getAllUsers = () =>
  api.get('/auth/users');

// GET /auth/users/:id
export const getUserById = (id) =>
  api.get(`/auth/users/${id}`);

// PUT /auth/make-admin/:email — promote to admin
export const makeAdmin = (email) =>
  api.put(`/auth/make-admin/${email}`);
