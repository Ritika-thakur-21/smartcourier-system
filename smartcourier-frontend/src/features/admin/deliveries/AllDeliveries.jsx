import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, Search, ChevronRight, Mail, Calendar, MapPin
} from 'lucide-react';
import { getAdminDeliveries } from '../../../api/adminApi';
import StatusBadge from '../../../shared/components/StatusBadge';
import { format } from 'date-fns';

const AllDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAdminDeliveries();
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDeliveries(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { label: 'All', value: 'ALL' },
    { label: 'Booked', value: 'BOOKED' },
    { label: 'In Transit', value: 'IN_TRANSIT' },
    { label: 'Delivered', value: 'DELIVERED' },
  ];

  const filteredDeliveries = deliveries.filter(d => {
    const matchesTab = activeTab === 'ALL' || 
      (activeTab === 'IN_TRANSIT' ? ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(d.status) : d.status === activeTab);
    const matchesSearch = d.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (d.customerEmail && d.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Global Fleet Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>Oversight and management of all shipments across the network.</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input 
              type="text"
              placeholder="Search by tracking or email..."
              className="input"
              style={{ paddingLeft: '48px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-1" style={{ background: 'var(--bg)', padding: '4px', borderRadius: '8px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === tab.value ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab.value ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p>Scanning global network...</p>
        ) : filteredDeliveries.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '80px' }}>
            <Truck size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>No matching deliveries</h3>
          </div>
        ) : (
          <div className="grid grid-3">
            {filteredDeliveries.map((d) => (
              <Link 
                key={d.id} 
                to={`/admin/deliveries/${d.id}`}
                className="card flex flex-col gap-5 hover-lift"
                style={{ textDecoration: 'none', padding: '24px' }}
              >
                <div className="flex justify-between items-start">
                   <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Truck size={24} />
                   </div>
                   <StatusBadge status={d.status} />
                </div>

                <div>
                   <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>#{d.trackingNumber}</h2>
                   <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} /> {d.customerEmail}
                   </p>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '10px' }} className="flex flex-col gap-2">
                   <div className="flex justify-between items-center">
                      <span className="label" style={{ fontSize: '10px' }}>Route</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{d.senderCity} → {d.receiverCity}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="label" style={{ fontSize: '10px' }}>Booked</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{format(new Date(d.createdAt), 'MMM dd')}</span>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                   <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)' }}>{d.serviceType}</span>
                   <div className="flex items-center gap-1 text-primary font-bold" style={{ fontSize: '13px' }}>
                      Manage <ChevronRight size={14} />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDeliveries;
