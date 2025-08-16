import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import DynamicTitle from '../components/DynamicTitle';
import { FaBell, FaUserCog, FaShieldAlt, FaSave } from 'react-icons/fa';

/*
  Settings Page
  Layout attempts to follow a golden‑ratio inspired proportion on large screens:
  Left column ~38.2% (preferences navigation / quick actions)
  Right column ~61.8% (detailed panels)
  Implemented with a 10-column grid (4/6 split ≈ 0.40 / 0.60 close to 0.382 / 0.618).
*/
const Settings = () => {
  const { user } = useAuth();
  // Theme controls removed per request (appearance + quick toggle eliminated)

  // Local (mock) preferences – could be persisted to backend later
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    marketingEmails: false,
    adoptionUpdates: true,
    donationReminders: true,
    autoPlayVideos: false
  });
  const [saving, setSaving] = useState(false);
  const [activePanel, setActivePanel] = useState('notifications');

  const updatePref = (key) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate async save
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
  };

  const panels = [
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'account', label: 'Account', icon: FaUserCog },
    { id: 'privacy', label: 'Privacy & Security', icon: FaShieldAlt }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12">
      <DynamicTitle title="Settings - Customize Your Experience" />
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-6">
            <FaUserCog className="w-5 h-5" />
            <span>Settings</span>
          </div>
          <h1 className="font-secondary font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Customize Your Experience
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Adjust your preferences, theme, notifications, and privacy settings to make PetConnect feel just right.
          </p>
        </div>

        {/* Golden Ratio Inspired Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
          {/* Left Column */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="backdrop-blur-lg bg-base-100/40 border border-base-content/10 rounded-3xl p-6">
              <h2 className="text-base font-semibold text-base-content/70 mb-4 tracking-wide">PREFERENCES</h2>
              <nav className="space-y-2">
                {panels.map(p => {
                  const Icon = p.icon;
                  const active = activePanel === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActivePanel(p.id)}
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all text-left group font-medium border ${active ? 'bg-gradient-to-r from-primary/90 to-secondary/90 text-primary-content shadow-lg border-transparent' : 'bg-base-100/40 border-base-content/10 hover:border-primary/40 hover:bg-base-100/60'} `}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                      <span className="flex-1">{p.label}</span>
                      {active && <span className="text-xs opacity-80">Active</span>}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Theme toggle removed */}
          </aside>

          {/* Right Column */}
          <section className="lg:col-span-6 space-y-8">
            {/* Appearance Panel removed as requested */}

            {/* Notifications Panel */}
            {activePanel === 'notifications' && (
              <div className="backdrop-blur-lg bg-base-100/50 border border-base-content/10 rounded-3xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-base-content mb-2 flex items-center gap-3">
                  <FaBell className="text-primary" /> Notifications
                </h2>
                <p className="text-base-content/70 mb-6">Control which updates you receive.</p>
                <div className="space-y-5">
                  {[
                    { key: 'emailNotifications', label: 'General Email Notifications', desc: 'Receive updates about your account and activity.' },
                    { key: 'adoptionUpdates', label: 'Adoption Updates', desc: 'Be notified when there are updates about pets you follow.' },
                    { key: 'donationReminders', label: 'Donation Reminders', desc: 'Get gentle nudges about campaigns you supported.' },
                    { key: 'marketingEmails', label: 'News & Tips', desc: 'Occasional newsletters with helpful resources.' },
                    { key: 'autoPlayVideos', label: 'Auto‑Play Media', desc: 'Automatically play campaign videos (may use more data).' }
                  ].map(item => (
                    <div key={item.key} className="flex items-start gap-4 p-4 rounded-2xl border border-base-content/10 bg-base-100/40 hover:border-primary/40 transition-all">
                      <input
                        id={item.key}
                        type="checkbox"
                        checked={prefs[item.key]}
                        onChange={() => updatePref(item.key)}
                        className="toggle toggle-primary mt-1"
                      />
                      <label htmlFor={item.key} className="flex-1 cursor-pointer select-none">
                        <p className="font-medium text-base-content mb-1">{item.label}</p>
                        <p className="text-sm text-base-content/70 leading-snug">{item.desc}</p>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Panel */}
            {activePanel === 'account' && (
              <div className="backdrop-blur-lg bg-base-100/50 border border-base-content/10 rounded-3xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-base-content mb-2 flex items-center gap-3">
                  <FaUserCog className="text-primary" /> Account
                </h2>
                <p className="text-base-content/70 mb-6">Manage account related preferences.</p>
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl border border-base-content/10 bg-base-100/40">
                    <h3 className="font-semibold mb-2">Logged in as</h3>
                    <p className="text-sm text-base-content/70">{user?.email}</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-base-content/10 bg-base-100/40">
                    <h3 className="font-semibold mb-2">Password</h3>
                    <p className="text-sm text-base-content/70 mb-3">You can reset your password from the login screen if you've forgotten it.</p>
                    <button className="btn btn-outline btn-sm">Send Password Reset Email</button>
                  </div>
                  <div className="p-5 rounded-2xl border border-base-content/10 bg-base-100/40">
                    <h3 className="font-semibold mb-2">Danger Zone</h3>
                    <p className="text-sm text-base-content/70 mb-3">Delete your account and all associated data. This action cannot be undone.</p>
                    <button className="btn btn-error btn-sm">Delete Account</button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Panel */}
            {activePanel === 'privacy' && (
              <div className="backdrop-blur-lg bg-base-100/50 border border-base-content/10 rounded-3xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-base-content mb-2 flex items-center gap-3">
                  <FaShieldAlt className="text-primary" /> Privacy & Security
                </h2>
                <p className="text-base-content/70 mb-6">Control how your data is used and displayed.</p>
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl border border-base-content/10 bg-base-100/40 flex items-start gap-4">
                    <input type="checkbox" className="checkbox checkbox-primary mt-1" id="showProfile" defaultChecked />
                    <label htmlFor="showProfile" className="flex-1 cursor-pointer">
                      <p className="font-medium mb-1">Show Profile Publicly</p>
                      <p className="text-sm text-base-content/70">Allows others to view your display name and avatar.</p>
                    </label>
                  </div>
                  <div className="p-5 rounded-2xl border border-base-content/10 bg-base-100/40 flex items-start gap-4">
                    <input type="checkbox" className="checkbox checkbox-primary mt-1" id="trackAnalytics" defaultChecked />
                    <label htmlFor="trackAnalytics" className="flex-1 cursor-pointer">
                      <p className="font-medium mb-1">Anonymous Usage Analytics</p>
                      <p className="text-sm text-base-content/70">Help us improve pets discovery experience by sharing anonymous usage data.</p>
                    </label>
                  </div>
                  <div className="p-5 rounded-2xl border border-base-content/10 bg-base-100/40 flex items-start gap-4">
                    <input type="checkbox" className="checkbox checkbox-primary mt-1" id="emailVisibility" />
                    <label htmlFor="emailVisibility" className="flex-1 cursor-pointer">
                      <p className="font-medium mb-1">Hide Email from Public</p>
                      <p className="text-sm text-base-content/70">Your email will never be shown to other users if enabled.</p>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Save Bar */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-base-content/10">
              <p className="text-sm text-base-content/60">Preferences are stored locally. Server persistence coming soon.</p>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary gap-2"
              >
                {saving ? <span className="loading loading-spinner loading-sm"></span> : <FaSave className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
