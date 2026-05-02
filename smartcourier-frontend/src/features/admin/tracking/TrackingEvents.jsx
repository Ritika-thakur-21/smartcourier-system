import React, { useState } from 'react';
import { 
  Search, Activity, Plus, Truck, MapPin, 
  AlertCircle, Loader2, Send, Clock
} from 'lucide-react';
import { getAdminTrackingEvents } from '../../../api/adminApi';
import { createTrackingEvent } from '../../../api/trackingApi';
import { format } from 'date-fns';
import Toast from '../../../shared/components/Toast';

const TrackingEvents = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    status: 'IN_TRANSIT',
    location: '',
    remarks: '',
    email: '',
    recipientType: 'RECEIVER',
    senderName: '',
    receiverName: '',
    latitude: '',
    longitude: '',
  });

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setToast({ message: 'Geolocation not supported by your browser', type: 'error' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(f => ({
          ...f,
          latitude: parseFloat(pos.coords.latitude.toFixed(6)),
          longitude: parseFloat(pos.coords.longitude.toFixed(6)),
        }));
        setToast({ message: 'GPS coordinates captured!', type: 'success' });
      },
      () => setToast({ message: 'Unable to get location. Enter manually.', type: 'error' })
    );
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    try {
      const response = await getAdminTrackingEvents(trackingNumber.trim());
      setEvents(response.data.sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime()));
    } catch (err) {
      setToast({ message: 'Tracking number not found', type: 'error' });
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!trackingNumber || !formData.location) return;

    setIsSubmitting(true);
    try {
      await createTrackingEvent({
        trackingNumber,
        ...formData,
        latitude: formData.latitude !== '' ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude !== '' ? parseFloat(formData.longitude) : null,
      });
      setToast({ message: 'Tracking event created and synced', type: 'success' });
      setFormData({ ...formData, location: '', remarks: '', latitude: '', longitude: '' });
      handleSearch();
    } catch (err) {
      setToast({ message: 'Failed to create event', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statuses = [
    'BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 
    'DELIVERED', 'DELAYED', 'FAILED', 'RETURNED'
  ];

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Track Shipment</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Search for a shipment and add tracking updates for the customer.
        </p>
      </div>

      <div className="grid grid-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="flex flex-col gap-8">
          {/* Target Selector */}
          <section className="card flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="label" style={{ margin: 0 }}>Search Parcel</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Enter a tracking number to view and update events.</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="text" 
                className="input"
                style={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                placeholder="TRKXXXXXX"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <button type="submit" className="btn-icon">
                <Search size={20} />
              </button>
            </form>
          </section>

          {/* Action Form */}
          <section className="card flex flex-col gap-6" style={{ opacity: !trackingNumber ? 0.5 : 1 }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} style={{ color: 'var(--primary)' }} /> Add Update
            </h2>

            <form onSubmit={handleCreateEvent} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="label">Status</label>
                <select 
                  className="input"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="label">Location</label>
                <input 
                  type="text"
                  required
                  className="input"
                  placeholder="e.g. Hub Center"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="label">Notify Customer (Email)</label>
                <input 
                  type="email"
                  className="input"
                  placeholder="customer@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="label">Remarks</label>
                <textarea 
                  className="input"
                  style={{ minHeight: '80px' }}
                  placeholder="Internal notes..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                />
              </div>

              {/* GPS Coordinates */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="label" style={{ margin: 0 }}>GPS Coordinates (for Map)</label>
                  <button
                    type="button"
                    onClick={handleLocateMe}
                    className="btn-ghost"
                    style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <MapPin size={12} /> Locate Me
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input
                    type="number"
                    step="any"
                    className="input"
                    placeholder="Latitude e.g. 28.6139"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                  />
                  <input
                    type="number"
                    step="any"
                    className="input"
                    placeholder="Longitude e.g. 77.2090"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                  />
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  💡 Enter coordinates or click "Locate Me" to auto-fill your current GPS position.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !trackingNumber}
                className="btn-primary"
                style={{ padding: '12px' }}
              >
                {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : 'Add Event'}
              </button>
            </form>
          </section>
        </div>

        {/* Ledger */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} style={{ color: 'var(--primary)' }} /> Event History
            </h2>
          </div>
          
          <div className="card" style={{ minHeight: '600px', padding: '0' }}>
            {isLoading ? (
              <div style={{ height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyCenter: 'center', gap: '16px' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Accessing Database...</p>
              </div>
            ) : !trackingNumber ? (
              <div style={{ height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)', gap: '16px' }}>
                <Clock size={48} />
                <div>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-main)' }}>No Shipment Selected</p>
                  <p style={{ fontSize: '14px' }}>Enter a tracking number to view operational history.</p>
                </div>
              </div>
            ) : events.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                 <AlertCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                 <p>No events recorded yet.</p>
              </div>
            ) : (
              <div style={{ borderBottom: '1px solid var(--border)' }}>
                {events.map((e, i) => (
                  <div key={e.id} style={{ padding: '24px', borderTop: i > 0 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
                    <div className="flex gap-4">
                      <div 
                        style={{ 
                          width: '40px', height: '40px', borderRadius: '10px', 
                          background: i === 0 ? 'var(--primary)' : 'var(--bg)',
                          color: i === 0 ? 'white' : 'var(--primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}
                      >
                        {i === 0 ? <Truck size={20} /> : <Clock size={20} />}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: i === 0 ? 'var(--primary)' : 'var(--text-main)' }}>{e.status}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                           <MapPin size={12} /> {e.location}
                        </p>
                        {e.remarks && <p style={{ fontSize: '13px', fontStyle: 'italic', marginTop: '8px', color: 'var(--text-muted)' }}>"{e.remarks}"</p>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', margin: 0 }}>{format(new Date(e.eventTime), 'MMM dd, yyyy')}</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', margin: '4px 0 0 0' }}>{format(new Date(e.eventTime), 'HH:mm')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default TrackingEvents;
