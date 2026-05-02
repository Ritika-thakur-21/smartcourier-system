import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, Search, Truck, ChevronRight, Calendar, Scale
} from 'lucide-react';
import { getMyDeliveries } from '../../../api/deliveryApi';
import StatusBadge from '../../../shared/components/StatusBadge';
import { format } from 'date-fns';

const MyDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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

  const tabs = [
    { label: 'All', value: 'ALL' },
    { label: 'Booked', value: 'BOOKED' },
    { label: 'In Transit', value: 'IN_TRANSIT' },
    { label: 'Delivered', value: 'DELIVERED' },
  ];

  const filteredDeliveries = deliveries.filter(d => {
    const matchesTab = activeTab === 'ALL' || 
      (activeTab === 'IN_TRANSIT' ? ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(d.status) : d.status === activeTab);
    const matchesSearch = d.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '20px' }}>
        <div className="flex flex-col gap-1">
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>My Deliveries</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Track and manage your shipments.</p>
        </div>
        <Link to="/deliveries/book" className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
          <Package size={18} />
          Book New
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search 
              size={16} 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input 
              type="text"
              placeholder="Search tracking..."
              className="input"
              style={{ paddingLeft: '36px', height: '40px', fontSize: '13px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-1" style={{ background: 'var(--bg)', padding: '3px', borderRadius: '8px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === tab.value ? 'white' : 'transparent',
                  color: activeTab === tab.value ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: activeTab === tab.value ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p>Loading deliveries...</p>
        ) : filteredDeliveries.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <Package size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <p style={{ color: 'var(--text-muted)' }}>No shipments found.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filteredDeliveries.map((d) => (
              <Link 
                key={d.id} 
                to={`/deliveries/${d.id}`}
                className="card flex flex-col gap-4 hover-lift"
                style={{ textDecoration: 'none', padding: '20px' }}
              >
                <div className="flex justify-between items-start">
                  <div 
                    style={{ 
                      width: '40px', height: '40px', borderRadius: '10px', 
                      background: 'var(--bg)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}
                  >
                    <Truck size={20} />
                  </div>
                  <StatusBadge status={d.status} />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>#{d.trackingNumber}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{d.senderCity} → {d.receiverCity}</p>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '8px' }} className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{format(new Date(d.createdAt), 'MMM dd')}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Scale size={12} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{d.weight} KG</span>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                   <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase' }}>{d.serviceType}</span>
                   <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDeliveries;
