import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Loader2, Truck, MapPin, Calendar, Clock, MapPinned } from 'lucide-react';
import { trackDelivery } from '../../../api/deliveryApi';
import { getTrackingEvents } from '../../../api/trackingApi';
import StatusBadge from '../../../shared/components/StatusBadge';
import TrackingMap from '../../../shared/components/TrackingMap';
import { format } from 'date-fns';

const TrackParcel = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTrackingNumber = queryParams.get('trackingNumber') || '';

  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [delivery, setDelivery] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const [delRes, trackRes] = await Promise.all([
        trackDelivery(trackingNumber),
        getTrackingEvents(trackingNumber)
      ]);
      setDelivery(delRes.data);
      setEvents(trackRes.data.sort((a, b) => new Date(b.eventTime) - new Date(a.eventTime)));
    } catch (err) {
      setError(err.response?.data?.message || 'Tracking number not found or invalid');
      setDelivery(null);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrackingNumber) {
      handleTrack();
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 flex flex-col gap-12 pb-32">
      <div style={{ textAlign: 'center' }} className="flex flex-col gap-4">
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>Track Shipment</h1>
        <p style={{ color: 'var(--text-muted)' }}>Real-time updates for your SmartCourier parcels.</p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-2" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input"
            style={{ paddingLeft: '48px', height: '56px', fontSize: '16px' }}
            placeholder="Enter Tracking Number..."
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '0 32px' }}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Track'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', color: 'var(--danger)', textAlign: 'center', borderRadius: '12px', fontWeight: 'bold' }}>
          {error}
        </div>
      )}

      {delivery && (
        <div className="flex flex-col gap-8 animate-fade">
          {/* Summary Row */}
          <div className="grid grid-3">
             <div className="card flex flex-col gap-4">
                <p className="label">Shipment Details</p>
                <div>
                   <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>#{delivery.trackingNumber}</h2>
                   <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Service: {delivery.serviceType}</p>
                </div>
                <StatusBadge status={delivery.status} />
             </div>
             <div className="card flex flex-col gap-4">
                <p className="label">Origin & Destination</p>
                <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-3">
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                      <span style={{ fontWeight: 'bold' }}>{delivery.senderCity}</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
                      <span style={{ fontWeight: 'bold' }}>{delivery.receiverCity}</span>
                   </div>
                </div>
             </div>
             <div className="card flex flex-col gap-4">
                <p className="label">Parcel Specs</p>
                <div className="flex flex-col gap-2">
                   <div className="flex justify-between">
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Weight</span>
                      <span style={{ fontWeight: 'bold' }}>{delivery.weight} KG</span>
                   </div>
                   <div className="flex justify-between">
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Booked</span>
                      <span style={{ fontWeight: 'bold' }}>{format(new Date(delivery.createdAt), 'MMM dd')}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Tracking Map Section */}
          <div className="flex flex-col gap-6">
             <h3 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPinned size={22} style={{ color: 'var(--primary)' }} /> Live Journey
             </h3>
             <TrackingMap events={events} />
          </div>

          {/* Timeline Section */}
          <div className="card flex flex-col gap-10" style={{ padding: '40px' }}>
             <h3 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={22} style={{ color: 'var(--primary)' }} /> Shipment Timeline
             </h3>
             
             <div className="flex flex-col gap-0">
                {events.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Initializing shipment data...</p>
                ) : (
                  events.map((event, i) => (
                    <div key={i} className="flex gap-8">
                       <div className="flex flex-col items-center" style={{ width: '32px' }}>
                          <div style={{ 
                             width: '16px', height: '16px', borderRadius: '50%', 
                             background: i === 0 ? 'var(--primary)' : 'var(--border)',
                             border: i === 0 ? '4px solid rgba(194, 65, 12, 0.2)' : 'none',
                             zIndex: 2, marginTop: '4px'
                          }} />
                          {i < events.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--border)', margin: '4px 0' }} />}
                       </div>
                       <div style={{ paddingBottom: '32px', flex: 1 }}>
                          <div className="flex justify-between items-start" style={{ flexWrap: 'wrap', gap: '8px' }}>
                             <div className="flex flex-col gap-1">
                                <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{event.status}</h4>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                   <MapPinned size={14} /> {event.location}
                                </p>
                             </div>
                             <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '13px', fontWeight: 'bold', margin: 0 }}>{format(new Date(event.eventTime), 'MMM dd, yyyy')}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{format(new Date(event.eventTime), 'hh:mm a')}</p>
                             </div>
                          </div>
                          {event.remarks && (
                            <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg)', borderRadius: '8px', fontSize: '13px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                               "{event.remarks}"
                            </div>
                          )}
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
