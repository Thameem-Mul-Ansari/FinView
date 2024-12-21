import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from '../../lib/supabase';
import ImageUpload from '../ImageUpload';


interface BasicInfoProps {
  onNext: (data: any) => void;
  userData: any;
}

interface FormData {
  full_name: string;
  gender: string;
  date_of_birth: Date | null;
  pan_no: string;
  email: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  occupation: string;
  industry: string;
  annual_income: string;
  profile_picture: string;
}

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const INDUSTRY_OPTIONS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Others'
];

export default function BasicInfo({ onNext, userData }: BasicInfoProps) {
  const [formData, setFormData] = useState<FormData>({
    full_name: userData?.full_name || '',
    gender: '',
    date_of_birth: null,
    pan_no: '',
    email: userData?.email || '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    occupation: '',
    industry: '',
    annual_income: 'Less than 5 Lacs',
    profile_picture: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const profileData = {
        ...formData,
        user_id: userData.id,
        date_of_birth: formData.date_of_birth?.toISOString()
      };

      const { error } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select();

      if (error) throw error;
      
      onNext(profileData);
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  const handleImageChange = (base64: string) => {
    setFormData(prev => ({ ...prev, profile_picture: base64 }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
        <p className="mt-2 text-gray-600">Please provide your personal information to continue</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-center mb-6">
          <ImageUpload onImageChange={handleImageChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
              required
            >
              <option value="">Select Gender</option>
              {GENDER_OPTIONS.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <DatePicker
              selected={formData.date_of_birth}
              onChange={(date: Date | null) => setFormData({ ...formData, date_of_birth: date })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              showYearDropdown
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">PAN Number</label>
            <input
              type="text"
              value={formData.pan_no}
              onChange={(e) => setFormData({ ...formData, pan_no: e.target.value.toUpperCase() })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              title="Please enter a valid PAN number (e.g., ABCDE1234F)"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Pincode</label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
              pattern="[0-9]{6}"
              title="Please enter a valid 6-digit pincode"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Occupation</label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Industry</label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
              required
            >
              <option value="">Select Industry</option>
              {INDUSTRY_OPTIONS.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 space-y-1">
            <label className="block text-sm font-medium text-gray-700">Annual Income</label>
            <select
              value={formData.annual_income}
              onChange={(e) => setFormData({ ...formData, annual_income: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
              required
            >
              <option value="Less than 5 Lacs">Less than 5 Lacs</option>
              <option value="5 Lacs to 10 Lacs">5 Lacs to 10 Lacs</option>
              <option value="10 Lacs to 15 Lacs">10 Lacs to 15 Lacs</option>
              <option value="15 Lacs to 20 Lacs">15 Lacs to 20 Lacs</option>
              <option value="More than 20 Lacs">More than 20 Lacs</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}