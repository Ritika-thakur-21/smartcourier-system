import React, { useState } from 'react';
import { 
  BarChart3, Calendar, Download, Loader2, 
  FileText, PieChart as PieIcon, TrendingUp, Filter, AlertCircle, RefreshCcw
} from 'lucide-react';
import { generateReport } from '../../../api/adminApi';
import Toast from '../../../shared/components/Toast';
import { format } from 'date-fns';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const ReportsPage = () => {
  const [fromDate, setFromDate] = useState(format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await generateReport(fromDate, toDate);
      setReportData(response.data);
      setToast({ message: 'Report generated successfully', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to generate report', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!reportData) return;

    const headers = ['Metric', 'Count'];
    const rows = [
      ['Total Deliveries', reportData.totalDeliveries],
      ['Booked', reportData.booked],
      ['In Transit', reportData.inTransit],
      ['Delivered', reportData.delivered],
      ['Failed', reportData.failed],
      ['Returned', reportData.returned],
      ['From', reportData.from],
      ['To', reportData.to],
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SmartCourier_Report_${reportData.from}_to_${reportData.to}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Reports</h1>
        <p style={{ color: 'var(--text-muted)' }}>Generate delivery reports for any date range.</p>
      </div>

      <section className="card" style={{ padding: '32px' }}>
        <div className="grid grid-3" style={{ alignItems: 'flex-end' }}>
          <div className="flex flex-col gap-2">
            <label className="label">From Date</label>
            <input 
              type="date"
              className="input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="label">To Date</label>
            <input 
              type="date"
              className="input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="btn-primary"
            style={{ height: '52px' }}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <BarChart3 size={20} />}
            Generate Report
          </button>
        </div>
      </section>

      {reportData && (
        <div className="grid grid-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="flex flex-col gap-8">
            <div className="grid grid-2">
              {[
                { label: 'Total Deliveries', value: reportData.totalDeliveries, icon: TrendingUp, color: 'var(--primary)' },
                { label: 'Success Rate', value: `${((reportData.totalDelivered / (reportData.totalDeliveries || 1)) * 100).toFixed(1)}%`, icon: PieIcon, color: 'var(--success)' },
                { label: 'Failed', value: reportData.totalFailed, icon: AlertCircle, color: 'var(--danger)' },
                { label: 'Delayed', value: reportData.totalDelayed, icon: RefreshCcw, color: '#8b5cf6' },
              ].map((stat, i) => (
                <div key={i} className="card flex flex-col gap-4" style={{ padding: '32px' }}>
                  <div className="btn-icon" style={{ background: 'var(--bg)', border: 'none', color: stat.color }}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{stat.value}</p>
                    <p className="label">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <section className="card flex flex-col gap-6" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Operational Distribution</h2>
              </div>
              <div style={{ padding: '24px', minHeight: '400px' }} className="flex flex-col gap-10">
                
                {/* Pie Chart */}
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Booked', value: reportData.deliveries.filter(d => d.status === 'BOOKED').length, color: '#ea580c' },
                          { name: 'In Transit', value: reportData.deliveries.filter(d => d.status === 'IN_TRANSIT').length, color: '#f59e0b' },
                          { name: 'Delivered', value: reportData.totalDelivered, color: '#10b981' },
                          { name: 'Failed', value: reportData.totalFailed, color: '#ef4444' },
                          { name: 'Delayed', value: reportData.totalDelayed, color: '#8b5cf6' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { color: '#ea580c' },
                          { color: '#f59e0b' },
                          { color: '#10b981' },
                          { color: '#ef4444' },
                          { color: '#8b5cf6' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div style={{ height: '250px', width: '100%', marginTop: '20px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Booked', count: reportData.deliveries.filter(d => d.status === 'BOOKED').length },
                        { name: 'Transit', count: reportData.deliveries.filter(d => d.status === 'IN_TRANSIT').length },
                        { name: 'Done', count: reportData.totalDelivered },
                        { name: 'Fail', count: reportData.totalFailed },
                        { name: 'Delay', count: reportData.totalDelayed },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip cursor={{ fill: 'rgba(194, 65, 12, 0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                      <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <section className="card flex flex-col gap-8" style={{ background: 'var(--primary)', color: 'white', borderColor: 'var(--primary)' }}>
              <div className="flex flex-col gap-2">
                <FileText size={40} />
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Export Data</h2>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>
                   Ready from {format(new Date(fromDate), 'MMM dd')} to {format(new Date(toDate), 'MMM dd')}.
                </p>
              </div>
              
              <button 
                onClick={handleDownloadCSV}
                className="btn-primary"
                style={{ background: 'white', color: 'var(--primary)', padding: '16px', fontSize: '16px' }}
              >
                Download CSV <Download size={20} />
              </button>
            </section>
            
            <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
              <p className="label">Last Analysis</p>
              <p style={{ fontWeight: 'bold', margin: 0 }}>{format(new Date(), 'HH:mm, MMM dd')}</p>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ReportsPage;
