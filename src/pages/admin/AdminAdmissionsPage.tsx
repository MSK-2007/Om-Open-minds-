import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, Button, Input, StatusBadge, LoadingSpinner, Modal, ConfirmDialog } from '@/components/common';
import { enquiriesService } from '@/services/supabase/enquiries.service';
import { AdmissionEnquiry, AdmissionEnquiryStatus } from '@/types/database.types';
import { useAuth } from '@/hooks/useAuth';

export const AdminAdmissionsPage: React.FC = () => {
  const { profile } = useAuth();
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected enquiry for detail modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdmissionEnquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Delete modal state
  const [enquiryToDelete, setEnquiryToDelete] = useState<AdmissionEnquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isSuperAdmin = profile?.role === 'super_admin';

  const loadEnquiries = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await enquiriesService.getAdmissionEnquiries();
    if (!error && data) {
      setEnquiries(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  // Filter & Search Logic
  const filteredEnquiries = useMemo(() => {
    return enquiries
      .filter((item) => {
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const search = searchTerm.toLowerCase();
        const matchesSearch =
          !searchTerm ||
          item.parent_name.toLowerCase().includes(search) ||
          item.child_name.toLowerCase().includes(search) ||
          item.email.toLowerCase().includes(search) ||
          item.phone.includes(search) ||
          (item.preferred_program && item.preferred_program.toLowerCase().includes(search));
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [enquiries, statusFilter, searchTerm, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredEnquiries.length / pageSize));
  const paginatedEnquiries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEnquiries.slice(start, start + pageSize);
  }, [filteredEnquiries, currentPage]);

  const handleOpenDetail = (item: AdmissionEnquiry) => {
    setSelectedEnquiry(item);
    setInternalNotes(item.internal_admin_notes || '');
  };

  const handleSaveStatusAndNotes = async (newStatus: AdmissionEnquiryStatus) => {
    if (!selectedEnquiry) return;
    setIsUpdatingStatus(true);
    const { error } = await enquiriesService.updateAdmissionEnquiryStatus(
      selectedEnquiry.id,
      newStatus,
      internalNotes
    );
    setIsUpdatingStatus(false);

    if (!error) {
      setNotification(`Enquiry status updated to ${newStatus}.`);
      setSelectedEnquiry(null);
      loadEnquiries();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!enquiryToDelete) return;
    setIsDeleting(true);
    const { error } = await enquiriesService.deleteAdmissionEnquiry(enquiryToDelete.id);
    setIsDeleting(false);

    if (!error) {
      setNotification('Enquiry deleted successfully.');
      setEnquiryToDelete(null);
      loadEnquiries();
    }
  };

  return (
    <article aria-labelledby="admissions-management-heading">
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
            id="admissions-management-heading"
            style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}
          >
            Admissions Intake Management
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Confidential consultation scheduling for prospective families. Total records: {filteredEnquiries.length}
          </p>
        </div>

        <Button variant="outline" onClick={loadEnquiries} style={{ borderColor: '#334155', color: '#cbd5e1' }}>
          Refresh Intake
        </Button>
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

      {/* Search & Filter Toolbar */}
      <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', marginBottom: '24px', padding: '16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'end',
          }}
        >
          <div>
            <Input
              id="search-admissions"
              label="Search Enquiries"
              placeholder="Search by parent, child, email, phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ margin: 0 }}
            />
          </div>

          <div>
            <label htmlFor="filter-status" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
              Filter by Status
            </label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
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
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="contacted">Contacted</option>
              <option value="consultation_scheduled">Consultation Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort-admissions" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
              Sort by Date
            </label>
            <select
              id="sort-admissions"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
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
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main Table */}
      {isLoading ? (
        <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner label="Loading admission enquiries..." />
        </div>
      ) : paginatedEnquiries.length === 0 ? (
        <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '40px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#94a3b8' }}>
            No admission enquiries match the current filters.
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              style={{ borderColor: '#334155', color: '#cbd5e1' }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div style={{ overflowX: 'auto', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a', color: '#94a3b8' }}>
                  <th style={{ padding: '12px 16px' }}>Ref / Date</th>
                  <th style={{ padding: '12px 16px' }}>Parent / Guardian</th>
                  <th style={{ padding: '12px 16px' }}>Child Details</th>
                  <th style={{ padding: '12px 16px' }}>Preferred Programme</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEnquiries.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: '1px solid #334155', color: '#f8fafc' }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#38bdf8' }}>
                        #{item.id.slice(0, 8)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ color: '#f8fafc' }}>{item.parent_name}</strong>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.phone}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 600 }}>{item.child_name}</span>
                      {item.child_age && (
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}> ({item.child_age} yrs)</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                      {item.preferred_program || '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Button
                          variant="outline"
                          onClick={() => handleOpenDetail(item)}
                          style={{
                            padding: '4px 10px',
                            minHeight: '28px',
                            fontSize: '12px',
                            borderColor: '#334155',
                            color: '#38bdf8',
                          }}
                        >
                          View / Review
                        </Button>
                        {isSuperAdmin && (
                          <Button
                            variant="danger"
                            onClick={() => setEnquiryToDelete(item)}
                            style={{
                              padding: '4px 8px',
                              minHeight: '28px',
                              fontSize: '12px',
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                padding: '0 4px',
              }}
            >
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Page {currentPage} of {totalPages} ({filteredEnquiries.length} total entries)
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{ borderColor: '#334155', color: '#cbd5e1', padding: '6px 12px', minHeight: '32px', fontSize: '12px' }}
                >
                  &larr; Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{ borderColor: '#334155', color: '#cbd5e1', padding: '6px 12px', minHeight: '32px', fontSize: '12px' }}
                >
                  Next &rarr;
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail / Review Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedEnquiry(null)}
          title={`Enquiry #${selectedEnquiry.id.slice(0, 8)} — ${selectedEnquiry.parent_name}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Status and Timestamp */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '12px',
                borderBottom: '1px solid #334155',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Current Status: </span>
                <StatusBadge status={selectedEnquiry.status} />
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Submitted: {new Date(selectedEnquiry.created_at).toLocaleString()}
              </div>
            </div>

            {/* Parent & Child Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', margin: '0 0 6px 0' }}>
                  Parent / Guardian
                </h3>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
                  {selectedEnquiry.parent_name}
                </div>
                <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                  Phone: <a href={`tel:${selectedEnquiry.phone}`} style={{ color: '#38bdf8' }}>{selectedEnquiry.phone}</a>
                </div>
                <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                  Email: <a href={`mailto:${selectedEnquiry.email}`} style={{ color: '#38bdf8' }}>{selectedEnquiry.email}</a>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', margin: '0 0 6px 0' }}>
                  Prospective Student
                </h3>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
                  {selectedEnquiry.child_name}
                </div>
                <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                  Age: {selectedEnquiry.child_age ? `${selectedEnquiry.child_age} years` : 'Not specified'}
                </div>
                <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                  Pathway: {selectedEnquiry.preferred_program || 'General Consultation'}
                </div>
              </div>
            </div>

            {/* Parent Notes / Question */}
            <div>
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', margin: '0 0 6px 0' }}>
                Parent Note / Message
              </h3>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#0f172a',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#cbd5e1',
                  lineHeight: 1.6,
                }}
              >
                {selectedEnquiry.notes || '(No additional notes provided by parent)'}
              </div>
            </div>

            {/* Internal Staff Notes */}
            <div>
              <label
                htmlFor="admin-internal-notes"
                style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
              >
                Internal Administrative Notes (Private to staff)
              </label>
              <textarea
                id="admin-internal-notes"
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Log phone calls, family schedule preferences, or consultation dates..."
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

            {/* Workflow Status Actions */}
            <div style={{ borderTop: '1px solid #334155', paddingTop: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                Transition Workflow Status:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button
                  variant="outline"
                  disabled={isUpdatingStatus}
                  onClick={() => handleSaveStatusAndNotes('in_review')}
                  style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#334155', color: '#cbd5e1' }}
                >
                  Mark In Review
                </Button>
                <Button
                  variant="outline"
                  disabled={isUpdatingStatus}
                  onClick={() => handleSaveStatusAndNotes('contacted')}
                  style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#047857', color: '#6ee7b7' }}
                >
                  Mark Contacted
                </Button>
                <Button
                  disabled={isUpdatingStatus}
                  onClick={() => handleSaveStatusAndNotes('consultation_scheduled')}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  Schedule Consultation
                </Button>
                <Button
                  variant="outline"
                  disabled={isUpdatingStatus}
                  onClick={() => handleSaveStatusAndNotes('archived')}
                  style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#475569', color: '#94a3b8' }}
                >
                  Archive
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {enquiryToDelete && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setEnquiryToDelete(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          title="Delete Admission Enquiry"
          message={`Are you sure you want to delete the enquiry from ${enquiryToDelete.parent_name}? This operation is irreversible and will permanently remove this record from the database.`}
        />
      )}
    </article>
  );
};
