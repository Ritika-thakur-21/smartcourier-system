import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AlertCircle, Loader2, Check, ArrowRight, Mail, Lock, Box, User, Phone } from 'lucide-react';
import { signup } from '../../api/authApi';
import Toast from '../../shared/components/Toast';
import './Auth.css';

const schema = yup.object({
  name: yup.string().required('Full name is required').min(3, 'Too short'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^[6-9][0-9]{9}$/, 'Valid 10-digit Indian number required').required('Phone is required'),
  password: yup.string().required('Password is required').min(6, 'Min 6 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Required'),
}).required();

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await signup({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const SuccessModal = () => (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="p-8 flex flex-col items-center text-center gap-6">
          <div className="flex items-center justify-center bg-success" style={{ width: '80px', height: '80px', borderRadius: '50%', color: 'white' }}>
            <Check size={48} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Account Created!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Welcome to SmartCourier. Your account has been created successfully. You can now login to start shipping.</p>
          </div>
          <button onClick={() => navigate('/login')} className="btn-primary w-full" style={{ padding: '14px' }}>
            Proceed to Login <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="auth-container">
      {/* Left side visual */}
      <div className="auth-visual">
        <div className="auth-visual-decor"></div>
        <div className="auth-visual-content">
          <div className="auth-logo">
            <Box size={32} color="white" />
          </div>
          <h1 className="auth-visual-title">Join SmartCourier</h1>
          <p className="auth-visual-subtitle">
            Create an account to start shipping faster, tracking your packages in real-time, and managing your deliveries efficiently.
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
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Sign up to start shipping</p>
          </div>

          {error && (
            <div className="auth-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <User size={18} />
                  </div>
                  <input
                    {...register('name')}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. Ritika Thakur"
                  />
                </div>
                {errors.name && <p className="error-message">{errors.name.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <Phone size={18} />
                  </div>
                  <input
                    {...register('phone')}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && <p className="error-message">{errors.phone.message}</p>}
              </div>
            </div>

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

            <div className="form-row">
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

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <Lock size={18} />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-submit">
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Register'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? 
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      {success && <SuccessModal />}
    </div>
  );
};

export default RegisterPage;
