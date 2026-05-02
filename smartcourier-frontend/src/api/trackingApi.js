import api from './axios';

// POST /tracking/documents/upload (Multipart)
export const uploadParcelDocument = (file, deliveryId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('deliveryId', deliveryId);

  return api.post('/tracking/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// GET /tracking/documents/:deliveryId
export const getDocuments = (deliveryId) =>
  api.get(`/tracking/documents/${deliveryId}`);

// GET /tracking/documents/download/:id (returns blob)
export const downloadDocument = (docId) =>
  api.get(`/tracking/documents/download/${docId}`, {
    responseType: 'blob',
  });

// GET /tracking/:trackingNumber
export const getTrackingEvents = (trackingNumber) =>
  api.get(`/tracking/${trackingNumber}`);

// POST /tracking/events
export const createTrackingEvent = (eventData) =>
  api.post('/tracking/events', eventData);
