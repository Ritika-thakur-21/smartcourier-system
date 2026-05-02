import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Truck, AlertCircle, FileText, Download
} from 'lucide-react';
import { getDeliveryById } from '../../../api/deliveryApi';
import { getTrackingEvents, getDocuments, downloadDocument } from '../../../api/trackingApi';
import StatusBadge from '../../../shared/components/StatusBadge';
import { format } from 'date-fns';

const DeliveryDetail = () => {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [events, setEvents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [delRes, docRes] = await Promise.all([
          getDeliveryById(id),
          getDocuments(id)
        ]);
        setDelivery(delRes.data);
        setDocuments(docRes.data);
        
        const trackRes = await getTrackingEvents(delRes.data.trackingNumber);
        setEvents(trackRes.data);
      } catch (err) {
        setError("Failed to load delivery details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDownload = async (docId, fileName) => {
    try {
      const response = await downloadDocument(docId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download document");
    }
  };

  if (isLoading) return <div className="p-20 text-center">Loading delivery details...</div>;
  if (error || !delivery) return (
    <div className="card flex flex-col items-center gap-4 py-20">
      <AlertCircle size={48} style={{ color: 'var(--danger)' }} />
      <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Error Loading Delivery</h3>
      <p style={{ color: 'var(--text-muted)' }}>{error}</p>
      <Link to="/deliveries/my" className="btn-primary">Back to My Deliveries</Link>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link to="/deliveries/my" className="btn-icon">
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Delivery Details</h1>
      </div>

      <div className="grid grid-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="flex flex-col gap-8">
          {/* Main Info Card */}
          <div className="card flex flex-col gap-8">
            <div className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div className="flex flex-col gap-1">
                <span className="label">Tracking Number</span>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                  #{delivery.trackingNumber}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge status={delivery.status} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Booked on {format(new Date(delivery.createdAt), 'MMMM dd, yyyy')}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="label">Service Type</span>
                <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{delivery.serviceType}</p>
              </div>
            </div>

            <div className="grid grid-2">
              <div className="flex flex-col gap-4">
                <h3 className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <MapPin size={14} style={{ color: 'var(--primary)' }} /> Origin
                </h3>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{delivery.senderCity}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Customer: {delivery.customerEmail}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <MapPin size={14} style={{ color: 'var(--success)' }} /> Destination
                </h3>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{delivery.receiverCity}</p>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '12px' }}>
               <h3 className="label">Description</h3>
               <p style={{ fontSize: '14px' }}>{delivery.description || "No description provided."}</p>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="card flex flex-col gap-6">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Truck size={20} style={{ color: 'var(--primary)' }} /> Journey Updates
            </h2>
            <div className="flex flex-col">
              {events.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', padding: '20px', textAlign: 'center' }}>No tracking updates yet.</p>
              ) : (
                events.map((event, i) => (
                  <div key={i} className="flex gap-4" style={{ position: 'relative' }}>
                    <div className="flex flex-col items-center">
                      <div 
                        style={{ 
                          width: '12px', height: '12px', borderRadius: '50%', 
                          background: i === 0 ? 'var(--primary)' : 'var(--border)',
                          marginTop: '6px', zIndex: 2
                        }} 
                      />
                      {i !== events.length - 1 && (
                        <div style={{ width: '2px', flex: 1, background: 'var(--border)', margin: '4px 0' }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: '24px', flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{event.status}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{event.location}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {format(new Date(event.eventTime), 'MMM dd, hh:mm a')}
                      </p>
                      {event.remarks && <p style={{ fontSize: '13px', fontStyle: 'italic', marginTop: '8px', color: 'var(--text-muted)' }}>"{event.remarks}"</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
           {/* Package Stats */}
           <div className="card flex flex-col gap-4">
              <h3 className="label">Shipment Stats</h3>
              <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Weight</span>
                    <span style={{ fontWeight: 'bold' }}>{delivery.weight} KG</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Status</span>
                    <span style={{ fontWeight: 'bold' }}>{delivery.status}</span>
                 </div>
              </div>
           </div>

           {/* Documents */}
           <div className="card flex flex-col gap-6">
              <h3 className="label">Documents</h3>
              <div className="flex flex-col gap-3">
                 {documents.length === 0 ? (
                   <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No digital documents available.</p>
                 ) : (
                   documents.map((doc) => (
                     <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <FileText size={16} style={{ color: 'var(--primary)' }} />
                           <span style={{ fontSize: '13px', fontWeight: 'bold' }} className="truncate">{doc.fileName}</span>
                        </div>
                        <button 
                          onClick={() => handleDownload(doc.id, doc.fileName)}
                          className="btn-icon" 
                          style={{ border: 'none', background: 'transparent' }}
                        >
                           <Download size={16} />
                        </button>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetail;
