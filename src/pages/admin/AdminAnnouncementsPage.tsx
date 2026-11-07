import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input, StatusBadge, LoadingSpinner, Modal, ConfirmDialog } from '@/components/common';
import { announcementsService, CreateAnnouncementInput, UpdateAnnouncementInput } from '@/services/supabase/announcements.service';
import { Announcement, AnnouncementCategory } from '@/types/database.types';

export const AdminAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    category: AnnouncementCategory;
    summary: string;
    link_url: string;
    publish_date: string;
    expiration_date: string;
    display_order: number;
    is_active: boolean;
  }>({
    title: '',
    category: 'general',
    summary: '',
    link_url: '',
    publish_date: new Date().toISOString().split('T')[0],
    expiration_date: '',
    display_order: 0,
    is_active: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [itemToDelete, setItemToDelete] = useState<Announcement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadAnnouncements = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await announcementsService.getAllAnnouncementsAdmin();
    if (!error && data) {
      setAnnouncements(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const filteredAnnouncements = announcements.filter(
    (a) => categoryFilter === 'all' || a.category === categoryFilter
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'general',
      summary: '',
      link_url: '',
      publish_date: new Date().toISOString().split('T')[0],
      expiration_date: '',
      display_order: announcements.length + 1,
      is_active: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Announcement) => {
    setEditingId(a.id);
    setFormData({
      title: a.title,
      category: a.category,
      summary: a.summary || '',
      link_url: a.link_url || '',
      publish_date: a.publish_date,
      expiration_date: a.expiration_date || '',
      display_order: a.display_order,
      is_active: a.is_active,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('Announcement title is required.');
      return;
    }

    setIsSaving(true);

    if (editingId) {
      const updatePayload: UpdateAnnouncementInput = {
        title: formData.title.trim(),
        category: formData.category,
        summary: formData.summary.trim() || null,
        link_url: formData.link_url.trim() || null,
        publish_date: formData.publish_date,
        expiration_date: formData.expiration_date.trim() || null,
        display_order: Number(formData.display_order) || 0,
        is_active: formData.is_active,
      };

      const { error } = await announcementsService.updateAnnouncement(editingId, updatePayload);
      setIsSaving(false);

      if (error) {
        setFormError(error.message);
      } else {
        setNotification('Announcement updated successfully.');
        setIsModalOpen(false);
        loadAnnouncements();
      }
    } else {
      const createPayload: CreateAnnouncementInput = {
        title: formData.title.trim(),
        category: formData.category,
        summary: formData.summary.trim() || null,
        link_url: formData.link_url.trim() || null,
        publish_date: formData.publish_date,
        expiration_date: formData.expiration_date.trim() || null,
        display_order: Number(formData.display_order) || 0,
        is_active: formData.is_active,
      };

      const { error } = await announcementsService.createAnnouncement(createPayload);
      setIsSaving(false);

      if (error) {
        setFormError(error.message);
      } else {
        setNotification('Announcement created.');
        setIsModalOpen(false);
        loadAnnouncements();
      }
    }
  };

  const handleTogglePublish = async (a: Announcement) => {
    const { error } = await announcementsService.updateAnnouncement(a.id, { is_active: !a.is_active });
    if (!error) {
      setNotification(`Notice "${a.title}" ${!a.is_active ? 'published' : 'unpublished'}.`);
      loadAnnouncements();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const { error } = await announcementsService.deleteAnnouncement(itemToDelete.id);
    setIsDeleting(false);

    if (!error) {
      setNotification('Notice deleted.');
      setItemToDelete(null);
      loadAnnouncements();
    }
  };

  return (
    <article aria-labelledby="announcements-management-heading">
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            id="announcements-management-heading"
            style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}
          >
            Announcements &amp; Urgent Notices
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Website top banner, ticker alerts, holiday notifications, and admissions updates. Total: {announcements.length}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" onClick={loadAnnouncements} style={{ borderColor: '#334155', color: '#cbd5e1' }}>
            Refresh
          </Button>
          <Button onClick={handleOpenCreate}>
            + New Announcement
          </Button>
        </div>
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

      {/* Filter Toolbar */}
      <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', marginBottom: '24px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <label htmlFor="filter-ann-cat" style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>
            Filter by Category:
          </label>
          <select
            id="filter-ann-cat"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          >
            <option value="all">All Categories</option>
            <option value="urgent">Urgent Alerts</option>
            <option value="admissions">Admissions</option>
            <option value="calendar">Term &amp; Calendar Dates</option>
            <option value="general">General Notices</option>
          </select>
        </div>
      </Card>

      {isLoading ? (
        <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner label="Loading announcements..." />
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '40px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#94a3b8' }}>
            No announcements found.
          </p>
          <Button onClick={handleOpenCreate}>Publish an Announcement</Button>
        </Card>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a', color: '#94a3b8' }}>
                <th style={{ padding: '12px 16px' }}>Order</th>
                <th style={{ padding: '12px 16px' }}>Title &amp; Summary</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Publish Date</th>
                <th style={{ padding: '12px 16px' }}>Expires</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnnouncements.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid #334155', color: '#f8fafc' }}>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>
                    #{a.display_order}
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: '320px' }}>
                    <strong style={{ color: '#f8fafc' }}>{a.title}</strong>
                    {a.summary && (
                      <div style={{ fontSize: '12px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.summary}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #334155', fontSize: '11px', textTransform: 'uppercase', color: a.category === 'urgent' ? '#fca5a5' : '#38bdf8' }}>
                      {a.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                    {a.publish_date}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>
                    {a.expiration_date || 'None (Permanent)'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusBadge status={a.is_active ? 'published' : 'draft'} />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <Button
                        variant="outline"
                        onClick={() => handleTogglePublish(a)}
                        style={{
                          padding: '4px 8px',
                          minHeight: '28px',
                          fontSize: '11px',
                          borderColor: '#334155',
                          color: a.is_active ? '#fcd34d' : '#6ee7b7',
                        }}
                      >
                        {a.is_active ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleOpenEdit(a)}
                        style={{
                          padding: '4px 10px',
                          minHeight: '28px',
                          fontSize: '12px',
                          borderColor: '#334155',
                          color: '#38bdf8',
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => setItemToDelete(a)}
                        style={{
                          padding: '4px 8px',
                          minHeight: '28px',
                          fontSize: '12px',
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? 'Edit Announcement' : 'New School Announcement'}
          maxWidth="600px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formError && (
              <div role="alert" style={{ padding: '10px 14px', backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px', color: '#fca5a5', fontSize: '13px' }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <Input
                id="ann-title"
                label="Headline Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Admissions Consultation Window Open"
                required
              />
              <div>
                <label htmlFor="ann-cat" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  id="ann-cat"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as AnnouncementCategory })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  <option value="general">General</option>
                  <option value="urgent">Urgent</option>
                  <option value="admissions">Admissions</option>
                  <option value="calendar">Calendar</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="ann-summary" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                Summary / Details
              </label>
              <textarea
                id="ann-summary"
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Short explanatory text for parents..."
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
              id="ann-link"
              label="Action Link (optional)"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="/admissions or https://..."
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                id="ann-pub-date"
                type="date"
                label="Publish Date *"
                value={formData.publish_date}
                onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                required
              />
              <Input
                id="ann-exp-date"
                type="date"
                label="Expiration Date (optional)"
                value={formData.expiration_date}
                onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <Input
                id="ann-order"
                type="number"
                label="Display Order"
                value={String(formData.display_order)}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
              />

              <div style={{ marginTop: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#f8fafc' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Active on ticker / banner</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                style={{ borderColor: '#475569', color: '#cbd5e1' }}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSaving}>
                {editingId ? 'Update Notice' : 'Publish Notice'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {itemToDelete && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          title="Delete Announcement"
          message={`Are you sure you want to delete "${itemToDelete.title}"?`}
        />
      )}
    </article>
  );
};
