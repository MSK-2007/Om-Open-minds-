import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input, StatusBadge, LoadingSpinner, Modal, ConfirmDialog } from '@/components/common';
import { galleryService, CreateGalleryCategoryInput } from '@/services/supabase/gallery.service';
import { storageService } from '@/services/supabase/storage.service';
import { GalleryItem, GalleryCategory } from '@/types/database.types';

export const AdminGalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // Upload / Item Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemFormData, setItemFormData] = useState<{
    title: string;
    category_id: string;
    image_url: string;
    alt_text: string;
    has_parental_consent: boolean;
    is_published: boolean;
    display_order: number;
  }>({
    title: '',
    category_id: '',
    image_url: '',
    alt_text: '',
    has_parental_consent: false,
    is_published: false,
    display_order: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [itemFormError, setItemFormError] = useState<string | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Delete State
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [itemsRes, catRes] = await Promise.all([
      galleryService.getAllGalleryItemsAdmin(),
      galleryService.getGalleryCategories(),
    ]);

    if (!itemsRes.error && itemsRes.data) setItems(itemsRes.data);
    if (!catRes.error && catRes.data) setCategories(catRes.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredItems = items.filter(
    (item) => categoryFilter === 'all' || item.category_id === categoryFilter
  );

  const handleOpenUpload = () => {
    setEditingItemId(null);
    setSelectedFile(null);
    setItemFormData({
      title: '',
      category_id: categories[0]?.id || '',
      image_url: '',
      alt_text: '',
      has_parental_consent: false,
      is_published: false,
      display_order: items.length + 1,
    });
    setItemFormError(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: GalleryItem) => {
    setEditingItemId(item.id);
    setSelectedFile(null);
    setItemFormData({
      title: item.title,
      category_id: item.category_id || '',
      image_url: item.image_url,
      alt_text: item.alt_text,
      has_parental_consent: item.has_parental_consent,
      is_published: item.is_published,
      display_order: item.display_order,
    });
    setItemFormError(null);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setItemFormError(null);

    if (!itemFormData.title.trim()) {
      setItemFormError('Image title / caption is required.');
      return;
    }

    if (!itemFormData.alt_text.trim() || itemFormData.alt_text.trim().length < 15) {
      setItemFormError('Descriptive alternative text (at least 15 characters) is required for WCAG accessibility compliance.');
      return;
    }

    if (!itemFormData.has_parental_consent) {
      setItemFormError('Child Safeguarding: Documented parental consent must be verified on file before registering any student imagery.');
      return;
    }

    setIsUploading(true);

    try {
      let finalImageUrl = itemFormData.image_url;

      // Handle file upload if a file was selected
      if (selectedFile) {
        const uploadRes = await storageService.uploadGalleryPhoto(selectedFile, true);
        if (uploadRes.error) {
          throw uploadRes.error;
        }
        finalImageUrl = uploadRes.url || '';
      }

      if (!finalImageUrl) {
        throw new Error('Please select an image file to upload or provide an image URL.');
      }

      if (editingItemId) {
        // Update
        const { error } = await galleryService.updateGalleryItem(editingItemId, {
          title: itemFormData.title.trim(),
          category_id: itemFormData.category_id || null,
          image_url: finalImageUrl,
          alt_text: itemFormData.alt_text.trim(),
          has_parental_consent: itemFormData.has_parental_consent,
          is_published: itemFormData.is_published,
          display_order: Number(itemFormData.display_order) || 0,
        });

        if (error) throw error;
        setNotification('Gallery item updated successfully.');
      } else {
        // Create
        const { error: createError } = await galleryService.uploadAndCreateGalleryItem(
          selectedFile || new File([], 'placeholder'),
          {
            title: itemFormData.title.trim(),
            category_id: itemFormData.category_id || null,
            alt_text: itemFormData.alt_text.trim(),
            has_parental_consent: true,
            is_published: itemFormData.is_published,
            display_order: Number(itemFormData.display_order) || 0,
          }
        );
        if (createError) throw createError;
        setNotification('Gallery photo registered with verified parental consent.');
      }

      setIsItemModalOpen(false);
      loadData();
    } catch (err) {
      setItemFormError(err instanceof Error ? err.message : 'Failed to save gallery item.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSavingCategory(true);
    const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const createPayload: CreateGalleryCategoryInput = {
      name: newCategoryName.trim(),
      slug,
      description: newCategoryDesc.trim() || null,
      display_order: categories.length + 1,
      is_active: true,
    };

    const { error } = await galleryService.createGalleryCategory(createPayload);
    setIsSavingCategory(false);

    if (!error) {
      setNotification(`Category "${newCategoryName}" created.`);
      setNewCategoryName('');
      setNewCategoryDesc('');
      setIsCategoryModalOpen(false);
      loadData();
    }
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    const { error } = await galleryService.updateGalleryItem(item.id, { is_published: !item.is_published });
    if (!error) {
      setNotification(`Photo "${item.title}" ${!item.is_published ? 'published' : 'unpublished'}.`);
      loadData();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const { error } = await galleryService.deleteGalleryItem(itemToDelete.id, itemToDelete.image_url);
    setIsDeleting(false);

    if (!error) {
      setNotification('Gallery item removed.');
      setItemToDelete(null);
      loadData();
    }
  };

  return (
    <article aria-labelledby="gallery-management-heading">
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
            id="gallery-management-heading"
            style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}
          >
            Accessible Media &amp; Gallery
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Curate campus photos with mandatory parental consent verification and descriptive alternative text. Total: {items.length}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="outline"
            onClick={() => setIsCategoryModalOpen(true)}
            style={{ borderColor: '#334155', color: '#cbd5e1' }}
          >
            Manage Albums / Categories
          </Button>
          <Button onClick={handleOpenUpload}>
            + Upload Photo
          </Button>
        </div>
      </header>

      {/* Child Safeguarding Mandate Notice */}
      <div
        role="note"
        style={{
          padding: '12px 16px',
          backgroundColor: '#0f172a',
          borderLeft: '4px solid #38bdf8',
          border: '1px solid #334155',
          borderRadius: '6px',
          color: '#cbd5e1',
          fontSize: '13px',
          marginBottom: '24px',
          lineHeight: 1.5,
        }}
      >
        <strong>Child Safeguarding &amp; Accessibility Mandate:</strong> In accordance with OM OPEN MINDS child protection protocols, photographs containing identifiable students may <em>only</em> be published when verified parental consent is on file. Every photograph must include descriptive alternative text ($\ge 15$ characters).
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

      {/* Album Filter */}
      <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', marginBottom: '24px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <label htmlFor="filter-gallery-album" style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>
            Filter by Album / Category:
          </label>
          <select
            id="filter-gallery-album"
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
            <option value="all">All Albums ({items.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Items Grid */}
      {isLoading ? (
        <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner label="Loading gallery media..." />
        </div>
      ) : filteredItems.length === 0 ? (
        <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '40px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#94a3b8' }}>
            No gallery photographs registered in this category.
          </p>
          <Button onClick={handleOpenUpload}>Upload First Photograph</Button>
        </Card>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              style={{
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    height: '160px',
                    backgroundColor: '#0f172a',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    border: '1px solid #334155',
                  }}
                >
                  <img
                    src={item.image_url}
                    alt={item.alt_text}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect fill="%231e293b" width="200" height="150"/><text fill="%2364748b" x="50%" y="50%" text-anchor="middle" font-family="sans-serif" font-size="12">Preview Unavailable</text></svg>';
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{item.title}</strong>
                  <StatusBadge status={item.is_published ? 'published' : 'draft'} />
                </div>

                <div style={{ fontSize: '12px', color: '#6ee7b7', marginBottom: '8px' }}>
                  &check; Parental Consent Documented
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    backgroundColor: '#0f172a',
                    padding: '8px',
                    borderRadius: '4px',
                    lineHeight: 1.4,
                    marginBottom: '12px',
                  }}
                >
                  <strong>Alt:</strong> {item.alt_text}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '12px' }}>
                <Button
                  variant="outline"
                  onClick={() => handleTogglePublish(item)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    borderColor: '#334155',
                    color: item.is_published ? '#fcd34d' : '#6ee7b7',
                  }}
                >
                  {item.is_published ? 'Unpublish' : 'Publish'}
                </Button>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <Button
                    variant="outline"
                    onClick={() => handleOpenEditItem(item)}
                    style={{ padding: '4px 8px', fontSize: '11px', borderColor: '#334155', color: '#38bdf8' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setItemToDelete(item)}
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload / Edit Modal */}
      {isItemModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsItemModalOpen(false)}
          title={editingItemId ? 'Edit Photograph Metadata' : 'Upload Approved Photograph'}
          maxWidth="600px"
        >
          <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {itemFormError && (
              <div role="alert" style={{ padding: '10px 14px', backgroundColor: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px', color: '#fca5a5', fontSize: '13px' }}>
                {itemFormError}
              </div>
            )}

            <Input
              id="photo-title"
              label="Photograph Title / Caption *"
              value={itemFormData.title}
              onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
              placeholder="e.g. Adaptive Pottery Workshop"
              required
            />

            <div>
              <label htmlFor="photo-album" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                Album Category
              </label>
              <select
                id="photo-album"
                value={itemFormData.category_id}
                onChange={(e) => setItemFormData({ ...itemFormData, category_id: e.target.value })}
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
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload Selector */}
            <div>
              <label htmlFor="photo-file" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
                Select Image File (JPG, PNG, WebP &bull; Max 2MB)
              </label>
              <input
                id="photo-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#0f172a',
                  color: '#cbd5e1',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  fontSize: '13px',
                }}
              />
              {selectedFile && (
                <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '4px' }}>
                  Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </div>
              )}
            </div>

            {/* Alt Text Requirement */}
            <div>
              <label htmlFor="photo-alt" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
                Alternative Text (Mandatory &bull; min 15 characters) *
              </label>
              <textarea
                id="photo-alt"
                rows={2}
                value={itemFormData.alt_text}
                onChange={(e) => setItemFormData({ ...itemFormData, alt_text: e.target.value })}
                placeholder="Descriptive explanation for screen-reader users, e.g.: Two smiling students shaping clay on a low adaptive table in the art studio"
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

            {/* Parental Consent Checkbox (MANDATORY) */}
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#0f172a',
                border: '1px solid #047857',
                borderRadius: '6px',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#d1fae5', lineHeight: 1.5 }}>
                <input
                  type="checkbox"
                  checked={itemFormData.has_parental_consent}
                  onChange={(e) => setItemFormData({ ...itemFormData, has_parental_consent: e.target.checked })}
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#047857' }}
                  required
                />
                <span>
                  <strong>Parental Consent Confirmed:</strong> I verify that documented parental media consent is signed and on file for every student visible in this photograph.
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                id="photo-publish"
                type="checkbox"
                checked={itemFormData.is_published}
                onChange={(e) => setItemFormData({ ...itemFormData, is_published: e.target.checked })}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="photo-publish" style={{ fontSize: '13px', color: '#f8fafc', cursor: 'pointer' }}>
                Publish immediately to public gallery
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsItemModalOpen(false)}
                disabled={isUploading}
                style={{ borderColor: '#475569', color: '#cbd5e1' }}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isUploading}>
                {editingItemId ? 'Update Photo' : 'Upload & Save'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsCategoryModalOpen(false)}
          title="Manage Gallery Albums"
          maxWidth="500px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                Create New Album
              </h3>
              <Input
                id="album-name"
                label="Album Name *"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Sensory Gardens &amp; Outdoors"
                required
              />
              <Input
                id="album-desc"
                label="Description"
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                placeholder="Optional album overview"
              />
              <Button type="submit" isLoading={isSavingCategory} style={{ alignSelf: 'flex-end' }}>
                Create Album
              </Button>
            </form>

            <div style={{ borderTop: '1px solid #334155', paddingTop: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', margin: '0 0 10px 0' }}>
                Existing Albums ({categories.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categories.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#0f172a',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px',
                      color: '#f8fafc',
                    }}
                  >
                    <span>{c.name}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>/{c.slug}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {itemToDelete && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          title="Delete Gallery Media"
          message={`Are you sure you want to remove "${itemToDelete.title}"? The image will be deleted from the database and storage.`}
        />
      )}
    </article>
  );
};
