import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input, StatusBadge, LoadingSpinner, Modal, ConfirmDialog } from '@/components/common';
import { teamService, CreateTeamMemberInput, UpdateTeamMemberInput } from '@/services/supabase/team.service';
import { TeamMember, TeamDepartment } from '@/types/database.types';

export const AdminTeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    full_name: string;
    role_title: string;
    department: TeamDepartment;
    qualifications: string;
    bio: string;
    photo_url: string;
    photo_alt: string;
    display_order: number;
    is_active: boolean;
  }>({
    full_name: '',
    role_title: '',
    department: 'Special Education',
    qualifications: '',
    bio: '',
    photo_url: '',
    photo_alt: '',
    display_order: 0,
    is_active: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [itemToDelete, setItemToDelete] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTeam = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await teamService.getAllTeamMembersAdmin();
    if (!error && data) {
      setTeamMembers(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  const filteredTeam = teamMembers.filter(
    (m) => departmentFilter === 'all' || m.department === departmentFilter
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      full_name: '',
      role_title: '',
      department: 'Special Education',
      qualifications: '',
      bio: '',
      photo_url: '',
      photo_alt: '',
      display_order: teamMembers.length + 1,
      is_active: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setFormData({
      full_name: m.full_name,
      role_title: m.role_title,
      department: m.department,
      qualifications: m.qualifications,
      bio: m.bio,
      photo_url: m.photo_url || '',
      photo_alt: m.photo_alt || '',
      display_order: m.display_order,
      is_active: m.is_active,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.full_name.trim()) {
      setFormError('Staff full name is required.');
      return;
    }
    if (!formData.role_title.trim()) {
      setFormError('Role / designation title is required.');
      return;
    }

    setIsSaving(true);

    if (editingId) {
      const updatePayload: UpdateTeamMemberInput = {
        full_name: formData.full_name.trim(),
        role_title: formData.role_title.trim(),
        department: formData.department,
        qualifications: formData.qualifications.trim(),
        bio: formData.bio.trim(),
        photo_url: formData.photo_url.trim() || null,
        photo_alt: formData.photo_alt.trim() || null,
        display_order: Number(formData.display_order) || 0,
        is_active: formData.is_active,
      };

      const { error } = await teamService.updateTeamMember(editingId, updatePayload);
      setIsSaving(false);

      if (error) {
        setFormError(error.message);
      } else {
        setNotification('Team member profile updated.');
        setIsModalOpen(false);
        loadTeam();
      }
    } else {
      const createPayload: CreateTeamMemberInput = {
        full_name: formData.full_name.trim(),
        role_title: formData.role_title.trim(),
        department: formData.department,
        qualifications: formData.qualifications.trim(),
        bio: formData.bio.trim(),
        photo_url: formData.photo_url.trim() || null,
        photo_alt: formData.photo_alt.trim() || null,
        display_order: Number(formData.display_order) || 0,
        is_active: formData.is_active,
      };

      const { error } = await teamService.createTeamMember(createPayload);
      setIsSaving(false);

      if (error) {
        setFormError(error.message);
      } else {
        setNotification('Team member profile created.');
        setIsModalOpen(false);
        loadTeam();
      }
    }
  };

  const handleTogglePublish = async (m: TeamMember) => {
    const { error } = await teamService.updateTeamMember(m.id, { is_active: !m.is_active });
    if (!error) {
      setNotification(`Profile for "${m.full_name}" ${!m.is_active ? 'published' : 'unpublished'}.`);
      loadTeam();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const { error } = await teamService.deleteTeamMember(itemToDelete.id);
    setIsDeleting(false);

    if (!error) {
      setNotification('Staff profile deleted.');
      setItemToDelete(null);
      loadTeam();
    }
  };

  return (
    <article aria-labelledby="team-management-heading">
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
            id="team-management-heading"
            style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}
          >
            Faculty &amp; Allied Specialists
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Leadership, special educators, and developmental therapists. Total: {teamMembers.length}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" onClick={loadTeam} style={{ borderColor: '#334155', color: '#cbd5e1' }}>
            Refresh
          </Button>
          <Button onClick={handleOpenCreate}>
            + Add Staff Member
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
          <label htmlFor="filter-team-dept" style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>
            Filter by Department:
          </label>
          <select
            id="filter-team-dept"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          >
            <option value="all">All Departments</option>
            <option value="Leadership">Leadership &amp; Directorate</option>
            <option value="Special Education">Special Educators</option>
            <option value="Therapy">Allied Therapists (OT, PT, Speech)</option>
            <option value="Support">Support &amp; Shadow Aides</option>
          </select>
        </div>
      </Card>

      {isLoading ? (
        <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner label="Loading staff roster..." />
        </div>
      ) : filteredTeam.length === 0 ? (
        <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '40px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#94a3b8' }}>
            No staff records registered under this category.
          </p>
          <Button onClick={handleOpenCreate}>Add Staff Member</Button>
        </Card>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a', color: '#94a3b8' }}>
                <th style={{ padding: '12px 16px' }}>Order</th>
                <th style={{ padding: '12px 16px' }}>Staff Name</th>
                <th style={{ padding: '12px 16px' }}>Role / Designation</th>
                <th style={{ padding: '12px 16px' }}>Department</th>
                <th style={{ padding: '12px 16px' }}>Qualifications</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeam.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #334155', color: '#f8fafc' }}>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>
                    #{m.display_order}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <strong style={{ color: '#f8fafc' }}>{m.full_name}</strong>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                    {m.role_title}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #334155', fontSize: '12px', color: '#38bdf8' }}>
                      {m.department}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>
                    {m.qualifications}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusBadge status={m.is_active ? 'published' : 'draft'} />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <Button
                        variant="outline"
                        onClick={() => handleTogglePublish(m)}
                        style={{
                          padding: '4px 8px',
                          minHeight: '28px',
                          fontSize: '11px',
                          borderColor: '#334155',
                          color: m.is_active ? '#fcd34d' : '#6ee7b7',
                        }}
                      >
                        {m.is_active ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleOpenEdit(m)}
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
                        onClick={() => setItemToDelete(m)}
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
          title={editingId ? 'Edit Faculty Profile' : 'Add Staff Member'}
          maxWidth="640px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formError && (
              <div role="alert" style={{ padding: '10px 14px', backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px', color: '#fca5a5', fontSize: '13px' }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                id="team-name"
                label="Full Name *"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Dr. / Mr. / Ms. Full Name"
                required
              />
              <Input
                id="team-role"
                label="Role / Designation *"
                value={formData.role_title}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                placeholder="Lead Occupational Therapist"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label htmlFor="team-dept" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                  Department *
                </label>
                <select
                  id="team-dept"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value as TeamDepartment })}
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
                  <option value="Leadership">Leadership</option>
                  <option value="Special Education">Special Education</option>
                  <option value="Therapy">Therapy</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <Input
                id="team-qualifications"
                label="Qualifications *"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                placeholder="M.Sc Occupational Therapy, Sensory Certified"
                required
              />
            </div>

            <div>
              <label htmlFor="team-bio" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                Professional Biography *
              </label>
              <textarea
                id="team-bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Professional philosophy, clinical background, and passion for neurodiverse developmental education..."
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
                id="team-photo-url"
                label="Profile Photo URL"
                value={formData.photo_url}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                placeholder="https://... or /assets/..."
              />
              <Input
                id="team-photo-alt"
                label="Photo Alternative Text"
                value={formData.photo_alt}
                onChange={(e) => setFormData({ ...formData, photo_alt: e.target.value })}
                placeholder="Portrait of Staff Member smiling in sensory therapy room"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <Input
                id="team-order"
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
                {editingId ? 'Update Staff Profile' : 'Save Staff Member'}
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
          title="Delete Staff Profile"
          message={`Are you sure you want to delete the profile for "${itemToDelete.full_name}"?`}
        />
      )}
    </article>
  );
};

