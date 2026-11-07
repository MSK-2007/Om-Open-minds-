import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, Button, Input, StatusBadge, LoadingSpinner, Modal, ConfirmDialog } from '@/components/common';
import { enquiriesService } from '@/services/supabase/enquiries.service';
import { ContactEnquiry, ContactEnquiryStatus } from '@/types/database.types';
import { useAuth } from '@/hooks/useAuth';

export const AdminContactPage: React.FC = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ContactEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedMessage, setSelectedMessage] = useState<ContactEnquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [messageToDelete, setMessageToDelete] = useState<ContactEnquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isSuperAdmin = profile?.role === 'super_admin';

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await enquiriesService.getContactEnquiries();
    if (!error && data) {
      setMessages(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const filteredMessages = useMemo(() => {
    return messages
      .filter((item) => {
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const search = searchTerm.toLowerCase();
        const matchesSearch =
          !searchTerm ||
          item.name.toLowerCase().includes(search) ||
          item.email.toLowerCase().includes(search) ||
          item.subject.toLowerCase().includes(search) ||
          item.message.toLowerCase().includes(search) ||
          (item.phone && item.phone.includes(search));
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [messages, statusFilter, searchTerm, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / pageSize));
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMessages.slice(start, start + pageSize);
  }, [filteredMessages, currentPage]);

  const handleOpenDetail = (item: ContactEnquiry) => {
    setSelectedMessage(item);
    setInternalNotes(item.internal_admin_notes || '');
    if (item.status === 'unread') {
      // Mark as read automatically when opened
      enquiriesService.updateContactEnquiryStatus(item.id, 'read');
    }
  };

  const handleUpdateStatus = async (newStatus: ContactEnquiryStatus) => {
    if (!selectedMessage) return;
    setIsUpdatingStatus(true);
    const { error } = await enquiriesService.updateContactEnquiryStatus(
      selectedMessage.id,
      newStatus,
      internalNotes
    );
    setIsUpdatingStatus(false);

    if (!error) {
      setNotification(`Message marked as ${newStatus}.`);
      setSelectedMessage(null);
      loadMessages();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;
    setIsDeleting(true);
    const { error } = await enquiriesService.deleteContactEnquiry(messageToDelete.id);
    setIsDeleting(false);

    if (!error) {
      setNotification('Message deleted permanently.');
      setMessageToDelete(null);
      loadMessages();
    }
  };

  return (
    <article aria-labelledby="contact-management-heading">
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
            id="contact-management-heading"
            style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}
          >
            General Contact Messages
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Inquiries from vendors, educators, community partners, and the public. Total records: {filteredMessages.length}
          </p>
        </div>

        <Button variant="outline" onClick={loadMessages} style={{ borderColor: '#334155', color: '#cbd5e1' }}>
          Refresh Messages
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

      {/* Toolbar */}
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
              id="search-messages"
              label="Search Messages"
              placeholder="Search sender, email, subject, keyword..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ margin: 0 }}
            />
          </div>

          <div>
            <label htmlFor="filter-contact-status" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
              Filter by Status
            </label>
            <select
              id="filter-contact-status"
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
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort-messages" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
              Sort by Date
            </label>
            <select
              id="sort-messages"
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
          <LoadingSpinner label="Loading contact messages..." />
        </div>
      ) : paginatedMessages.length === 0 ? (
        <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '40px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#94a3b8' }}>
            No contact messages found.
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
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Sender</th>
                  <th style={{ padding: '12px 16px' }}>Subject &amp; Message Preview</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMessages.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #334155',
                      color: '#f8fafc',
                      backgroundColor: item.status === 'unread' ? 'rgba(56, 189, 248, 0.05)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ color: '#f8fafc' }}>{item.name}</strong>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.email}</div>
                      {item.phone && <div style={{ fontSize: '11px', color: '#64748b' }}>{item.phone}</div>}
                    </td>
                    <td style={{ padding: '12px 16px', maxWidth: '380px' }}>
                      <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '2px' }}>
                        {item.subject}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.message}
                      </div>
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
                          Read
                        </Button>
                        {isSuperAdmin && (
                          <Button
                            variant="danger"
                            onClick={() => setMessageToDelete(item)}
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

          {/* Pagination */}
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
                Page {currentPage} of {totalPages} ({filteredMessages.length} total messages)
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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMessage(null)}
          title={`Message: ${selectedMessage.subject}`}
          maxWidth="600px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
              <div>
                <strong style={{ fontSize: '15px', color: '#f8fafc' }}>{selectedMessage.name}</strong>
                <div style={{ fontSize: '13px', color: '#38bdf8' }}>
                  <a href={`mailto:${selectedMessage.email}`} style={{ color: '#38bdf8' }}>{selectedMessage.email}</a>
                  {selectedMessage.phone && <span> &bull; <a href={`tel:${selectedMessage.phone}`} style={{ color: '#cbd5e1' }}>{selectedMessage.phone}</a></span>}
                </div>
              </div>
              <StatusBadge status={selectedMessage.status} />
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Message Body:</div>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#0f172a',
                  borderRadius: '6px',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedMessage.message}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-internal-notes"
                style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}
              >
                Staff Internal Follow-up Notes
              </label>
              <textarea
                id="contact-internal-notes"
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Notes on replies sent or administrative action taken..."
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

            <div style={{ borderTop: '1px solid #334155', paddingTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                disabled={isUpdatingStatus}
                onClick={() => handleUpdateStatus('read')}
                style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#334155', color: '#cbd5e1' }}
              >
                Keep as Read
              </Button>
              <Button
                disabled={isUpdatingStatus}
                onClick={() => handleUpdateStatus('replied')}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Mark as Replied
              </Button>
              <Button
                variant="outline"
                disabled={isUpdatingStatus}
                onClick={() => handleUpdateStatus('archived')}
                style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#475569', color: '#94a3b8' }}
              >
                Archive
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {messageToDelete && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setMessageToDelete(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          title="Delete Contact Message"
          message={`Are you sure you want to delete the message from ${messageToDelete.name} regarding "${messageToDelete.subject}"? This action cannot be undone.`}
        />
      )}
    </article>
  );
};
