import React from 'react';
import { Download, Sparkles, X, ArrowUpCircle, ShieldCheck } from 'lucide-react';

export function UpdateModal({ updateInfo, onClose }) {
  if (!updateInfo || !updateInfo.hasUpdate) return null;

  const handleDownload = () => {
    if (updateInfo.apkUrl) {
      window.open(updateInfo.apkUrl, '_blank');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 200, background: 'rgba(11, 15, 25, 0.92)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '20px'
    }}>
      <div 
        className="glass-card"
        style={{
          maxWidth: '400px', width: '100%', borderRadius: '24px', padding: '24px',
          margin: 'auto', border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)', position: 'relative'
        }}
      >
        {/* Close Button (only if not forced update) */}
        {!updateInfo.forceUpdate && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              padding: '8px', borderRadius: '12px', background: 'rgba(30,41,59,0.8)',
              border: 'none', color: '#94a3b8', cursor: 'pointer'
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        )}

        {/* Update Icon */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyCenter: 'center',
          margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(37,99,235,0.4)'
        }}>
          <ArrowUpCircle style={{ width: 30, height: 30, color: '#ffffff' }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, color: '#22d3ee', marginBottom: '8px' }}>
            <Sparkles style={{ width: 12, height: 12 }} />
            NEW UPDATE AVAILABLE
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
            Version {updateInfo.latestVersion}
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>
            An updated version of OpenFresher is ready to download!
          </p>
        </div>

        {/* Release Notes */}
        <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '14px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck style={{ width: 14, height: 14 }} /> What's New:
          </h4>
          <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
            {updateInfo.releaseNotes}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {!updateInfo.forceUpdate && (
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(30,41,59,0.8)', color: '#cbd5e1', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
              }}
            >
              Later
            </button>
          )}

          <button
            onClick={handleDownload}
            style={{
              flex: 2, padding: '12px 18px', borderRadius: '14px', border: 'none',
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              color: '#ffffff', fontWeight: 800, fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: '8px',
              boxShadow: '0 8px 24px rgba(37,99,235,0.35)'
            }}
          >
            <Download style={{ width: 16, height: 16 }} />
            UPDATE NOW
          </button>
        </div>
      </div>
    </div>
  );
}
