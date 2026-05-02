import api from './axios';

// POST /deliveries — create delivery (JWT user = customer)
export const createDelivery = (data) =>
  api.post('/deliveries', data);

// GET /deliveries/my — customer's own deliveries
export const getMyDeliveries = () =>
  api.get('/deliveries/my');

// GET /deliveries — admin: all deliveries (optional ?status= filter)
export const getAllDeliveries = (status) =>
  api.get('/deliveries', { params: status ? { status } : {} });

// GET /deliveries/:id
export const getDeliveryById = (id) =>
  api.get(`/deliveries/${id}`);

// PUT /deliveries/:id/status?status=... — admin only
export const updateDeliveryStatus = (id, status) =>
  api.put(`/deliveries/${id}/status`, null, { params: { status } });

// GET /deliveries/track/:trackingNumber — public tracking
export const trackDelivery = (trackingNumber) =>
  api.get(`/deliveries/track/${trackingNumber}`);
