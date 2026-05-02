import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, CheckCircle, AlertTriangle, Package, 
  BarChart3, Activity, Clock, ChevronRight,
  Search, Calendar
} from 'lucide-react';
import { getDashboardStats, getAdminDeliveries } from '../../../api/adminApi';

import MetricStrip from '../../../shared/components/MetricStrip';
import StatusBadge from '../../../shared/components/StatusBadge';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [sRes, dRes] = await Promise.all([
        getDashboardStats(),
        getAdminDeliveries()
      ]);
      setStats(sRes.data);
      const sorted = [...dRes.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentDeliveries(sorted.slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!dateRange.from || !dateRange.to) {
      fetchData();
      return;
    }
    setIsLoading(true);
    try {
      // Format to start and end of day in ISO format
      const from = `${dateRange.from}T00:00:00`;
      const to = `${dateRange.to}T23:59:59`;
      const res = await getAdminDeliveries(null, from, to);
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentDeliveries(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = [
    { label: 'Total Deliveries', value: stats?.totalDeliveries || 0, icon: Package, color: '#c2410c' },
    { label: 'Pending', value: stats?.bookedDeliveries || 0, icon: Clock, color: '#ea580c' },
    { label: 'Delivered', value: stats?.deliveredDeliveries || 0, icon: CheckCircle, color: '#10b981' },
    { label: 'Failed', value: stats?.failedDeliveries || 0, icon: AlertTriangle, color: '#ef4444' },
  ];

  const breakdown = [
    { label: 'Booked', status: 'BOOKED', color: '#ea580c', count: stats?.bookedDeliveries || 0 },
    { label: 'In Transit', status: 'IN_TRANSIT', color: '#f59e0b', count: stats?.inTransitDeliveries || 0 },
    { label: 'Delivered', status: 'DELIVERED', color: '#10b981', count: stats?.deliveredDeliveries || 0 },
    { label: 'Failed', status: 'FAILED', color: '#ef4444', count: stats?.failedDeliveries || 0 },
    { label: 'Delayed', status: 'DELAYED', color: '#8b5cf6', count: stats?.delayedDeliveries || 0 },
  ];

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '24px' }}>
        <div className="flex flex-col gap-2">
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Overview of all shipments, delivery status, and recent activity.
          </p>
        </div>
      </div>

      <MetricStrip metrics={metrics} />

      <div className="grid grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Recent Deliveries */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} style={{ color: 'var(--primary)' }} /> Recent Deliveries
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 card" style={{ padding: '4px 12px', flexDirection: 'row', boxShadow: 'none', border: '1px solid var(--border)' }}>
                <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                <input 
                  type="date" 
                  value={dateRange.from} 
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  style={{ border: 'none', background: 'transparent', fontSize: '11px', outline: 'none', color: 'var(--text)' }}
                />
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>to</span>
                <input 
                  type="date" 
                  value={dateRange.to} 
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  style={{ border: 'none', background: 'transparent', fontSize: '11px', outline: 'none', color: 'var(--text)' }}
                />
                <button 
                  onClick={handleSearch}
                  className="btn-primary"
                  style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px' }}
                >
                  <Search size={12} />
                </button>
              </div>
              <Link to="/admin/deliveries" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 'bold' }}>
                View All
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <p>Loading deliveries...</p>
            ) : recentDeliveries.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No deliveries found.</p>
              </div>
            ) : (
              recentDeliveries.map((d) => (
                <div key={d.id} className="card flex items-center justify-between gap-4" style={{ padding: '16px 24px' }}>
                  <div className="flex items-center gap-4">
                    <div className="btn-icon" style={{ background: 'var(--bg)', border: 'none', color: 'var(--primary)' }}>
                      <Truck size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>#{d.trackingNumber}</p>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{d.customerEmail}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{d.senderCity} → {d.receiverCity}</p>
                    </div>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={20} style={{ color: 'var(--primary)' }} /> Status Breakdown
            </h2>
            <div className="card flex flex-col gap-6" style={{ minHeight: '340px' }}>
              <div style={{ height: '240px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                {breakdown.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)', marginTop: '8px' }}>
                <Link 
                  to="/admin/reports" 
                  className="btn-primary w-full"
                  style={{ padding: '12px' }}
                >
                  View Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
