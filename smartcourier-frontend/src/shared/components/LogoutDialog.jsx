import React, { useEffect, useRef } from 'react';
import { LogOut, X } from 'lucide-react';



const LogoutDialog = ({ isOpen, onClose, onConfirm }) => {
  const dialogRef = useRef(null);
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      cancelBtnRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 flex flex-col items-center text-center gap-6">
          <div 
            className="flex items-center justify-center bg-red-soft" 
            style={{ width: '64px', height: '64px', borderRadius: '50%' }}
          >
            <LogOut size={32} className="text-red" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Sign Out?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>
              Are you sure you want to leave SmartCourier? <br />
              You'll need to log in again to manage your deliveries.
            </p>
          </div>

          <div className="flex gap-4 w-full" style={{ marginTop: '8px' }}>
            <button
              ref={cancelBtnRef}
              onClick={onClose}
              className="btn-ghost"
              style={{ flex: 1 }}
            >
              No, stay
            </button>
            <button
              onClick={onConfirm}
              className="btn-danger"
              style={{ flex: 1 }}
            >
              Yes, sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutDialog;
