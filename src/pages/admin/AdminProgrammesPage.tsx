import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input, StatusBadge, LoadingSpinner, Modal, ConfirmDialog } from '@/components/common';
import { programmesService, CreateProgrammeInput, UpdateProgrammeInput } from '@/services/supabase/programmes.service';
import { Programme } from '@/types/database.types';

export const AdminProgrammesPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Form Modal State (Create or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    stage_description: string;
    description: string;
    curriculum_highlights: string; // newline separated
    educator_ratio: string;
    display_order: number;
    is_active: boolean;
  }>({
    title: '',
    slug: '',
    stage_description: '',
    description: '',
    curriculum_highlights: '',
    educator_ratio: '1:4',
    display_order: 0,
    is_active: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [itemToDelete, setItemToDelete] = useState<Programme | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProgrammes = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await programmesService.getAllProgrammesAdmin();
    if (!error && data) {
      setProgrammes(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProgrammes();
  }, [loadProgrammes]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      stage_description: '',
      description: '',
      curriculum_highlights: '',
      educator_ratio: '1:4',
      display_order: programmes.length + 1,
      is_active: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Programme) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      slug: p.slug,
      stage_description: p.stage_description,
      description: p.description,
      curriculum_highlights: p.curriculum_highlights.join('\n'),
      educator_ratio: p.educator_ratio || '',
      display_order: p.display_order,
      is_active: p.is_active,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('Programme title is required.');
      return;
    }

    const slug = formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const highlights = formData.curriculum_highlights
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    setIsSaving(true);

    if (editingId) {
      // Update
      const updatePayload: UpdateProgrammeInput = {
        title: formData.title.trim(),
        slug,
        stage_description: formData.stage_description.trim(),
        description: formData.description.trim(),
        curriculum_highlights: highlights,
        educator_ratio: formData.educator_ratio.trim() || null,
        display_order: Number(formData.display_order) || 0,
        is_active: formData.is_active,
      };

      const { error } = await programmesService.updateProgramme(editingId, updatePayload);
      setIsSaving(false);

      if (error) {
        setFormError(error.message);
      } else {
        setNotification('Programme updated successfully.');
        setIsModalOpen(false);
        loadProgrammes();
      }
    } else {
      // Create
      const createPayload: CreateProgrammeInput = {
        title: formData.title.trim(),
        slug,
        stage_description: formData.stage_description.trim(),
        description: formData.description.trim(),
        curriculum_highlights: highlights,
        educator_ratio: formData.educator_ratio.trim() || null,
        display_order: Number(formData.display_order) || 0,
        is_active: formData.is_active,
      };

      const { error } = await programmesService.createProgramme(createPayload);
      setIsSaving(false);

      if (error) {
        setFormError(error.message);
      } else {
        setNotification('Programme created successfully.');
        setIsModalOpen(false);
        loadProgrammes();
      }
    }
  };

  const handleTogglePublish = async (p: Programme) => {
    const { error } = await programmesService.updateProgramme(p.id, { is_active: !p.is_active });
    if (!error) {
      setNotification(`Programme "${p.title}" ${!p.is_active ? 'published' : 'unpublished'}.`);
      loadProgrammes();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const { error } = await programmesService.deleteProgramme(itemToDelete.id);
    setIsDeleting(false);

    if (!error) {
      setNotification('Programme removed successfully.');
      setItemToDelete(null);
      loadProgrammes();
    }
  };

  return (
    <article aria-labelledby="programmes-management-heading">
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
            id="programmes-management-heading"
            style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}
          >
            Educational Programmes
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Manage developmental learning stages, ratios, and curriculum highlights. Total: {programmes.length}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" onClick={loadProgrammes} style={{ borderColor: '#334155', color: '#cbd5e1' }}>
            Refresh
          </Button>
          <Button onClick={handleOpenCreate}>
            + Add Programme
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

      {isLoading ? (
        <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner label="Loading programmes..." />
        </div>
      ) : programmes.length === 0 ? (
        <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '40px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#94a3b8' }}>
            No educational programmes added yet.
          </p>
          <Button onClick={handleOpenCreate}>Create First Programme</Button>
        </Card>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a', color: '#94a3b8' }}>
                <th style={{ padding: '12px 16px' }}>Order</th>
                <th style={{ padding: '12px 16px' }}>Programme Title</th>
                <th style={{ padding: '12px 16px' }}>Stage Description</th>
                <th style={{ padding: '12px 16px' }}>Ratio</th>
                <th style={{ padding: '12px 16px' }}>Highlights</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programmes.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #334155', color: '#f8fafc' }}>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>
                    #{p.display_order}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <strong style={{ color: '#f8fafc' }}>{p.title}</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>/{p.slug}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                    {p.stage_description}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#38bdf8' }}>
                    {p.educator_ratio || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>
                    {p.curriculum_highlights.length} item(s)
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusBadge status={p.is_active ? 'published' : 'draft'} />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <Button
                        variant="outline"
                        onClick={() => handleTogglePublish(p)}
                        style={{
                          padding: '4px 8px',
                          minHeight: '28px',
                          fontSize: '11px',
                          borderColor: '#334155',
                          color: p.is_active ? '#fcd34d' : '#6ee7b7',
                        }}
                      >
                        {p.is_active ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleOpenEdit(p)}
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
                        onClick={() => setItemToDelete(p)}
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? 'Edit Educational Programme' : 'Add New Programme'}
          maxWidth="640px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formError && (
              <div
                role="alert"
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#450a0a',
                  border: '1px solid #7f1d1d',
                  borderRadius: '6px',
                  color: '#fca5a5',
                  fontSize: '13px',
                }}
              >
                {formError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <Input
                id="prog-title"
                label="Programme Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Early Developmental Intervention"
                required
              />
              <Input
                id="prog-slug"
                label="URL Slug (auto-generated if empty)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="early-intervention"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <Input
                id="prog-stage"
                label="Stage / Age Group *"
                value={formData.stage_description}
                onChange={(e) => setFormData({ ...formData, stage_description: e.target.value })}
                placeholder="e.g. Ages 3–6 Years &bull; Foundational Readiness"
                required
              />
              <Input
                id="prog-ratio"
                label="Educator-to-Student Ratio"
                value={formData.educator_ratio}
                onChange={(e) => setFormData({ ...formData, educator_ratio: e.target.value })}
                placeholder="1:3 or 1:4"
              />
            </div>

            <div>
              <label htmlFor="prog-desc" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                Full Description *
              </label>
              <textarea
                id="prog-desc"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed explanation of pedagogical approach, sensory adaptations, and routines..."
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
              <label htmlFor="prog-highlights" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
                Curriculum Highlights (One bullet point per line)
              </label>
              <textarea
                id="prog-highlights"
                rows={3}
                value={formData.curriculum_highlights}
                onChange={(e) => setFormData({ ...formData, curriculum_highlights: e.target.value })}
                placeholder="Sensory Integration Therapy&#10;Augmentative Communication Tools&#10;Social Readiness Circles"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <Input
                id="prog-order"
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
                {editingId ? 'Update Programme' : 'Create Programme'}
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
          title="Delete Educational Programme"
          message={`Are you sure you want to delete "${itemToDelete.title}"? This will permanently remove the programme and its curriculum records.`}
        />
      )}
    </article>
  );
};
