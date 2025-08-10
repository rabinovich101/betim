'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    country: '',
    state: '',
    promoCode: '',
    termsAccepted: false,
    privacyAccepted: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Countries with restricted gambling (example list)
  const restrictedCountries = ['FR', 'TR', 'ES', 'IT'];
  
  // US states where online gambling is legal (example list)
  const legalUSStates = ['NJ', 'PA', 'MI', 'WV', 'CT', 'DE', 'NV'];

  const countries = [
    { code: 'US', name: 'United States', requiresState: true },
    { code: 'GB', name: 'United Kingdom', requiresState: false },
    { code: 'CA', name: 'Canada', requiresState: false },
    { code: 'AU', name: 'Australia', requiresState: false },
    { code: 'DE', name: 'Germany', requiresState: false },
    { code: 'FR', name: 'France', requiresState: false },
    { code: 'ES', name: 'Spain', requiresState: false },
    { code: 'IT', name: 'Italy', requiresState: false },
    { code: 'TR', name: 'Turkey', requiresState: false },
    { code: 'BR', name: 'Brazil', requiresState: false },
    { code: 'MX', name: 'Mexico', requiresState: false },
    { code: 'JP', name: 'Japan', requiresState: false },
  ];

  const usStates = [
    { code: 'NJ', name: 'New Jersey' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'MI', name: 'Michigan' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NY', name: 'New York' },
    { code: 'CA', name: 'California' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'IL', name: 'Illinois' },
  ];

  // Calculate password strength
  useEffect(() => {
    const password = formData.password;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    setPasswordStrength(strength);
  }, [formData.password]);

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: 'Weak', color: 'text-red-500' };
      case 2:
      case 3: return { text: 'Medium', color: 'text-yellow-500' };
      case 4:
      case 5: return { text: 'Strong', color: 'text-green-500' };
      default: return { text: '', color: '' };
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const isLocationRestricted = () => {
    if (formData.country === 'US') {
      return !legalUSStates.includes(formData.state);
    }
    return restrictedCountries.includes(formData.country) && formData.country !== 'US';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Too short';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = 'Required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Min 8 chars';
    } else if (passwordStrength < 2) {
      newErrors.password = 'Too weak';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'No match';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Required';
    } else {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 21) {
        newErrors.dateOfBirth = 'Must be 21+';
      }
    }

    if (!formData.country) {
      newErrors.country = 'Required';
    }

    if (formData.country === 'US' && !formData.state) {
      newErrors.state = 'Required';
    }

    if (formData.country && isLocationRestricted()) {
      newErrors.country = 'Not available';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Required';
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert('Registration successful! Please check your email to verify your account.');
      setIsSubmitting(false);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#0f2027] to-[#1a1a2e] flex items-center justify-center p-4">
      <div className="w-full max-w-[448px]">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00ff87] to-[#00d68f] rounded-xl flex items-center justify-center">
              <span className="text-[#0a1a1f] font-bold text-xl">B</span>
            </div>
            <h1 className="text-3xl font-bold text-white">BETIM</h1>
          </div>
          <p className="text-sm text-[#a0a0b8]">Join the winning community</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1a2c38]/60 backdrop-blur-xl rounded-2xl p-7 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <div className={`relative transition-all duration-200 ${focusedField === 'fullName' ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b8] pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-3 py-4 bg-[#232438] border ${errors.fullName ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-[#6a6a7e] focus:outline-none focus:border-[#00ff87] transition-all`}
                    placeholder="Full Name"
                  />
                </div>
                {errors.fullName && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div className="relative">
                <div className={`relative transition-all duration-200 ${focusedField === 'username' ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b8] pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="20" y1="8" x2="20" y2="14"/>
                      <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-3 py-4 bg-[#232438] border ${errors.username ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-[#6a6a7e] focus:outline-none focus:border-[#00ff87] transition-all`}
                    placeholder="Username"
                  />
                </div>
                {errors.username && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.username}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b8] pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 pr-3 py-4 bg-[#232438] border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-[#6a6a7e] focus:outline-none focus:border-[#00ff87] transition-all`}
                  placeholder="Email Address"
                />
              </div>
              {errors.email && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b8] pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-10 py-4 bg-[#232438] border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-[#6a6a7e] focus:outline-none focus:border-[#00ff87] transition-all`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0b8] hover:text-white transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="relative">
                <div className={`relative transition-all duration-200 ${focusedField === 'confirmPassword' ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b8] pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-10 py-4 bg-[#232438] border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-[#6a6a7e] focus:outline-none focus:border-[#00ff87] transition-all`}
                    placeholder="Confirm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0b8] hover:text-white transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showConfirmPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.confirmPassword && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Password Strength */}
            {formData.password && (
              <div className="px-1">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i < passwordStrength
                          ? passwordStrength <= 2 ? 'bg-red-500' 
                            : passwordStrength <= 3 ? 'bg-yellow-500' 
                            : 'bg-[#00ff87]'
                          : 'bg-[#232438]'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${getPasswordStrengthText().color}`}>
                  Password strength: {getPasswordStrengthText().text}
                </p>
              </div>
            )}

            {/* DOB and Location */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <div className={`relative transition-all duration-200 ${focusedField === 'dateOfBirth' ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b8] pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('dateOfBirth')}
                    onBlur={() => setFocusedField(null)}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-10 pr-2 py-4 bg-[#232438] border ${errors.dateOfBirth ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-[#6a6a7e] focus:outline-none focus:border-[#00ff87] transition-all text-xs`}
                  />
                </div>
                {errors.dateOfBirth && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.dateOfBirth}</p>}
              </div>

              <div className="relative">
                <div className={`relative transition-all duration-200 ${focusedField === 'country' ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b8] pointer-events-none z-10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('country')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-2 py-4 bg-[#232438] border ${errors.country ? 'border-red-500' : 'border-white/10'} rounded-lg text-white focus:outline-none focus:border-[#00ff87] transition-all appearance-none`}
                  >
                    <option value="">Country</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.country}</p>}
              </div>

              {formData.country === 'US' ? (
                <div className="relative">
                  <div className={`relative transition-all duration-200 ${focusedField === 'state' ? 'scale-[1.02]' : ''}`}>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('state')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-3 py-4 bg-[#232438] border ${errors.state ? 'border-red-500' : 'border-white/10'} rounded-lg text-white focus:outline-none focus:border-[#00ff87] transition-all appearance-none`}
                    >
                      <option value="">State</option>
                      {usStates.map(state => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.state && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.state}</p>}
                </div>
              ) : (
                <div className="relative">
                  <div className={`relative transition-all duration-200 ${focusedField === 'promoCode' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b8] pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 12 20 22 4 22 4 12"/>
                        <rect x="2" y="7" width="20" height="5"/>
                        <line x1="12" y1="22" x2="12" y2="7"/>
                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="promoCode"
                      value={formData.promoCode}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('promoCode')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-2 py-3 bg-[#232438] border border-white/10 rounded-lg text-white placeholder-[#6a6a7e] focus:outline-none focus:border-[#00ff87] transition-all text-sm"
                      placeholder="Promo"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-2">
              <label className={`flex items-center gap-2 cursor-pointer group ${errors.termsAccepted ? 'text-red-500' : ''}`}>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="w-4 h-4 bg-[#232438] border border-white/10 rounded text-[#00ff87] focus:ring-[#00ff87]"
                />
                <span className="text-xs text-[#a0a0b8] group-hover:text-white transition-colors">
                  I accept the{' '}
                  <Link href="/terms" className="text-[#00ff87] hover:underline">
                    Terms & Conditions
                  </Link>
                </span>
              </label>
              
              <label className={`flex items-center gap-2 cursor-pointer group ${errors.privacyAccepted ? 'text-red-500' : ''}`}>
                <input
                  type="checkbox"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={handleInputChange}
                  className="w-4 h-4 bg-[#232438] border border-white/10 rounded text-[#00ff87] focus:ring-[#00ff87]"
                />
                <span className="text-xs text-[#a0a0b8] group-hover:text-white transition-colors">
                  I accept the{' '}
                  <Link href="/privacy" className="text-[#00ff87] hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-[#00ff87] to-[#00d68f] text-[#0a1a1f] font-bold rounded-xl hover:shadow-lg hover:shadow-[#00ff87]/30 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#0a1a1f]/30 border-t-[#0a1a1f] rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-[#a0a0b8]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#00ff87] hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex justify-center gap-6 text-xs text-[#6a6a7e]">
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#00ff87]">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#00ff87]">
              <path d="M9 11V6a3 3 0 1 1 6 0v5M3 11h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11z"/>
            </svg>
            <span>21+ Only</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#00ff87]">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Licensed</span>
          </div>
        </div>
      </div>
    </div>
  );
}