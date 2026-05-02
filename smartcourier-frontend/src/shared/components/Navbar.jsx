import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, LogOut, Menu, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import LogoutDialog from './LogoutDialog';

const Navbar = ({ variant = 'public', onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userName, role } = useAppSelector((state) => state.auth);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsLogoutOpen(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="flex items-center gap-4">
          {/* Only show logo in public navbar, as sidebar has it in authenticated layout */}
          {variant === 'public' && (
            <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '20px' }}>
              <Package size={24} />
              <span>SmartCourier</span>
            </Link>
          )}

          {variant === 'authenticated' && (
            <div className="lg-block" style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)' }}>
               {role === 'ADMIN' ? 'Admin Control' : 'Customer Portal'}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {variant === 'public' ? (
            <div className="flex items-center gap-6">
              <Link to="/track" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }}>Track</Link>
              <Link to="/login" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }}>Sign in</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 16px' }}>Register</Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div style={{ textAlign: 'right', marginRight: '8px' }} className="lg-block">
                <p style={{ fontSize: '13px', fontWeight: 'bold', margin: 0 }}>{userName}</p>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>{role}</p>
              </div>
              <div 
                className="flex items-center justify-center" 
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg)', color: 'var(--primary)' }}
              >
                <User size={20} />
              </div>
              <button 
                onClick={() => setIsLogoutOpen(true)}
                className="flex items-center gap-2"
                style={{ color: 'var(--danger)', border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px', fontSize: '13px', fontWeight: 'bold' }}
                title="Logout"
              >
                <LogOut size={18} />
                <span className="lg-block">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <LogoutDialog 
        isOpen={isLogoutOpen} 
        onClose={() => setIsLogoutOpen(false)} 
        onConfirm={handleLogout} 
      />
    </>
  );
};

export default Navbar;
