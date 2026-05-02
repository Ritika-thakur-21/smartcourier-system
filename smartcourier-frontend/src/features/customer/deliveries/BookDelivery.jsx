import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Loader2, Package, MapPin, ArrowRight, Check, ExternalLink, Upload, FileText } from 'lucide-react';
import { createDelivery } from '../../../api/deliveryApi';
import { uploadParcelDocument } from '../../../api/trackingApi';
import Toast from '../../../shared/components/Toast';

const addressSchema = yup.object({
  fullName: yup.string()
    .matches(/^[A-Za-z][A-Za-z .]{1,48}[A-Za-z.]$/, '3-50 chars, letters/spaces only')
    .required('Required'),
  phone: yup.string()
    .matches(/^[6-9][0-9]{9}$/, 'Must be a 10-digit Indian mobile number starting with 6-9')
    .required('Required'),
  street: yup.string()
    .min(3, 'Min 3 characters')
    .max(100, 'Max 100 characters')
    .required('Required'),
  city: yup.string()
    .matches(/^[A-Za-z][A-Za-z ]{1,48}[A-Za-z]$/, 'Letters and spaces only')
    .required('Required'),
  state: yup.string()
    .matches(/^[A-Za-z][A-Za-z ]{1,48}[A-Za-z]$/, 'Letters and spaces only')
    .required('Required'),
  pincode: yup.string()
    .matches(/^[1-9][0-9]{5}$/, '6-digit Indian pincode required')
    .required('Required'),
  country: yup.string()
    .matches(/^[A-Za-z][A-Za-z ]{1,48}[A-Za-z]$/, 'Letters and spaces only')
    .required('Required'),
});

const schema = yup.object({
  serviceType: yup.string().oneOf(['DOMESTIC', 'EXPRESS', 'INTERNATIONAL'], 'Select valid service').required('Required'),
  weight: yup.number().positive('Must be > 0').required('Required'),
  description: yup.string().min(5, 'Min 5 chars').required('Required'),
  receiverEmail: yup.string().email('Invalid email').nullable(),
  senderAddress: addressSchema,
  receiverAddress: addressSchema,
}).required();

