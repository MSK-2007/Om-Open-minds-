import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input, StatusBadge, LoadingSpinner, Modal, ConfirmDialog } from '@/components/common';
import { resourcesService, CreateParentResourceInput, UpdateParentResourceInput, CreateAdmissionsFaqInput, UpdateAdmissionsFaqInput } from '@/services/supabase/resources.service';
import { ParentResource, AdmissionsFaq, ResourceCategory } from '@/types/database.types';

export const AdminResourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'faqs'>('resources');
  const [resources, setResources] = useState<ParentResource[]>([]);
  const [faqs, setFaqs] = useState<AdmissionsFaq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Resource Form Modal
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [editingResId, setEditingResId] = useState<string | null>(null);
  const [resFormData, setResFormData] = useState<{
    title: string;
    category: ResourceCategory;
    description: string;
    file_url: string;
    external_url: string;
    file_format: string;
    display_order: number;
    is_active: boolean;
  }>({
    title: '',
    category: 'Parent Guide',
    description: '',
    file_url: '',
    external_url: '',
    file_format: 'PDF',
    display_order: 0,
    is_active: true,
  });
  const [resFormError, setResFormError] = useState<string | null>(null);
  const [isSavingRes, setIsSavingRes] = useState(false);

  // FAQ Form Modal
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqFormData, setFaqFormData] = useState<{
    question: string;
    answer: string;
    display_order: number;
    is_active: boolean;
  }>({
    question: '',
    answer: '',
    display_order: 0,
    is_active: true,
  });
  const [faqFormError, setFaqFormError] = useState<string | null>(null);
  const [isSavingFaq, setIsSavingFaq] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'resource' | 'faq'; id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [resData, faqData] = await Promise.all([
      resourcesService.getAllResourcesAdmin(),
      resourcesService.getAdmissionsFaqs(),
    ]);

    if (!resData.error && resData.data) setResources(resData.data);
    if (!faqData.error && faqData.data) setFaqs(faqData.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Resource Handlers
  const handleOpenCreateRes = () => {
    setEditingResId(null);
    setResFormData({
      title: '',
      category: 'Parent Guide',
      description: '',
      file_url: '',
      external_url: '',
      file_format: 'PDF',
      display_order: resources.length + 1,
      is_active: true,
    });
    setResFormError(null);
    setIsResModalOpen(true);
  };

  const handleOpenEditRes = (r: ParentResource) => {
    setEditingResId(r.id);
    setResFormData({
      title: r.title,
      category: r.category,
      description: r.description,
      file_url: r.file_url || '',
      external_url: r.external_url || '',
      file_format: r.file_format || 'PDF',
      display_order: r.display_order,
      is_active: r.is_active,
    });
    setResFormError(null);
    setIsResModalOpen(true);
  };

  const handleSaveRes = async (e: React.FormEvent) => {
    e.preventDefault();
    setResFormError(null);

    if (!resFormData.title.trim()) {
      setResFormError('Title is required.');
      return;
    }

    setIsSavingRes(true);

    if (editingResId) {
      const updatePayload: UpdateParentResourceInput = {
        title: resFormData.title.trim(),
        category: resFormData.category,
        description: resFormData.description.trim(),
        file_url: resFormData.file_url.trim() || null,
        external_url: resFormData.external_url.trim() || null,
        file_format: resFormData.file_format,
        display_order: Number(resFormData.display_order) || 0,
        is_active: resFormData.is_active,
      };

      const { error } = await resourcesService.updateResource(editingResId, updatePayload);
      setIsSavingRes(false);

      if (error) {
        setResFormError(error.message);
      } else {
        setNotification('Resource updated.');
        setIsResModalOpen(false);
        loadData();
      }
    } else {
      const createPayload: CreateParentResourceInput = {
        title: resFormData.title.trim(),
        category: resFormData.category,
        description: resFormData.description.trim(),
        file_url: resFormData.file_url.trim() || null,
        external_url: resFormData.external_url.trim() || null,
        file_format: resFormData.file_format,
        display_order: Number(resFormData.display_order) || 0,
        is_active: resFormData.is_active,
      };

      const { error } = await resourcesService.createResource(createPayload);
      setIsSavingRes(false);

      if (error) {
        setResFormError(error.message);
      } else {
        setNotification('Resource published.');
        setIsResModalOpen(false);
        loadData();
      }
    }
  };

  // FAQ Handlers
  const handleOpenCreateFaq = () => {
    setEditingFaqId(null);
    setFaqFormData({
      question: '',
      answer: '',
      display_order: faqs.length + 1,
      is_active: true,
    });
    setFaqFormError(null);
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (f: AdmissionsFaq) => {
    setEditingFaqId(f.id);
    setFaqFormData({
      question: f.question,
      answer: f.answer,
      display_order: f.display_order,
      is_active: f.is_active,
    });
    setFaqFormError(null);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setFaqFormError(null);

    if (!faqFormData.question.trim() || !faqFormData.answer.trim()) {
      setFaqFormError('Both Question and Answer are required.');
      return;
    }

    setIsSavingFaq(true);

    if (editingFaqId) {
      const updatePayload: UpdateAdmissionsFaqInput = {
        question: faqFormData.question.trim(),
        answer: faqFormData.answer.trim(),
        display_order: Number(faqFormData.display_order) || 0,
        is_active: faqFormData.is_active,
      };

      const { error } = await resourcesService.updateFaq(editingFaqId, updatePayload);
      setIsSavingFaq(false);

      if (error) {
        setFaqFormError(error.message);
      } else {
        setNotification('FAQ updated.');
        setIsFaqModalOpen(false);
        loadData();
      }
    } else {
      const createPayload: CreateAdmissionsFaqInput = {
        question: faqFormData.question.trim(),
        answer: faqFormData.answer.trim(),
        display_order: Number(faqFormData.display_order) || 0,
        is_active: faqFormData.is_active,
      };

      const { error } = await resourcesService.createFaq(createPayload);
      setIsSavingFaq(false);

      if (error) {
        setFaqFormError(error.message);
      } else {
        setNotification('FAQ created.');
        setIsFaqModalOpen(false);
        loadData();
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    if (deleteTarget.type === 'resource') {
      await resourcesService.deleteResource(deleteTarget.id);
      setNotification('Parent resource removed.');
    } else {
      await resourcesService.deleteFaq(deleteTarget.id);
      setNotification('FAQ removed.');
    }

    setIsDeleting(false);
    setDeleteTarget(null);
    loadData();
  };

  return (
    <article aria-labelledby="resources-management-heading">
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
            id="resources-management-heading"
            style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}
          >
            Parent Resources &amp; Admissions FAQs
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Academic calendars, sensory home tip sheets, handbooks, and admissions guidance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {activeTab === 'resources' ? (
            <Button onClick={handleOpenCreateRes}>+ Add Resource Document</Button>
          ) : (
            <Button onClick={handleOpenCreateFaq}>+ Add Admissions FAQ</Button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('resources')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'resources' ? '#1e293b' : 'transparent',
            color: activeTab === 'resources' ? '#38bdf8' : '#94a3b8',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Downloadable Resources ({resources.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'faqs' ? '#1e293b' : 'transparent',
            color: activeTab === 'faqs' ? '#38bdf8' : '#94a3b8',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Admissions FAQs ({faqs.length})
        </button>
      </div>

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
          <LoadingSpinner label="Loading items..." />
        </div>
      ) : activeTab === 'resources' ? (
        /* Resources Table */
        resources.length === 0 ? (
          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '40px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#94a3b8' }}>No parent resources published yet.</p>
            <Button onClick={handleOpenCreateRes}>Add First Resource</Button>
          </Card>
        ) : (
          <div style={{ overflowX: 'auto', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a', color: '#94a3b8' }}>
                  <th style={{ padding: '12px 16px' }}>Order</th>
                  <th style={{ padding: '12px 16px' }}>Document Title</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Format</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #334155', color: '#f8fafc' }}>
                    <td style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>#{r.display_order}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ color: '#f8fafc' }}>{r.title}</strong>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{r.description}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #334155', fontSize: '12px', color: '#38bdf8' }}>
                        {r.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>{r.file_format || 'PDF'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <StatusBadge status={r.is_active ? 'published' : 'draft'} />
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Button
                          variant="outline"
                          onClick={() => handleOpenEditRes(r)}
                          style={{ padding: '4px 10px', fontSize: '12px', borderColor: '#334155', color: '#38bdf8' }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => setDeleteTarget({ type: 'resource', id: r.id, name: r.title })}
                          style={{ padding: '4px 8px', fontSize: '12px' }}
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
        )
      ) : (
        /* FAQs Table */
        faqs.length === 0 ? (
          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '40px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#94a3b8' }}>No admissions FAQs published yet.</p>
            <Button onClick={handleOpenCreateFaq}>Add First FAQ</Button>
          </Card>
        ) : (
          <div style={{ overflowX: 'auto', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a', color: '#94a3b8' }}>
                  <th style={{ padding: '12px 16px' }}>Order</th>
                  <th style={{ padding: '12px 16px' }}>Question</th>
                  <th style={{ padding: '12px 16px' }}>Answer Preview</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((f) => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #334155', color: '#f8fafc' }}>
                    <td style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>#{f.display_order}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#f8fafc', maxWidth: '300px' }}>
                      {f.question}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#94a3b8', maxWidth: '360px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.answer}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <StatusBadge status={f.is_active ? 'published' : 'draft'} />
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Button
                          variant="outline"
                          onClick={() => handleOpenEditFaq(f)}
                          style={{ padding: '4px 10px', fontSize: '12px', borderColor: '#334155', color: '#38bdf8' }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => setDeleteTarget({ type: 'faq', id: f.id, name: f.question })}
                          style={{ padding: '4px 8px', fontSize: '12px' }}
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
        )
      )}

      {/* Resource Modal */}
      {isResModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsResModalOpen(false)}
          title={editingResId ? 'Edit Parent Resource' : 'Add Parent Resource'}
          maxWidth="600px"
        >
          <form onSubmit={handleSaveRes} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {resFormError && (
              <div role="alert" style={{ padding: '10px 14px', backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px', color: '#fca5a5', fontSize: '13px' }}>
                {resFormError}
              </div>
            )}

            <Input
              id="res-title"
              label="Resource Title *"
              value={resFormData.title}
              onChange={(e) => setResFormData({ ...resFormData, title: e.target.value })}
              placeholder="e.g. 2026 Academic Calendar &amp; Routine Guide"
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label htmlFor="res-cat" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  id="res-cat"
                  value={resFormData.category}
                  onChange={(e) => setResFormData({ ...resFormData, category: e.target.value as ResourceCategory })}
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
                  <option value="Parent Guide">Parent Guide</option>
                  <option value="Calendar">Calendar</option>
                  <option value="Sensory Tip Sheet">Sensory Tip Sheet</option>
                  <option value="Policy">Policy</option>
                </select>
              </div>

              <Input
                id="res-format"
                label="Format"
                value={resFormData.file_format}
                onChange={(e) => setResFormData({ ...resFormData, file_format: e.target.value })}
                placeholder="PDF / XLSX / Web Link"
              />
            </div>

            <div>
              <label htmlFor="res-desc" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                Summary Description *
              </label>
              <textarea
                id="res-desc"
                rows={3}
                value={resFormData.description}
                onChange={(e) => setResFormData({ ...resFormData, description: e.target.value })}
                placeholder="Explains what parents will find in this guide..."
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

            <Input
              id="res-url"
              label="Document Download URL or External Link"
              value={resFormData.file_url}
              onChange={(e) => setResFormData({ ...resFormData, file_url: e.target.value })}
              placeholder="https://... or /assets/docs/..."
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <Input
                id="res-order"
                type="number"
                label="Display Order"
                value={String(resFormData.display_order)}
                onChange={(e) => setResFormData({ ...resFormData, display_order: parseInt(e.target.value, 10) || 0 })}
              />

              <div style={{ marginTop: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#f8fafc' }}>
                  <input
                    type="checkbox"
                    checked={resFormData.is_active}
                    onChange={(e) => setResFormData({ ...resFormData, is_active: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Published for parent download</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <Button type="button" variant="outline" onClick={() => setIsResModalOpen(false)} disabled={isSavingRes} style={{ borderColor: '#475569', color: '#cbd5e1' }}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSavingRes}>
                {editingResId ? 'Update Resource' : 'Save Resource'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* FAQ Modal */}
      {isFaqModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsFaqModalOpen(false)}
          title={editingFaqId ? 'Edit Admissions FAQ' : 'Add Admissions FAQ'}
          maxWidth="600px"
        >
          <form onSubmit={handleSaveFaq} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqFormError && (
              <div role="alert" style={{ padding: '10px 14px', backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px', color: '#fca5a5', fontSize: '13px' }}>
                {faqFormError}
              </div>
            )}

            <Input
              id="faq-question"
              label="Question *"
              value={faqFormData.question}
              onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
              placeholder="e.g. Do you require clinical diagnostic reports before the first visit?"
              required
            />

            <div>
              <label htmlFor="faq-answer" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                Answer *
              </label>
              <textarea
                id="faq-answer"
                rows={4}
                value={faqFormData.answer}
                onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                placeholder="Compassionate, clear explanation for families..."
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
              <Input
                id="faq-order"
                type="number"
                label="Display Order"
                value={String(faqFormData.display_order)}
                onChange={(e) => setFaqFormData({ ...faqFormData, display_order: parseInt(e.target.value, 10) || 0 })}
              />

              <div style={{ marginTop: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#f8fafc' }}>
                  <input
                    type="checkbox"
                    checked={faqFormData.is_active}
                    onChange={(e) => setFaqFormData({ ...faqFormData, is_active: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Visible on Admissions page</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <Button type="button" variant="outline" onClick={() => setIsFaqModalOpen(false)} disabled={isSavingFaq} style={{ borderColor: '#475569', color: '#cbd5e1' }}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSavingFaq}>
                {editingFaqId ? 'Update FAQ' : 'Save FAQ'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          title={deleteTarget.type === 'resource' ? 'Delete Resource' : 'Delete FAQ'}
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
        />
      )}
    </article>
  );
};

