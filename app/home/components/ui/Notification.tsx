import React from 'react';
import { Bell } from 'lucide-react';

interface Notification {
  id: number;
  text: string;
  time: string;
  type: string;
}

interface NotificationPopupProps {
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ 
  showNotifications, 
  setShowNotifications 
}) => {
  const notifications: Notification[] = [
    { id: 1, text: "Your rent payment is due in 3 days", time: "2h ago", type: "warning" },
    { id: 2, text: "You've earned 50 PAISHE points!", time: "5h ago", type: "success" },
    { id: 3, text: "New tax filing deadline approaching", time: "1d ago", type: "info" },
    { id: 4, text: "Budget limit reached for Shopping", time: "2d ago", type: "alert" }
  ];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onMouseEnter={() => setShowNotifications(true)}
        onMouseLeave={() => setShowNotifications(false)}
        style={{
          background: '#FFFFFF',
          border: '2px solid #050505',
          padding: '6px',
          cursor: 'pointer',
          boxShadow: showNotifications ? '1px 1px 0 #050505' : '2px 2px 0 #050505',
          transform: showNotifications ? 'translate(1px, 1px)' : 'translate(0, 0)',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Bell size={14} strokeWidth={2.5} />
      </button>

      {showNotifications && (
        <div
          onMouseEnter={() => setShowNotifications(true)}
          onMouseLeave={() => setShowNotifications(false)}
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: '#FFFFFF',
            border: '3px solid #050505',
            boxShadow: '4px 4px 0 #050505',
            width: '320px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000,
            fontFamily: "'Space Grotesk', monospace"
          }}
        >
          <div style={{
            padding: '12px 16px',
            borderBottom: '2px solid #050505',
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>
            NOTIFICATIONS
          </div>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              style={{
                padding: '12px 16px',
                borderBottom: '2px solid #E8E8E8',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F5F5F5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
              }}
            >
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                marginBottom: '4px',
                color: '#050505'
              }}>
                {notif.text}
              </div>
              <div style={{
                fontSize: '9px',
                color: '#666',
                fontWeight: 500
              }}>
                {notif.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;