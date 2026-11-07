import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input, StatusBadge, LoadingSpinner, Modal, ConfirmDialog } from '@/components/common';
import { eventsService, CreateActivityInput, UpdateActivityInput } from '@/services/supabase/events.service';
import { Activity, ActivityType } from '@/types/database.types';

export const AdminActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    activity_type: ActivityType;
    description: string;
    event_date: string;
    frequency: string;
    image_url: string;
    image_alt: string;
    display_order: number;
    is_active: boolean;
  }>({
    title: '',
    slug: '',
    activity_type: 'Upcoming Event',
    description: '',
    event_date: '',
    frequency: '',
    image_url: '',
    image_alt: '',
    display_order: 0,
    is_active: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [itemToDelete, setItemToDelete] = useState<Activity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadActivities = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await eventsService.getAllActivitiesAdmin();
    if (!error && data) {
      setActivities(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const filteredActivities = activities.filter(
    (a) => typeFilter === 'all' || a.activity_type === typeFilter
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      activity_type: 'Upcoming Event',
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      frequency: '',
      image_url: '',
      image_alt: '',
      display_order: activities.length + 1,
      is_active: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Activity) => {
    setEditingId(a.id);
    setFormData({
      title: a.title,
      slug: a.slug,
      activity_type: a.activity_type,
      description: a.description,
      event_date: a.event_date || '',
      frequency: a.frequency || '',
      image_url: a.image_url || '',
      image_alt: a.image_alt || '',
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
      setFormError('Activity/Event title is required.');
      return;
    }

    const slug = formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    setIsSaving(true);

    if (editingId) {
      const updatePayload: UpdateActivityInput = {
        title: formData.title.trim(),
        slug,
        activity_type: formData.activity_type,
        description: formData.description.trim(),
        event_date: formData.event_date.trim() || null,
        frequency: formData.frequency.trim() || null,
        image_url: formData.image_url.trim() || null,
        image_alt: formData.image_alt.trim() || null,
        display_order: Number(formData.display_order) || 0,
        is_active: formData.is_active,
      };

      const { error } = await eventsService.updateActivity(editingId, updatePayload);
      setIsSaving(false);

      if (error) {
        setFormError(error.message);
      } else {
        setNotification('Activity/Event updated successfully.');
        setIsModalOpen(false);
        loadActivities();
      }
    } else {
      const createPayload: CreateActivityInput = {
        title: formData.title.trim(),
        slug,
        activity_type: formData.activity_type,
        description: formData.description.trim(),
        event_date: formData.event_date.trim() || null,
        frequency: formData.frequency.trim() || null,
        image_url: formData.image_url.trim() || null,
        image_alt: formData.image_alt.trim() || null,
        display_order: Number(formData.display_order) || 0,
        is_active: formData.is_active,
      };

      const { error } = await eventsService.createActivity(createPayload);
      setIsSaving(false);

      if (error) {
        setFormError(error.message);
      } else {
        setNotification('Activity/Event created successfully.');
        setIsModalOpen(false);
        loadActivities();
      }
    }
  };

  const handleTogglePublish = async (a: Activity) => {
    const { error } = await eventsService.updateActivity(a.id, { is_active: !a.is_active });
    if (!error) {
      setNotification(`Event "${a.title}" ${!a.is_active ? 'published' : 'unpublished'}.`);
      loadActivities();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const { error } = await eventsService.deleteActivity(itemToDelete.id);
    setIsDeleting(false);

    if (!error) {
      setNotification('Event removed.');
      setItemToDelete(null);
      loadActivities();
    }
  };

  return (
    <article aria-labelledby="activities-management-heading">
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
            id="activities-management-heading"
            style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}
          >
            Campus Activities &amp; Events
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Adaptive sports, creative arts, seasonal festivals, and milestones. Total: {activities.length}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" onClick={loadActivities} style={{ borderColor: '#334155', color: '#cbd5e1' }}>
            Refresh
          </Button>
          <Button onClick={handleOpenCreate}>
            + Add Event
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
          <label htmlFor="filter-act-type" style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>
            Filter by Event Type:
          </label>
          <select
            id="filter-act-type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          >
            <option value="all">All Types</option>
            <option value="Upcoming Event">Upcoming Events</option>
            <option value="Regular Activity">Regular Routine Activities</option>
            <option value="Past Milestone">Past Milestones &amp; Celebrations</option>
          </select>
        </div>
      </Card>

      {isLoading ? (
        <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner label="Loading events..." />
        </div>
      ) : filteredActivities.length === 0 ? (
        <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '40px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#94a3b8' }}>
            No activities or events found.
          </p>
          <Button onClick={handleOpenCreate}>Create First Event</Button>
        </Card>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a', color: '#94a3b8' }}>
                <th style={{ padding: '12px 16px' }}>Order</th>
                <th style={{ padding: '12px 16px' }}>Event Title</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Date / Frequency</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid #334155', color: '#f8fafc' }}>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>
                    #{a.display_order}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <strong style={{ color: '#f8fafc' }}>{a.title}</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>/{a.slug}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #334155', fontSize: '12px', color: '#38bdf8' }}>
                      {a.activity_type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                    {a.event_date ? new Date(a.event_date).toLocaleDateString() : (a.frequency || 'Regular')}
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
          title={editingId ? 'Edit Event / Activity' : 'Add New Event'}
          maxWidth="640px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formError && (
              <div role="alert" style={{ padding: '10px 14px', backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px', color: '#fca5a5', fontSize: '13px' }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <Input
                id="act-title"
                label="Event / Activity Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Annual Neurodiversity Sports Fest"
                required
              />
              <div>
                <label htmlFor="act-type" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                  Classification *
                </label>
                <select
                  id="act-type"
                  value={formData.activity_type}
                  onChange={(e) => setFormData({ ...formData, activity_type: e.target.value as ActivityType })}
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
                  <option value="Upcoming Event">Upcoming Event</option>
                  <option value="Regular Activity">Regular Activity</option>
                  <option value="Past Milestone">Past Milestone</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                id="act-date"
                type="date"
                label="Event Date (optional)"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              />
              <Input
                id="act-freq"
                label="Frequency / Routine (optional)"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                placeholder="Every Tuesday &amp; Thursday"
              />
            </div>

            <div>
              <label htmlFor="act-desc" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                Event Description *
              </label>
              <textarea
                id="act-desc"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Event itinerary, accommodations provided, sensory break spaces available..."
                required
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                id="act-img"
                label="Image URL (optional)"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://... or /assets/..."
              />
              <Input
                id="act-img-alt"
                label="Image Alt Text"
                value={formData.image_alt}
                onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                placeholder="Students participating in adaptive yoga circle"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <Input
                id="act-order"
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
                  <span>Published to website</span>
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
                {editingId ? 'Update Event' : 'Create Event'}
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
          title="Delete Event"
          message={`Are you sure you want to delete "${itemToDelete.title}"?`}
        />
      )}
    </article>
  );
};