const BookDelivery = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [successData, setSuccessData] = useState(null); // { trackingNumber: string }
  const [selectedFile, setSelectedFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { serviceType: 'DOMESTIC' }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // API expects certain structure
      const payload = {
        ...data,
        customerEmail: sessionStorage.getItem('email') // Auto-fill from session
      };
      const response = await createDelivery(payload);
      const deliveryId = response.data.id;

      // Handle optional file upload
      if (selectedFile) {
        try {
          await uploadParcelDocument(selectedFile, deliveryId);
        } catch (uploadErr) {
          console.error("File upload failed", uploadErr);
          // Non-blocking error, we still show success for the booking
        }
      }

      setSuccessData({ trackingNumber: response.data.trackingNumber });
      // Toast remove kar diya, modal dikhayenge
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to book delivery', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const PremiumInput = ({ label, name, error, placeholder, type = "text" }) => (
    <div className="flex flex-col gap-1">
      <label className="label">{label}</label>
      <input 
        {...register(name)} 
        type={type} 
        className="input" 
        placeholder={placeholder}
        style={{ fontSize: '14px' }}
      />
      {error && <p style={{ fontSize: '11px', color: 'var(--danger)', margin: 0, fontWeight: 'bold' }}>{error.message}</p>}
    </div>
  );

  const SuccessModal = ({ data }) => (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="p-8 flex flex-col items-center text-center gap-6">
          <div className="flex items-center justify-center bg-success" style={{ width: '80px', height: '80px', borderRadius: '50%', color: 'white' }}>
            <Check size={48} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Booking Successful!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Your delivery has been booked successfully. Email notifications have been sent to both sender and receiver.</p>
          </div>
          <div className="w-full p-4 bg-bg border border-border rounded-xl flex flex-col gap-1">
            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>Tracking Number</span>
            <code style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)' }}>{data.trackingNumber}</code>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <button onClick={() => navigate('/deliveries/my')} className="btn-primary w-full" style={{ padding: '14px' }}>
              View My Deliveries <ExternalLink size={18} />
            </button>
            <button onClick={() => setSuccessData(null)} className="btn-ghost w-full" style={{ padding: '14px' }}>
              Book Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-main)' }}>Book a Delivery</h1>
        <p style={{ color: 'var(--text-muted)' }}>Enter shipment and address details to generate a tracking number.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {/* Shipment Details */}
        <section className="card flex flex-col gap-8">
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} style={{ color: 'var(--primary)' }} /> 1. Shipment Details
          </h2>
          <div className="grid grid-3">
            <div className="flex flex-col gap-2">
              <label className="label">Service Type</label>
              <select {...register('serviceType')} className="input">
                <option value="DOMESTIC">Standard Domestic</option>
                <option value="EXPRESS">Express Priority</option>
                <option value="INTERNATIONAL">International</option>
              </select>
              {errors.serviceType && <p style={{ fontSize: '11px', color: 'var(--danger)' }}>{errors.serviceType.message}</p>}
            </div>
            <PremiumInput label="Weight (KG)" name="weight" type="number" placeholder="0.0" error={errors.weight} />
            <PremiumInput label="Receiver Email (Optional)" name="receiverEmail" placeholder="e.g. receiver@example.com" error={errors.receiverEmail} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="label">Contents Description</label>
            <textarea {...register('description')} className="input" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="e.g. Laptop, Clothes, Documents" />
            {errors.description && <p style={{ fontSize: '11px', color: 'var(--danger)' }}>{errors.description.message}</p>}
          </div>

          {/* Parcel Photo/Document Upload */}
          <div className="flex flex-col gap-3">
            <label className="label flex items-center gap-2">
              <Upload size={16} /> Parcel Documentation (Optional)
            </label>
            <div className="flex items-center gap-4 p-4 border border-border rounded-xl bg-bg">
              <div className="btn-icon" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
                  {selectedFile ? selectedFile.name : 'Upload parcel photo or invoice'}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  PNG, JPG or PDF up to 5MB
                </p>
              </div>
              <input 
                type="file" 
                id="parcel-doc" 
                hidden 
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <label htmlFor="parcel-doc" className="btn-ghost" style={{ padding: '8px 16px', cursor: 'pointer' }}>
                {selectedFile ? 'Change File' : 'Select File'}
              </label>
            </div>
          </div>
        </section>

        <div className="grid grid-2">
          {/* Origin */}
          <section className="card flex flex-col gap-8">
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} style={{ color: 'var(--primary)' }} /> 2. Origin Address
            </h2>
            <div className="flex flex-col" style={{ gap: '32px' }}>
              <PremiumInput label="Sender Full Name" name="senderAddress.fullName" placeholder="e.g. Ritika Thakur" error={errors.senderAddress?.fullName} />
              <PremiumInput label="Phone Number" name="senderAddress.phone" placeholder="e.g. 9876543210" error={errors.senderAddress?.phone} />
              <PremiumInput label="Street Address" name="senderAddress.street" placeholder="e.g. 123 Business Park" error={errors.senderAddress?.street} />
              <div className="grid grid-3">
                <PremiumInput label="City" name="senderAddress.city" placeholder="e.g. Mumbai" error={errors.senderAddress?.city} />
                <PremiumInput label="State" name="senderAddress.state" placeholder="e.g. Maharashtra" error={errors.senderAddress?.state} />
                <PremiumInput label="Pincode" name="senderAddress.pincode" placeholder="e.g. 400001" error={errors.senderAddress?.pincode} />
              </div>
              <PremiumInput label="Country" name="senderAddress.country" placeholder="e.g. India" error={errors.senderAddress?.country} />
            </div>
          </section>

          {/* Destination */}
          <section className="card flex flex-col gap-8">
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} style={{ color: 'var(--success)' }} /> 3. Destination Address
            </h2>
            <div className="flex flex-col" style={{ gap: '32px' }}>
              <PremiumInput label="Receiver Full Name" name="receiverAddress.fullName" placeholder="e.g. Amit Kumar" error={errors.receiverAddress?.fullName} />
              <PremiumInput label="Phone Number" name="receiverAddress.phone" placeholder="e.g. 9822113344" error={errors.receiverAddress?.phone} />
              <PremiumInput label="Street Address" name="receiverAddress.street" placeholder="e.g. 456 Residency Road" error={errors.receiverAddress?.street} />
              <div className="grid grid-3">
                <PremiumInput label="City" name="receiverAddress.city" placeholder="e.g. Delhi" error={errors.receiverAddress?.city} />
                <PremiumInput label="State" name="receiverAddress.state" placeholder="e.g. Delhi" error={errors.receiverAddress?.state} />
                <PremiumInput label="Pincode" name="receiverAddress.pincode" placeholder="e.g. 110001" error={errors.receiverAddress?.pincode} />
              </div>
              <PremiumInput label="Country" name="receiverAddress.country" placeholder="e.g. India" error={errors.receiverAddress?.country} />
            </div>
          </section>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary" style={{ padding: '18px', fontSize: '18px', boxShadow: 'var(--shadow)' }}>
          {isLoading ? <Loader2 className="animate-spin" /> : <>Book Delivery <ArrowRight size={20} /></>}
        </button>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {successData && <SuccessModal data={successData} />}
    </div>
  );
};

export default BookDelivery;
