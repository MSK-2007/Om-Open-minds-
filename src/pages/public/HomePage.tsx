import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MengToSketchbookLandingPage } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

import {
  programmesService,
  facilitiesService,
  teamService,
  eventsService,
  contentService,
  enquiriesService,
  type CreateAdmissionEnquiryInput,
  type CreateContactEnquiryInput,
} from '@/services/supabase';

import type {
  Programme,
  Facility,
  TeamMember,
  Activity,
} from '@/types';

/**
 * OM OPEN MINDS — ThreeUI Interactive Sketchbook Landing Page.
 *
 * Integrates the MengToSketchbookLandingPage component from @designcodeio/threeui,
 * connected directly to Supabase services for dynamic content synchronization,
 * verified educational pathways, and live confidential admissions enquiry processing.
 */
export const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  // Cached state for dynamic data streams
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  // 1. Fetch live Supabase content on mount
  useEffect(() => {
    let isMounted = true;

    async function loadSchoolData() {
      try {
        const [progRes, facRes, teamRes, actRes, setRes] = await Promise.all([
          programmesService.getPublishedProgrammes().catch(() => ({ data: [] })),
          facilitiesService.getPublishedFacilities().catch(() => ({ data: [] })),
          teamService.getPublishedTeamMembers().catch(() => ({ data: [] })),
          eventsService.getPublishedActivities().catch(() => ({ data: [] })),
          contentService.getSiteSettings().catch(() => ({ data: {} })),
        ]);

        if (!isMounted) return;

        if (progRes.data) setProgrammes(progRes.data);
        if (facRes.data) setFacilities(facRes.data);
        if (teamRes.data) setTeam(teamRes.data);
        if (actRes.data) setActivities(actRes.data);
        if (setRes.data) setSettings(setRes.data);
      } catch (err) {
        console.warn('Initial Supabase fetch completed with fallback defaults:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSchoolData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to send data sync to iframe
  const sendSyncToIframe = useCallback((iframeEl: HTMLIFrameElement | null) => {
    if (!iframeEl || !iframeEl.contentWindow) return;

    const payload = {
      settings,
      programmes,
      facilities,
      team,
      activities,
    };

    iframeEl.contentWindow.postMessage(
      {
        type: 'OM_DATA_SYNC',
        payload,
      },
      '*'
    );
  }, [settings, programmes, facilities, team, activities]);

  // 2. Set up bidirectional communication with the ThreeUI Sketchbook iframe
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      const iframe = containerRef.current?.querySelector('iframe') || null;

      // When the sketchbook signals it is ready or mounted
      if (data.type === 'OM_SKETCHBOOK_MOUNTED') {
        sendSyncToIframe(iframe);
      }

      // Handle admission enquiry submission from iframe form
      if (data.type === 'OM_ADMISSION_SUBMIT') {
        try {
          const input = data.payload as CreateAdmissionEnquiryInput;
          const result = await enquiriesService.submitAdmissionEnquiry(input);

          if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(
              {
                type: 'OM_FORM_RESPONSE',
                formId: 'admission',
                success: result.success,
                message: result.success
                  ? 'Your confidential enquiry has been received. Our admissions team will contact you within 2 business days.'
                  : result.error?.message || 'Submission failed. Please check the provided information.',
              },
              '*'
            );
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Error transmitting enquiry.';
          if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(
              {
                type: 'OM_FORM_RESPONSE',
                formId: 'admission',
                success: false,
                message,
              },
              '*'
            );
          }
        }
      }

      // Handle general contact enquiry submission from iframe form
      if (data.type === 'OM_CONTACT_SUBMIT') {
        try {
          const input = data.payload as CreateContactEnquiryInput;
          const result = await enquiriesService.submitContactEnquiry(input);

          if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(
              {
                type: 'OM_FORM_RESPONSE',
                formId: 'contact',
                success: result.success,
                message: result.success
                  ? 'Thank you for reaching out. A member of our staff will respond shortly.'
                  : result.error?.message || 'Message submission failed.',
              },
              '*'
            );
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Error transmitting message.';
          if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(
              {
                type: 'OM_FORM_RESPONSE',
                formId: 'contact',
                success: false,
                message,
              },
              '*'
            );
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [sendSyncToIframe]);

  // Periodic resync if data updates
  useEffect(() => {
    if (!loading && containerRef.current) {
      const iframe = containerRef.current.querySelector('iframe');
      if (iframe) {
        sendSyncToIframe(iframe);
      }
    }
  }, [loading, sendSyncToIframe]);

  return (
    <div
      ref={containerRef}
      className="om-sketchbook-viewport"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '800px',
        backgroundColor: '#f5f0e6',
        overflow: 'hidden',
      }}
      aria-label="OM OPEN MINDS Interactive Educational Sketchbook"
    >
      <MengToSketchbookLandingPage
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
};
