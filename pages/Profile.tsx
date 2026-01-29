import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';
import { Button } from '../components/Button';
import { ImageUpload } from '../components/ImageUpload';
import { documentService } from '../services/documentService';
import { UserDocument } from '../types';
import { GAMIFICATION } from '../utils/gamification';

export const Profile = () => {
  const { user, isLoadingAuth, refreshUser } = useAppContext();
  const navigate = useNavigate();

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Documents states
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [showDocForm, setShowDocForm] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<'adhar' | 'passport' | 'license' | 'other'>('other');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Preferences states
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    defaultBudget: 'Moderate',
    favoriteInterests: [] as string[],
    preferredCurrency: 'USD - $',
    language: 'English',
    activityLevel: 'Moderate'
  });

  // Active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'documents' | 'preferences' | 'achievements'>('overview');


  useEffect(() => {
    if (!isLoadingAuth && !user) {
      navigate('/login');
    }
    if (user) {
      setName(user.name || user.full_name || '');
      if (user.preferences) {
        setPreferences({ ...preferences, ...user.preferences });
      }
      loadDocuments();
    }
  }, [user, isLoadingAuth, navigate]);

  const loadDocuments = async () => {
    if (!user) return;
    try {
      const docs = await documentService.getUserDocuments(user.id);
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  if (isLoadingAuth || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50 dark:bg-charcoal-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-600"></div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', user.id);

      if (error) throw error;

      await refreshUser();
      setIsEditing(false);
      alert('✅ Profile updated successfully!');
    } catch (error: any) {
      alert('❌ Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (url: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', user.id);

      if (error) throw error;

      await refreshUser();
      alert('✅ Avatar updated successfully!');
    } catch (error: any) {
      alert('❌ Error updating avatar: ' + error.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('❌ Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('❌ Password must be at least 6 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      alert('✅ Password changed successfully!');
      setShowPasswordForm(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      alert('❌ Error: ' + error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ preferences: preferences })
        .eq('id', user.id);

      if (error) throw error;

      await refreshUser();
      alert('✅ Preferences saved!');
    } catch (error: any) {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleResendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });

      if (error) throw error;
      alert('✅ Verification email sent! Check your inbox.');
    } catch (error: any) {
      alert('❌ Error: ' + error.message);
    }
  };

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteInterests: prev.favoriteInterests.includes(interest)
        ? prev.favoriteInterests.filter(i => i !== interest)
        : [...prev.favoriteInterests, interest]
    }));
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile || !user) return;

    if (docFile.size > 5 * 1024 * 1024) {
      alert("❌ File size must be less than 5MB");
      return;
    }

    setUploadingDoc(true);

    try {
      await documentService.uploadUserDocument(user.id, docFile, docName, docType);
      await loadDocuments();
      setShowDocForm(false);
      setDocFile(null);
      setDocName('');
      alert('✅ Document uploaded successfully!');
    } catch (error: any) {
      alert('❌ Error uploading document: ' + (error.message || "Unknown error"));
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeleteDocument = async (id: string, path: string) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await documentService.deleteUserDocument(id, path);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (error: any) {
      alert('❌ Error deleting document: ' + error.message);
    }
  };

  const handleViewDocument = async (path: string) => {
    try {
      const url = await documentService.getDocumentUrl(path);
      window.open(url, '_blank');
    } catch (error: any) {
      alert('❌ Error opening document: ' + error.message);
    }
  };

  const INTERESTS = ["Nature", "History", "Food", "Adventure", "Relaxation", "Nightlife", "Shopping", "Culture"];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'documents', label: 'Documents', icon: '📂' },
    { id: 'achievements', label: 'Passport & Badges', icon: '🏆' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' }
  ];

  return (
    <>
      <Helmet>
        <title>My Profile - TravelMate</title>
        <meta name="description" content="Manage your TravelMate profile, preferences, and travel documents." />
      </Helmet>
      <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Profile Header with Cover */}
          <div className="relative mb-8 animate-fade-in-up">
            {/* Cover Image */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-forest-500 via-clay-500 to-forest-600 rounded-[3rem] overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200')] bg-cover bg-center opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Profile Card Overlay */}
            <div className="relative -mt-20 mx-4 md:mx-8">
              <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-6 md:p-8 shadow-2xl border border-sand-200 dark:border-charcoal-700">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">

                  {/* Avatar */}
                  <div className="flex-shrink-0 -mt-16 md:-mt-20">
                    {isEditing ? (
                      <div className="w-32 h-32">
                        <ImageUpload
                          bucket="avatars"
                          onUploadComplete={handleAvatarUpload}
                          currentImage={user.avatar_url}
                          label="Change Photo"
                        />
                      </div>
                    ) : (
                      user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={name}
                          className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-white dark:border-charcoal-900 ring-4 ring-forest-500/20"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-forest-500 to-clay-600 flex items-center justify-center text-5xl text-white font-bold shadow-2xl border-4 border-white dark:border-charcoal-900 ring-4 ring-forest-500/20">
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left">
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-3xl font-bold bg-sand-50 dark:bg-charcoal-800 border-2 border-forest-500 rounded-xl px-4 py-2 mb-2 w-full max-w-md font-display"
                        placeholder="Your Name"
                      />
                    ) : (
                      <h1 className="text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-white mb-2 font-display">{name}</h1>
                    )}

                    <p className="text-charcoal-600 dark:text-sand-300 flex items-center justify-center md:justify-start gap-2 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {user.email}
                    </p>

                    <div className="flex gap-2 justify-center md:justify-start flex-wrap">
                      <span className="bg-forest-100 dark:bg-forest-900/30 text-forest-800 dark:text-forest-300 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide">
                        {user.role}
                      </span>
                      {user.email_confirmed_at ? (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1">
                          ✓ Verified
                        </span>
                      ) : (
                        <button
                          onClick={handleResendVerification}
                          className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs px-3 py-1.5 rounded-full font-bold hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition"
                        >
                          ⚠️ Unverified - Resend
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Button variant="primary" onClick={handleSaveProfile} isLoading={saving}>
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setIsEditing(false);
                          setName(user.name || user.full_name || '');
                        }}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button variant="primary" onClick={() => setIsEditing(true)}>
                        <span className="mr-2">✏️</span> Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-2 shadow-lg border border-sand-200 dark:border-charcoal-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-forest-500 to-forest-700 text-white shadow-lg scale-105'
                      : 'text-charcoal-600 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-charcoal-800'
                      }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 shadow-lg border border-sand-200 dark:border-charcoal-700">
                  <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6 font-display flex items-center gap-2">
                    <span>📊</span> Account Stats
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-sand-50 dark:bg-charcoal-800 rounded-xl">
                      <span className="text-charcoal-600 dark:text-sand-300">Member Since</span>
                      <span className="font-bold text-charcoal-900 dark:text-white">
                        {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-sand-50 dark:bg-charcoal-800 rounded-xl">
                      <span className="text-charcoal-600 dark:text-sand-300">Account Type</span>
                      <span className="font-bold text-forest-600 dark:text-forest-400 capitalize">{user.role}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-sand-50 dark:bg-charcoal-800 rounded-xl">
                      <span className="text-charcoal-600 dark:text-sand-300">Documents</span>
                      <span className="font-bold text-charcoal-900 dark:text-white">{documents.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 shadow-lg border border-sand-200 dark:border-charcoal-700">
                  <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6 font-display flex items-center gap-2">
                    <span>🎯</span> Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/my-trips')}
                      className="w-full p-4 bg-gradient-to-r from-forest-500 to-forest-700 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-between group"
                    >
                      <span>View My Trips</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                    <button
                      onClick={() => navigate('/plan')}
                      className="w-full p-4 bg-gradient-to-r from-clay-500 to-clay-700 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-between group"
                    >
                      <span>Plan New Trip</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                    <button
                      onClick={() => navigate('/community')}
                      className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-between group"
                    >
                      <span>Explore Community</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 shadow-lg border border-sand-200 dark:border-charcoal-700 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6 font-display flex items-center gap-2">
                  <span>🔒</span> Security Settings
                </h2>

                <div className="space-y-6">
                  <div className="p-6 bg-sand-50 dark:bg-charcoal-800 rounded-xl">
                    <h3 className="font-bold text-charcoal-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>🔑</span> Change Password
                    </h3>

                    {!showPasswordForm ? (
                      <Button variant="outline" onClick={() => setShowPasswordForm(true)} className="w-full">
                        Update Password
                      </Button>
                    ) : (
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-charcoal-700 dark:text-sand-200">New Password</label>
                          <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-charcoal-700 border border-sand-200 dark:border-charcoal-600 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-charcoal-700 dark:text-sand-200">Confirm Password</label>
                          <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-charcoal-700 border border-sand-200 dark:border-charcoal-600 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button type="submit" variant="primary" className="flex-1" isLoading={passwordLoading}>
                            Update Password
                          </Button>
                          <Button type="button" variant="outline" onClick={() => {
                            setShowPasswordForm(false);
                            setNewPassword('');
                            setConfirmPassword('');
                          }}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <h4 className="font-bold text-green-800 dark:text-green-300 mb-1">Account Secured</h4>
                        <p className="text-sm text-green-700 dark:text-green-400">Your account is protected with industry-standard encryption.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 shadow-lg border border-sand-200 dark:border-charcoal-700 max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white font-display flex items-center gap-2">
                    <span>📂</span> My Documents
                  </h2>
                  <Button variant="primary" onClick={() => setShowDocForm(!showDocForm)}>
                    {showDocForm ? 'Cancel' : '+ Upload Document'}
                  </Button>
                </div>

                {showDocForm && (
                  <form onSubmit={handleUploadDocument} className="bg-sand-50 dark:bg-charcoal-800 p-6 rounded-xl mb-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-charcoal-700 dark:text-sand-200">Document Name</label>
                      <input
                        required
                        type="text"
                        value={docName}
                        onChange={e => setDocName(e.target.value)}
                        placeholder="e.g. My Passport"
                        className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-charcoal-700 dark:border-charcoal-600 focus:ring-2 focus:ring-forest-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-charcoal-700 dark:text-sand-200">Document Type</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-charcoal-700 dark:border-charcoal-600 focus:ring-2 focus:ring-forest-500"
                      >
                        <option value="adhar">Aadhar Card</option>
                        <option value="passport">Passport</option>
                        <option value="license">Driving License</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-charcoal-700 dark:text-sand-200">File (PDF/Image, max 5MB)</label>
                      <input
                        required
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => setDocFile(e.target.files?.[0] || null)}
                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-forest-50 file:text-forest-700 hover:file:bg-forest-100"
                      />
                    </div>
                    <Button type="submit" variant="primary" className="w-full" isLoading={uploadingDoc}>
                      Upload Document
                    </Button>
                  </form>
                )}

                <div className="space-y-3">
                  {documents.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📄</div>
                      <p className="text-charcoal-400 dark:text-sand-500">No documents uploaded yet.</p>
                      <p className="text-sm text-charcoal-500 dark:text-sand-600 mt-2">Upload your travel documents for easy access.</p>
                    </div>
                  ) : (
                    documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-sand-50 dark:bg-charcoal-800 rounded-xl hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl">
                            📄
                          </div>
                          <div>
                            <div className="font-bold text-charcoal-900 dark:text-white">{doc.name}</div>
                            <div className="text-sm text-charcoal-500 dark:text-sand-400 capitalize">{doc.type}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDocument(doc.file_path)}
                            title="View"
                            className="p-2 hover:bg-white dark:hover:bg-charcoal-700 rounded-lg text-blue-600 dark:text-blue-400 transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id, doc.file_path)}
                            title="Delete"
                            className="p-2 hover:bg-white dark:hover:bg-charcoal-700 rounded-lg text-red-600 dark:text-red-400 transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 shadow-lg border border-sand-200 dark:border-charcoal-700 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6 font-display flex items-center gap-2">
                  <span>⚙️</span> Travel Preferences
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-charcoal-700 dark:text-sand-200">Default Budget</label>
                    <select
                      value={preferences.defaultBudget}
                      onChange={(e) => setPreferences({ ...preferences, defaultBudget: e.target.value })}
                      className="w-full px-4 py-3 bg-sand-50 dark:bg-charcoal-800 border border-sand-200 dark:border-charcoal-700 rounded-xl focus:ring-2 focus:ring-forest-500"
                    >
                      {['Backpacker', 'Budget', 'Moderate', 'Luxury', 'Ultra Luxury'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-charcoal-700 dark:text-sand-200">Favorite Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map(interest => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${preferences.favoriteInterests.includes(interest)
                            ? 'bg-gradient-to-r from-forest-500 to-forest-700 text-white shadow-lg scale-105'
                            : 'bg-sand-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-charcoal-700'
                            }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-charcoal-700 dark:text-sand-200">Activity Level</label>
                    <select
                      value={preferences.activityLevel}
                      onChange={(e) => setPreferences({ ...preferences, activityLevel: e.target.value })}
                      className="w-full px-4 py-3 bg-sand-50 dark:bg-charcoal-800 border border-sand-200 dark:border-charcoal-700 rounded-xl focus:ring-2 focus:ring-forest-500"
                    >
                      {['Relaxed', 'Moderate', 'Active', 'Very Active'].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>

                  <Button onClick={handleSavePreferences} variant="primary" className="w-full">
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {/* Achievements Tab (Passport & Badges) */}
            {activeTab === 'achievements' && (
              <div className="space-y-8">
                {/* Badges Section */}
                <div className="bg-white dark:bg-charcoal-900 rounded-[2rem] p-8 shadow-lg border border-sand-200 dark:border-charcoal-700">
                  <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6 font-display flex items-center gap-2">
                    <span>🏆</span> Travel Badges
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {GAMIFICATION.getBadges(user).map(badge => (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-2xl border text-center transition-all ${badge.earned
                          ? `bg-gradient-to-br ${badge.color} text-white border-transparent shadow-lg transform hover:scale-105`
                          : 'bg-sand-50 dark:bg-charcoal-800 border-sand-200 dark:border-charcoal-700 opacity-60 grayscale'
                          }`}
                      >
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <h3 className={`font-bold text-sm mb-1 ${badge.earned ? 'text-white' : 'text-charcoal-700 dark:text-sand-300'}`}>{badge.name}</h3>
                        <p className={`text-xs leading-tight ${badge.earned ? 'text-white/90' : 'text-charcoal-500 dark:text-charcoal-400'}`}>{badge.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Passport Section */}
                <div className="bg-forest-900 dark:bg-charcoal-900 rounded-[2rem] p-8 shadow-2xl border-4 border-forest-800 dark:border-charcoal-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-20"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8 border-b border-forest-700 pb-4">
                      <h2 className="text-3xl font-bold text-sand-100 font-display flex items-center gap-3">
                        <span className="text-4xl">🛂</span> Travel Passport
                      </h2>
                      <div className="text-forest-300 font-mono text-xs md:text-sm">
                        ID: {user.id.substring(0, 8).toUpperCase()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {GAMIFICATION.getPassportStamps(user).length > 0 ? (
                        GAMIFICATION.getPassportStamps(user).map(stamp => (
                          <div key={stamp.id} className="aspect-square bg-sand-100 rounded-full border-4 border-dashed border-forest-700/50 flex flex-col items-center justify-center p-2 transform rotate-[-6deg] hover:rotate-0 transition-transform cursor-pointer shadow-lg hover:shadow-xl group">
                            <div className="text-center">
                              <div className="text-forest-900 font-bold text-xs uppercase tracking-widest mb-1 group-hover:text-forest-700">VISITED</div>
                              <div className="text-forest-800 font-black text-sm md:text-lg leading-none mb-1">{stamp.city}</div>
                              <div className="text-forest-600 text-[10px] font-mono">{stamp.date}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-12 text-center text-forest-300/50 italic">
                          No stamps yet. Plan a trip to get your first stamp!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};
