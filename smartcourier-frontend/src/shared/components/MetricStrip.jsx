import React from 'react';

const MetricStrip = ({ metrics }) => {
  return (
    <div className="grid grid-4" style={{ marginBottom: '40px' }}>
      {metrics.map((m, i) => (
        <div key={i} className="card flex items-center gap-4">
          <div 
            className="flex items-center justify-center"
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '12px', 
              flexShrink: 0,
              backgroundColor: m.color ? `${m.color}15` : 'rgba(194, 65, 12, 0.1)',
              color: m.color || 'var(--primary)'
            }}
          >
            <m.icon size={28} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p className="label" style={{ marginBottom: '2px', fontSize: '10px' }}>
              {m.label}
            </p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
              {m.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricStrip;
