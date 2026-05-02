import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Truck, ArrowLeft, Download, FileText, 
  Info, RefreshCcw, MapPin, Save, Loader2, AlertTriangle
} from 'lucide-react';
import { getAdminDeliveryById, resolveDeliveryException, getAdminTrackingEvents } from '../../../api/adminApi';
import { updateDeliveryStatus } from '../../../api/deliveryApi';
import { getDocuments, downloadDocument } from '../../../api/trackingApi';

import StatusBadge from '../../../shared/components/StatusBadge';
import Toast from '../../../shared/components/Toast';
import { format } from 'date-fns';

const DeliveryManage = () => {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [events, setEvents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    if (!id) return;
    try {
      const dRes = await getAdminDeliveryById(Number(id));
      setDelivery(dRes.data);
      setNewStatus(dRes.data.status);
      
      const [eRes, docRes] = await Promise.all([
        getAdminTrackingEvents(dRes.data.trackingNumber),
        getDocuments(Number(id))
      ]);
      setEvents(eRes.data.sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime()));
      setDocuments(docRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!id || !newStatus) return;
    setIsUpdating(true);
    try {
      await updateDeliveryStatus(Number(id), newStatus);
      setToast({ message: `Status updated to ${newStatus}`, type: 'success' });
      fetchData();
    } catch (err) {
      setToast({ message: 'Failed to update status', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResolveException = async () => {
    if (!id || !remarks) return;
    setIsUpdating(true);
    try {
      await resolveDeliveryException(Number(id), { status: 'IN_TRANSIT', remarks });
      setToast({ message: 'Exception resolved and moved to IN_TRANSIT', type: 'success' });
      setRemarks('');
      fetchData();
    } catch (err) {
      setToast({ message: 'Failed to resolve exception', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

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
      setToast({ message: 'Failed to download document', type: 'error' });
    }
  };

  const statuses = [
    'BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 
    'DELIVERED', 'DELAYED', 'FAILED', 'RETURNED'
  ];

  if (isLoading || !delivery) return <div className="p-20 text-center">Loading shipment data...</div>;

  const isException = delivery.status === 'DELAYED' || delivery.status === 'FAILED';

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '24px' }}>
        <div className="flex items-center gap-4">
          <Link to="/admin/deliveries" className="btn-icon">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-3">
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>#{delivery.trackingNumber}</h1>
                <StatusBadge status={delivery.status} />
             </div>
             <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Customer: <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{delivery.customerEmail}</span>
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="flex flex-col gap-8">
          {/* Main Info Card */}
          <section className="card flex flex-col gap-8">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <Info size={18} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Shipment Overview</h2>
            </div>
            
            <div className="grid grid-2">
              <div className="flex flex-col gap-4">
                 <div className="flex flex-col gap-1">
                    <span className="label">Service</span>
                    <span style={{ fontWeight: 'bold' }}>{delivery.serviceType}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="label">Weight</span>
                    <span style={{ fontWeight: 'bold' }}>{delivery.weight} KG</span>
                 </div>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="label">Route</span>
                 <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{delivery.senderCity} → {delivery.receiverCity}</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '12px' }}>
               <h3 className="label">Description</h3>
               <p style={{ fontSize: '14px' }}>{delivery.description || "No description provided."}</p>
            </div>
          </section>

          {/* Documents Section */}
          <section className="card flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <FileText size={18} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Documents</h2>
            </div>
            
            {documents.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No documents attached.</p>
            ) : (
              <div className="grid grid-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4" style={{ background: 'var(--bg)', borderRadius: '12px' }}>
                    <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
                      <FileText size={18} style={{ color: 'var(--primary)' }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 'bold', margin: 0 }} className="truncate">{doc.fileName}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownload(doc.id, doc.fileName)}
                      className="btn-icon"
                      style={{ border: 'none', background: 'transparent' }}
                    >
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* History */}
          <section className="card flex flex-col gap-6">
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Activity History</h2>
            <div className="flex flex-col gap-6">
              {events.map((e, i) => (
                <div key={e.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: i === 0 ? 'var(--primary)' : 'var(--border)', marginTop: '6px' }} />
                    {i < events.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--border)', margin: '4px 0' }} />}
                  </div>
                  <div style={{ paddingBottom: i < events.length - 1 ? '16px' : '0' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{e.status}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0' }}>{e.location}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{format(new Date(e.eventTime), 'MMM dd, HH:mm')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          {/* Status Update Card */}
          <section className="card flex flex-col gap-6">
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCcw size={18} style={{ color: 'var(--primary)' }} /> Update Status
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="label">Target Status</label>
                <select 
                  className="input"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <button 
                onClick={handleUpdateStatus}
                disabled={isUpdating || newStatus === delivery.status}
                className="btn-primary w-full"
                style={{ padding: '12px' }}
              >
                {isUpdating ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Save Status
              </button>
            </div>
          </section>

          {/* Exception Panel */}
          {isException && (
            <section className="card" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--danger)' }}>
                <AlertTriangle size={20} />
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Resolve Exception</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="label" style={{ color: 'var(--danger)' }}>Resolution Remarks</label>
                  <textarea 
                    className="input"
                    style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    placeholder="Describe resolution..."
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>

                <button 
                  onClick={handleResolveException}
                  disabled={isUpdating || !remarks}
                  className="btn-primary w-full"
                  style={{ background: 'var(--danger)', padding: '12px' }}
                >
                  Resolve & Resume
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default DeliveryManage;
