import React from 'react';



const BADGE_CONFIG = {
  DRAFT:              { bg: 'var(--surface-3)',   text: 'var(--text-muted)',   border: 'var(--border-medium)', label: 'Draft' },
  BOOKED:             { bg: 'var(--info-bg)',     text: 'var(--info)',         border: 'var(--info-border)',   label: 'Booked' },
  PICKED_UP:          { bg: 'var(--brand-subtle)', text: 'var(--brand)',        border: 'var(--brand-border)',  label: 'Picked Up' },
  IN_TRANSIT:         { bg: 'var(--warning-bg)',  text: 'var(--warning)',      border: 'var(--warning-border)', label: 'In Transit' },
  OUT_FOR_DELIVERY:   { bg: 'var(--purple-bg)',   text: 'var(--purple)',       border: 'var(--purple-border)', label: 'Out for Delivery' },
  DELIVERED:          { bg: 'var(--success-bg)',  text: 'var(--success)',      border: 'var(--success-border)', label: 'Delivered' },
  DELAYED:            { bg: 'var(--warning-bg)',  text: 'var(--warning)',      border: 'var(--warning-border)', label: 'Delayed' },
  FAILED:             { bg: 'var(--danger-bg)',   text: 'var(--danger)',       border: 'var(--danger-border)',  label: 'Failed' },
  RETURNED:           { bg: 'var(--surface-3)',   text: 'var(--text-muted)',   border: 'var(--border-medium)', label: 'Returned' },
};

const StatusBadge = ({ status }) => {
  const config = BADGE_CONFIG[status] || BADGE_CONFIG.DRAFT;

  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
      }}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
