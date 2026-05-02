import api from './axios';

// GET /admin/dashboard
export const getDashboardStats = () =>
  api.get('/admin/dashboard');

// GET /admin/deliveries?status=&from=&to=
export const getAdminDeliveries = (status, from, to) => {
  const params = {};
  if (status) params.status = status;
  if (from) params.from = from;
  if (to) params.to = to;
  return api.get('/admin/deliveries', { params });
};

// GET /admin/deliveries/:id
export const getAdminDeliveryById = (id) =>
  api.get(`/admin/deliveries/${id}`);

// GET /admin/tracking/:trackingNumber
export const getAdminTrackingEvents = (trackingNumber) =>
  api.get(`/admin/tracking/${trackingNumber}`);

// PUT /admin/deliveries/:id/resolve
export const resolveDeliveryException = (id, data) =>
  api.put(`/admin/deliveries/${id}/resolve`, data);

// GET /admin/reports?from=YYYY-MM-DD&to=YYYY-MM-DD
export const generateReport = (from, to) =>
  api.get('/admin/reports', { params: { from, to } });
