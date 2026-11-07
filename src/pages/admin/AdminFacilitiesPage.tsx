import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input, StatusBadge, LoadingSpinner, Modal, ConfirmDialog } from '@/components/common';
import { facilitiesService, CreateFacilityInput, UpdateFacilityInput } from '@/services/supabase/facilities.service';
import { Facility, FacilityCategory } from '@/types/database.types';

export const AdminFacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    category: FacilityCategory;
    description: string;
    accessibility_features: string; // newline separated
    image_url: string;
    image_alt: string;
    display_order: number;
    is_active: boolean;
  }>({
    title: '',
    slug: '',
    category: 'Sensory',
    description: '',
    accessibility_features: '',
    image_url: '',
    image_alt: '',
    display_order: 0,
    is_active: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [itemToDelete, setItemToDelete] = useState<Facility | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadFacilities = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await facilitiesService.getAllFacilitiesAdmin();
    if (!error && data) {
      setFacilities(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);

  const filteredFacilities = facilities.filter(
    (f) => categoryFilter === 'all' || f.category === categoryFilter
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Sensory',
      description: '',
      accessibility_features: '',
      image_url: '',
      image_alt: '',
      display_order: facilities.length + 1,
      is_active: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f: Facility) => {
    setEditingId(f.id);
    setFormData({
      title: f.title,
      slug: f.slug,
      category: f.category,
      description: f.description,
      accessibility_features: f.accessibility_features.join('\n'),
      image_url: f.image_url,
      image_alt: f.image_alt,
      display_order: f.display_order,
      is_active: f.is_active,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('Facility title is required.');
      return;
    }

    if (!formData.image_alt.trim() || formData.image_alt.trim().length < 15) {
      setFormError('Alternative text must be descriptive (at least 15 characters) for accessibility compliance.');
      return;
    }

    const slug = formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const features = formData.accessibility_features
      .split('\n')
      .map((feat) => feat.trim())
      .filter(Boolean);

    setIsSaving(true);

    if (editingId) {
      const updatePayload: UpdateFacilityInput = {
        title: formData.title.trim(),
        slug,
        category: formData.category,
        description: formData.description.trim(),
        accessibility_features: features,
        image_url: formData.image_url.trim() || '/assets/facilities/placeholder.jpg',
        image_alt: formData.image_alt.trim(),
        display_order: Number(formData.display_order) || 0,
        is_active: formData.is_active,
      };

      const { error } = await facilitiesService.updateFacility(editingId, updatePayload);
      setIsSaving(false);

      if (error) {
        setFormError(error.message);
      } else {
        setNotification('Facility updated successfully.');
        setIsModalOpen(false);
        loadFacilities();
      }
    } else {
      const createPayload: CreateFacilityInput = {
        title: formData.title.trim(),
        slug,
        category: formData.category,
        description: formData.description.trim(),
        accessibility_features: features,
        image_url: formData.image_url.trim() || '/assets/facilities/placeholder.jpg',
        image_alt: formData.image_alt.trim(),
        display_order: Number(formData.display_order) || 0,
        is_active: formData.is_active,
      };

      const { error } = await facilitiesService.createFacility(createPayload);
      setIsSaving(false);

      if (error) {
        setFormError(error.message);
      } else {
        setNotification('Facility created successfully.');
        setIsModalOpen(false);
        loadFacilities();
      }
    }
  };

  const handleTogglePublish = async (f: Facility) => {
    const { error } = await facilitiesService.updateFacility(f.id, { is_active: !f.is_active });
    if (!error) {
      setNotification(`Facility "${f.title}" ${!f.is_active ? 'published' : 'unpublished'}.`);
      loadFacilities();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const { error } = await facilitiesService.deleteFacility(itemToDelete.id);
    setIsDeleting(false);

    if (!error) {
      setNotification('Facility removed.');
      setItemToDelete(null);
      loadFacilities();
    }
  };

  return (
    <article aria-labelledby="facilities-management-heading">
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
            id="facilities-management-heading"
            style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}
          >
            Campus Facilities Management
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Sensory rooms, therapy units, and adaptive infrastructure. Total: {facilities.length}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" onClick={loadFacilities} style={{ borderColor: '#334155', color: '#cbd5e1' }}>
            Refresh
          </Button>
          <Button onClick={handleOpenCreate}>
            + Add Facility
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

      {/* Category Filter */}
      <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', marginBottom: '24px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <label htmlFor="filter-fac-cat" style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>
            Filter by Category:
          </label>
          <select
            id="filter-fac-cat"
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
            <option value="Sensory">Sensory Suites</option>
            <option value="Therapy">Therapy Units</option>
            <option value="Learning">Adaptive Learning</option>
            <option value="Recreation">Recreation &amp; Play</option>
          </select>
        </div>
      </Card>

      {isLoading ? (
        <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner label="Loading facilities..." />
        </div>
      ) : filteredFacilities.length === 0 ? (
        <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '40px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#94a3b8' }}>
            No campus facilities found for the selected filter.
          </p>
          <Button onClick={handleOpenCreate}>Add First Facility</Button>
        </Card>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a', color: '#94a3b8' }}>
                <th style={{ padding: '12px 16px' }}>Order</th>
                <th style={{ padding: '12px 16px' }}>Facility</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Accessibility Features</th>
                <th style={{ padding: '12px 16px' }}>Alt Text Verification</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacilities.map((f) => (
                <tr key={f.id} style={{ borderBottom: '1px solid #334155', color: '#f8fafc' }}>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>
                    #{f.display_order}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <strong style={{ color: '#f8fafc' }}>{f.title}</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>/{f.slug}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #334155', fontSize: '12px', color: '#38bdf8' }}>
                      {f.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                    {f.accessibility_features.length} feature(s)
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: '240px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.image_alt || '—'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusBadge status={f.is_active ? 'published' : 'draft'} />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <Button
                        variant="outline"
                        onClick={() => handleTogglePublish(f)}
                        style={{
                          padding: '4px 8px',
                          minHeight: '28px',
                          fontSize: '11px',
                          borderColor: '#334155',
                          color: f.is_active ? '#fcd34d' : '#6ee7b7',
                        }}
                      >
                        {f.is_active ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleOpenEdit(f)}
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
                        onClick={() => setItemToDelete(f)}
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

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? 'Edit Facility Space' : 'Add New Campus Facility'}
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
                id="fac-title"
                label="Facility Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Multisensory Snoezelen Therapy Suite"
                required
              />
              <div>
                <label htmlFor="fac-category" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  id="fac-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as FacilityCategory })}
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
                  <option value="Sensory">Sensory</option>
                  <option value="Therapy">Therapy</option>
                  <option value="Learning">Learning</option>
                  <option value="Recreation">Recreation</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="fac-desc" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                Space Description *
              </label>
              <textarea
                id="fac-desc"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Purpose, adaptive tools, lighting controls, and sensory regulation benefits..."
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

            <div>
              <label htmlFor="fac-features" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
                Accessibility &amp; Sensory Adaptations (One per line)
              </label>
              <textarea
                id="fac-features"
                rows={3}
                value={formData.accessibility_features}
                onChange={(e) => setFormData({ ...formData, accessibility_features: e.target.value })}
                placeholder="Step-free wheelchair ramp access&#10;Dimmable flicker-free LED luminaires&#10;Acoustic sound-dampening wall panels"
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
                id="fac-image-url"
                label="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://... or /assets/..."
              />
              <Input
                id="fac-image-alt"
                label="Descriptive Alt Text (min 15 chars) *"
                value={formData.image_alt}
                onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                placeholder="Wide view of sensory room showing fiber optic lights..."
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <Input
                id="fac-order"
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
                {editingId ? 'Update Facility' : 'Create Facility'}
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
          title="Delete Campus Facility"
          message={`Are you sure you want to delete "${itemToDelete.title}"?`}
        />
      )}
    </article>
  );
};

