import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { loginSuccess } from '../../store/slices/authSlice';
import { login } from '../../api/authApi';
import Toast from '../../shared/components/Toast';
import { Mail, Lock, Box } from 'lucide-react';
import './Auth.css';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required();

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login(data);
      const { token, role, name, email } = response.data;
      dispatch(loginSuccess({ token, role, name, email }));
      setToast({ message: 'Login successful!', type: 'success' });
      const from = location.state?.from?.pathname || (role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
      setTimeout(() => navigate(from), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left side visual */}
      <div className="auth-visual">
        <div className="auth-visual-decor"></div>
        <div className="auth-visual-content">
          <div className="auth-logo">
            <Box size={32} color="white" />
          </div>
          <h1 className="auth-visual-title">Welcome back to SmartCourier</h1>
          <p className="auth-visual-subtitle">
            Sign in to access your dashboard, track your deliveries, and manage your shipments with ease.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="auth-form-container">
        <div className="auth-form-card">
          <div className="auth-header">
            <div className="auth-mobile-logo">
              <Box size={24} color="white" />
            </div>
            <h1 className="auth-title">Sign in</h1>
            <p className="auth-subtitle">Access your SmartCourier account</p>
          </div>

          {error && (
            <div className="auth-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Mail size={18} />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="e.g. ritika@example.com"
                />
              </div>
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock size={18} />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-submit">
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Sign in'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? 
              <Link to="/register" className="auth-link">Register</Link>
            </p>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LoginPage;
