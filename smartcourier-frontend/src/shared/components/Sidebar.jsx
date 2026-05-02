import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, PackagePlus, Package, MapPin, 
  Truck, Activity, BarChart3, LogOut 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { role } = useAppSelector((state) => state.auth);
  const isAdmin = role === 'ADMIN';

  const items = isAdmin ? [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'All Deliveries', path: '/admin/deliveries', icon: Truck },
    { label: 'Tracking Events', path: '/admin/tracking', icon: Activity },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
  ] : [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Book a Delivery', path: '/deliveries/book', icon: PackagePlus },
    { label: 'My Deliveries', path: '/deliveries/my', icon: Package },
    { label: 'Track a Parcel', path: '/track', icon: MapPin },
  ];

  const handleLogout = () => {
    dispatch(logout());
    onClose?.();
    navigate('/login');
  };

  const sidebarStyle = {
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
  };

  return (
    <>
      {isOpen && (
        <div 
          className="lg-hidden" 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 150 }}
          onClick={onClose} 
        />
      )}

      <aside className="sidebar" style={window.innerWidth < 1024 ? sidebarStyle : {}}>
        <div className="flex items-center" style={{ height: '64px', padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--primary)' }}>SmartCourier</span>
        </div>

        <nav style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
