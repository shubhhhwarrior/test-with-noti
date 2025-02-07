import React, { useState } from 'react';

const AdminNotificationPanel = () => {
  const [notification, setNotification] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const isAdmin = true; // Replace with actual admin check logic

  const handleSendNotification = async () => {
    if (!isAdmin) {
      alert('You do not have permission to send notifications.');
      return;
    }

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: notificationTitle, message: notification, recipients: ['all'] }), // Adjust recipients as needed
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Send Custom Notification</h2>
      <input
        type="text"
        value={notificationTitle}
        onChange={(e) => setNotificationTitle(e.target.value)}
        placeholder="Enter notification title"
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <textarea
        value={notification}
        onChange={(e) => setNotification(e.target.value)}
        placeholder="Enter your notification message here..."
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onClick={handleSendNotification}
        className="mt-2 p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors w-full"
      >
        Send Notification
      </button>
    </div>
  );
};

export default AdminNotificationPanel;
