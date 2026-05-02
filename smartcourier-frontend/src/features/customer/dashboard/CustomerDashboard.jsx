import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PackagePlus, MapPin, Package, Upload, 
  Truck, CheckCircle, Clock, Loader2, Check 
} from 'lucide-react';
import { getMyDeliveries } from '../../../api/deliveryApi';
import { uploadParcelDocument } from '../../../api/trackingApi';
import { useAppSelector } from '../../../store';
import MetricStrip from '../../../shared/components/MetricStrip';
import StatusBadge from '../../../shared/components/StatusBadge';
import Toast from '../../../shared/components/Toast';
import { format } from 'date-fns';

const CustomerDashboard = () => {
  const { userName } = useAppSelector(state => state.auth);
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDelId, setSelectedDelId] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyDeliveries();
        setDeliveries(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const metrics = [
    { label: 'Total Shipments', value: deliveries.length, icon: Package, color: '#c2410c' },
    { label: 'Recently Booked', value: deliveries.filter(d => d.status === 'BOOKED').length, icon: Clock, color: '#ea580c' },
    { label: 'In Transit', value: deliveries.filter(d => ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(d.status)).length, icon: Truck, color: '#f59e0b' },
    { label: 'Delivered Safe', value: deliveries.filter(d => d.status === 'DELIVERED').length, icon: CheckCircle, color: '#10b981' },
  ];

  const recentDeliveries = deliveries.slice(0, 5);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedDelId) {
      setToast({ message: 'Please select a shipment first', type: 'error' });
      return;
    }

    setUploading(true);
    try {
      await uploadParcelDocument(file, selectedDelId);
      setToast({ message: 'Document uploaded successfully!', type: 'success' });
      setSelectedDelId('');
    } catch (err) {
      setToast({ message: 'Upload failed. Try again.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Welcome Header */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '24px' }}>
        <div className="flex flex-col gap-2">
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>
            Good {getTimeGreeting()}, <span style={{ color: 'var(--primary)' }}>{userName.split(' ')[0]}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Welcome back! You have <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{deliveries.length} total shipments</span>. 
            Currently, <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{metrics[2].value} are on their way</span>.
          </p>
        </div>
        
        <Link to="/deliveries/book" className="btn-primary" style={{ padding: '12px 24px' }}>
          <PackagePlus size={20} />
          Book New Parcel
        </Link>
      </div>

      <MetricStrip metrics={metrics} />

      <div className="grid grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Recent Activity Section */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Recent Shipments</h2>
            <Link to="/deliveries/my" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 'bold' }}>
              View All
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <p>Loading shipments...</p>
            ) : deliveries.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
                <p style={{ color: 'var(--text-muted)' }}>No active shipments found.</p>
                <Link to="/deliveries/book" style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '16px', display: 'inline-block' }}>
                  Book your first parcel
                </Link>
              </div>
            ) : (
              recentDeliveries.map((d) => (
                <div key={d.id} className="card flex items-center justify-between gap-4" style={{ padding: '16px 24px' }}>
                  <div className="flex items-center gap-4">
                    <div className="btn-icon" style={{ background: 'var(--bg)', border: 'none', color: 'var(--primary)' }}>
                      <Truck size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>#{d.trackingNumber}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{d.senderCity} → {d.receiverCity}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={d.status} />
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {format(new Date(d.createdAt), 'MMM dd')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Parcel Documentation Section */}
          <div className="card flex flex-col gap-6" style={{ padding: '32px', background: 'linear-gradient(135deg, var(--bg) 0%, rgba(194, 65, 12, 0.05) 100%)', border: '1px solid var(--primary)' }}>
            <div className="flex items-center gap-4">
              <div className="btn-icon" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
                <Upload size={24} />
              </div>
              <div className="flex flex-col">
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Parcel Documentation</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Upload parcel photos or invoices for your active shipments.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-2">
                 <label className="label">Select Shipment</label>
                 <select 
                    className="input" 
                    style={{ background: 'white' }}
                    value={selectedDelId}
                    onChange={(e) => setSelectedDelId(e.target.value)}
                 >
                   <option value="">Select a recent parcel...</option>
                   {deliveries.slice(0, 5).map(d => (
                     <option key={d.id} value={d.id}>#{d.trackingNumber} - {d.receiverCity}</option>
                   ))}
                 </select>
               </div>
              <div className="p-6 border-dashed border-2 border-border rounded-xl text-center flex flex-col items-center gap-3" style={{ background: 'rgba(255,255,255,0.5)' }}>
                {uploading ? (
                  <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                ) : (
                  <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                )}
                <div className="flex flex-col gap-1">
                  <p style={{ fontSize: '13px', fontWeight: 'bold' }}>
                    {uploading ? 'Uploading...' : 'Drag parcel photo here'}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PDF, PNG, JPG (max. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  style={{ display: 'none' }} 
                  id="doc-upload" 
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleUpload}
                  disabled={uploading || !selectedDelId}
                />
                <label 
                  htmlFor="doc-upload" 
                  className={!selectedDelId ? "btn-ghost disabled" : "btn-ghost"} 
                  style={{ padding: '6px 12px', fontSize: '12px', cursor: selectedDelId ? 'pointer' : 'not-allowed', opacity: selectedDelId ? 1 : 0.5 }}
                >
                  {uploading ? 'Please wait' : 'Select File'}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-6">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Quick Actions</h2>
          <div className="flex flex-col gap-4">
            <Link to="/deliveries/book" className="card flex items-center gap-4 hover-lift" style={{ textDecoration: 'none' }}>
              <div className="btn-icon" style={{ background: 'rgba(194, 65, 12, 0.1)', color: 'var(--primary)', border: 'none' }}>
                <PackagePlus size={20} />
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Book Delivery</span>
            </Link>
            <Link to="/track" className="card flex items-center gap-4 hover-lift" style={{ textDecoration: 'none' }}>
              <div className="btn-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: 'none' }}>
                <MapPin size={20} />
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Track Parcel</span>
            </Link>
            <Link to="/deliveries/my" className="card flex items-center gap-4 hover-lift" style={{ textDecoration: 'none' }}>
              <div className="btn-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'none' }}>
                <Upload size={20} />
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>History</span>
            </Link>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default CustomerDashboard;
