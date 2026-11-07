import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input, LoadingSpinner } from '@/components/common';
import { contentService } from '@/services/supabase/content.service';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({
    school_name: 'OM OPEN MINDS',
    school_tagline: 'Specialized School for Children with Diverse Learning Needs',
    contact_email: 'office@omopenminds.example',
    contact_phone: '+91 000 000 0000',
    campus_address: 'Campus Address Placeholder, Bangalore, Karnataka, India',
    office_hours: 'Monday – Friday, 8:30 AM – 3:30 PM',
    admissions_open: 'true',
    emergency_notice: '',
    footer_text: '© OM OPEN MINDS. A specialized educational community committed to inclusive growth.',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await contentService.getSiteSettings();
    if (!error && data) {
      setSettings((prev) => ({ ...prev, ...data }));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    try {
      const updatePromises = Object.entries(settings).map(([key, val]) =>
        contentService.updateSetting(key, val)
      );

      await Promise.all(updatePromises);
      setNotification('Website settings saved and synchronized.');
    } catch {
      setNotification('Failed to update some settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article aria-labelledby="settings-management-heading">
      <header style={{ marginBottom: '24px' }}>
        <h1
          id="settings-management-heading"
          style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}
        >
          Website &amp; Institutional Settings
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
          Manage official contact details, institutional identity, office hours, and footer declarations.
        </p>
      </header>

      {notification && (
        <div
          role="status"
          style={{
            padding: '10px 16px',
            backgroundColor: '#064e3b',
            border: '1px solid #047857',
            borderRadius: '6px',
            color: '#d1fae5',
            fontSize: '13px',
            marginBottom: '20px',
          }}
        >
          {notification}
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner label="Loading settings..." />
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
          {/* Institutional Identity Card */}
          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc', margin: '0 0 16px 0' }}>
              Institutional Identity
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                id="set-school-name"
                label="School Legal / Display Name"
                value={settings.school_name}
                onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                required
              />
              <Input
                id="set-tagline"
                label="Mission / Tagline"
                value={settings.school_tagline}
                onChange={(e) => setSettings({ ...settings, school_tagline: e.target.value })}
              />
            </div>
          </Card>

          {/* Contact Details Card */}
          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc', margin: '0 0 16px 0' }}>
              Official Contact &amp; Campus Location
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <Input
                id="set-email"
                type="email"
                label="General Administrative Email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                required
              />
              <Input
                id="set-phone"
                label="Primary Reception Phone"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="set-address"
                style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}
              >
                Physical Campus Address
              </label>
              <textarea
                id="set-address"
                rows={2}
                value={settings.campus_address}
                onChange={(e) => setSettings({ ...settings, campus_address: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            <Input
              id="set-hours"
              label="Visiting &amp; Office Hours"
              value={settings.office_hours}
              onChange={(e) => setSettings({ ...settings, office_hours: e.target.value })}
              placeholder="e.g. Monday – Friday: 8:30 AM – 3:30 PM"
            />
          </Card>

          {/* Operational Status & Banners */}
          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc', margin: '0 0 16px 0' }}>
              Operational Status &amp; Alerts
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#f8fafc' }}>
                <input
                  type="checkbox"
                  checked={settings.admissions_open === 'true'}
                  onChange={(e) => setSettings({ ...settings, admissions_open: e.target.checked ? 'true' : 'false' })}
                  style={{ width: '16px', height: '16px' }}
                />
                <span>Admissions consultations currently active</span>
              </label>
            </div>

            <div>
              <Input
                id="set-emergency"
                label="Urgent Marquee Alert (Leave blank if none active)"
                value={settings.emergency_notice}
                onChange={(e) => setSettings({ ...settings, emergency_notice: e.target.value })}
                placeholder="e.g. Campus closed tomorrow for public holiday."
              />
            </div>
          </Card>

          {/* Footer Text */}
          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc', margin: '0 0 16px 0' }}>
              Footer Information
            </h2>
            <div>
              <label
                htmlFor="set-footer"
                style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}
              >
                Copyright &amp; Regulatory Notice
              </label>
              <textarea
                id="set-footer"
                rows={2}
                value={settings.footer_text}
                onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button type="button" variant="outline" onClick={loadSettings} disabled={isSaving} style={{ borderColor: '#475569', color: '#cbd5e1' }}>
              Reset Changes
            </Button>
            <Button type="submit" isLoading={isSaving} style={{ padding: '10px 24px' }}>
              Save All Settings
            </Button>
          </div>
        </form>
      )}
    </article>
  );
};
