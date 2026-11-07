import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, Button, StatusBadge, LoadingSpinner } from '@/components/common';
import { dashboardService, DashboardMetrics } from '@/services/supabase/dashboard.service';
import { enquiriesService } from '@/services/supabase/enquiries.service';
import { AdmissionEnquiry, ContactEnquiry, AdmissionEnquiryStatus, ContactEnquiryStatus } from '@/types/database.types';
import { ROUTES } from '@/config/constants';
import { env } from '@/config/env';

export const AdminDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentAdmissions, setRecentAdmissions] = useState<AdmissionEnquiry[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [metricsRes, admissionsRes, contactsRes] = await Promise.all([
      dashboardService.getMetrics(),
      dashboardService.getRecentAdmissions(5),
      dashboardService.getRecentContacts(5),
    ]);

    if (metricsRes.data) setMetrics(metricsRes.data);
    if (admissionsRes.data) setRecentAdmissions(admissionsRes.data);
    if (contactsRes.data) setRecentContacts(contactsRes.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateAdmissionStatus = async (id: string, newStatus: AdmissionEnquiryStatus) => {
    setActionMessage(null);
    const { error } = await enquiriesService.updateAdmissionEnquiryStatus(id, newStatus);
    if (!error) {
      setActionMessage('Admission enquiry status updated.');
      loadData();
    }
  };

  const handleUpdateContactStatus = async (id: string, newStatus: ContactEnquiryStatus) => {
    setActionMessage(null);
    const { error } = await enquiriesService.updateContactEnquiryStatus(id, newStatus);
    if (!error) {
      setActionMessage('Contact message status updated.');
      loadData();
    }
  };

  return (
    <article aria-labelledby="admin-dashboard-heading">
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            id="admin-dashboard-heading"
            style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}
          >
            Dashboard Overview
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Welcome back, <strong>{profile?.full_name || user?.email}</strong>. Operational status across enquiries and content.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="outline"
            onClick={loadData}
            style={{ borderColor: '#334155', color: '#cbd5e1', fontSize: '13px', padding: '6px 14px' }}
          >
            Refresh Data
          </Button>
          <Link to={ROUTES.ADMIN.ADMISSIONS}>
            <Button style={{ fontSize: '13px', padding: '6px 14px' }}>Review Inquiries</Button>
          </Link>
        </div>
      </header>

      {/* Supabase Status Banner */}
      {!env.isSupabaseConfigured && (
        <div
          role="alert"
          style={{
            padding: '12px 16px',
            backgroundColor: '#451a03',
            border: '1px solid #78350f',
            borderRadius: '6px',
            color: '#fef3c7',
            fontSize: '13px',
            marginBottom: '24px',
            lineHeight: 1.5,
          }}
        >
          <strong>Notice:</strong> Running in demo / unconfigured mode. Set <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code> to synchronize with the live database.
        </div>
      )}

      {actionMessage && (
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
          {actionMessage}
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner label="Loading dashboard metrics..." />
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <section aria-labelledby="metrics-heading" style={{ marginBottom: '32px' }}>
            <h2 id="metrics-heading" className="visually-hidden">Key Performance Metrics</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
              }}
            >
              {/* Admissions Total & Pending */}
              <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Admission Enquiries
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0 4px 0' }}>
                  <span style={{ fontSize: '32px', fontWeight: 700, color: '#f8fafc' }}>
                    {metrics?.totalAdmissions ?? 0}
                  </span>
                  {metrics && metrics.newAdmissions > 0 && (
                    <span style={{ fontSize: '13px', color: '#fcd34d', fontWeight: 600 }}>
                      ({metrics.newAdmissions} pending)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {metrics?.scheduledAdmissions ?? 0} consultation(s) scheduled
                </div>
              </Card>

              {/* Contact Messages Total & Unread */}
              <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Contact Messages
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0 4px 0' }}>
                  <span style={{ fontSize: '32px', fontWeight: 700, color: '#f8fafc' }}>
                    {metrics?.totalContacts ?? 0}
                  </span>
                  {metrics && metrics.unreadContacts > 0 && (
                    <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 600 }}>
                      ({metrics.unreadContacts} unread)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  General campus communications
                </div>
              </Card>

              {/* Programmes & Events */}
              <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Educational Offerings
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0 4px 0' }}>
                  <span style={{ fontSize: '32px', fontWeight: 700, color: '#38bdf8' }}>
                    {metrics?.publishedProgrammes ?? 0}
                  </span>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Programmes</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {metrics?.publishedEvents ?? 0} active activities &amp; events
                </div>
              </Card>

              {/* Announcements & Media */}
              <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Notices &amp; Media
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0 4px 0' }}>
                  <span style={{ fontSize: '32px', fontWeight: 700, color: '#34d399' }}>
                    {metrics?.publishedAnnouncements ?? 0}
                  </span>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Announcements</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {metrics?.publishedGallery ?? 0} approved gallery photos
                </div>
              </Card>
            </div>
          </section>

          {/* Quick Actions Shortcuts */}
          <section aria-labelledby="quick-actions-heading" style={{ marginBottom: '32px' }}>
            <h2
              id="quick-actions-heading"
              style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 12px 0', color: '#e2e8f0' }}
            >
              Management Shortcuts
            </h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to={ROUTES.ADMIN.ANNOUNCEMENTS}>
                <Button variant="outline" style={{ borderColor: '#334155', color: '#e2e8f0', fontSize: '13px' }}>
                  + New Announcement
                </Button>
              </Link>
              <Link to={ROUTES.ADMIN.PROGRAMMES}>
                <Button variant="outline" style={{ borderColor: '#334155', color: '#e2e8f0', fontSize: '13px' }}>
                  + Add Programme
                </Button>
              </Link>
              <Link to={ROUTES.ADMIN.GALLERY}>
                <Button variant="outline" style={{ borderColor: '#334155', color: '#e2e8f0', fontSize: '13px' }}>
                  + Upload Gallery Media
                </Button>
              </Link>
              <Link to={ROUTES.ADMIN.SETTINGS}>
                <Button variant="outline" style={{ borderColor: '#334155', color: '#e2e8f0', fontSize: '13px' }}>
                  Website Settings
                </Button>
              </Link>
            </div>
          </section>

          {/* Recent Enquiries Two-Column Feed */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Recent Admissions */}
            <section aria-labelledby="recent-admissions-heading">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2
                  id="recent-admissions-heading"
                  style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#f8fafc' }}
                >
                  Recent Admissions Intake
                </h2>
                <Link to={ROUTES.ADMIN.ADMISSIONS} style={{ fontSize: '13px', color: '#38bdf8', textDecoration: 'none' }}>
                  View All &rarr;
                </Link>
              </div>

              <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '8px 16px' }}>
                {recentAdmissions.length === 0 ? (
                  <p style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 }}>
                    No admission enquiries recorded yet.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {recentAdmissions.map((enquiry) => (
                      <div
                        key={enquiry.id}
                        style={{
                          padding: '12px 0',
                          borderBottom: '1px solid #334155',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '14px', color: '#f8fafc' }}>
                              {enquiry.parent_name}
                            </strong>
                            <StatusBadge status={enquiry.status} />
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                            Child: {enquiry.child_name} {enquiry.child_age ? `(${enquiry.child_age} yrs)` : ''} &bull; {enquiry.phone}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                            Submitted: {new Date(enquiry.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Quick Status Action */}
                        <select
                          value={enquiry.status}
                          onChange={(e) => handleUpdateAdmissionStatus(enquiry.id, e.target.value as AdmissionEnquiryStatus)}
                          aria-label={`Update status for ${enquiry.parent_name}`}
                          style={{
                            backgroundColor: '#0f172a',
                            color: '#cbd5e1',
                            border: '1px solid #475569',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_review">In Review</option>
                          <option value="contacted">Contacted</option>
                          <option value="consultation_scheduled">Consultation Scheduled</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </section>

            {/* Recent Contact Messages */}
            <section aria-labelledby="recent-contacts-heading">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2
                  id="recent-contacts-heading"
                  style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#f8fafc' }}
                >
                  Recent Contact Inquiries
                </h2>
                <Link to={ROUTES.ADMIN.CONTACT} style={{ fontSize: '13px', color: '#38bdf8', textDecoration: 'none' }}>
                  View All &rarr;
                </Link>
              </div>

              <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '8px 16px' }}>
                {recentContacts.length === 0 ? (
                  <p style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 }}>
                    No contact inquiries recorded yet.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {recentContacts.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          padding: '12px 0',
                          borderBottom: '1px solid #334155',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '14px', color: '#f8fafc' }}>
                              {msg.name}
                            </strong>
                            <StatusBadge status={msg.status} />
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            Subject: {msg.subject}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                            Received: {new Date(msg.created_at).toLocaleDateString()} &bull; {msg.email}
                          </div>
                        </div>

                        <select
                          value={msg.status}
                          onChange={(e) => handleUpdateContactStatus(msg.id, e.target.value as ContactEnquiryStatus)}
                          aria-label={`Update status for ${msg.name}`}
                          style={{
                            backgroundColor: '#0f172a',
                            color: '#cbd5e1',
                            border: '1px solid #475569',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                          }}
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </section>
          </div>
        </>
      )}
    </article>
  );
};
