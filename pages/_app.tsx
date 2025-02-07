/**
 * @copyright (c) 2024 - Present
 * @author github.com/shubhhhwarrior
 * @license MIT
 */

import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(async registration => {
        console.log('Service Worker registered with scope:', registration.scope);

        try {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BDHU4tdju3yHIX5wQoU7YBrIpxoxOdIppHOphDph5Ef2QMI7yCG-xMT87B4ydEkVe17XFuz7eGKiR2NEGkZnOT0'
          });

          console.log('Push Subscription:', subscription);

          await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
          });
        } catch (error) {
          console.error('Failed to subscribe to push notifications:', error);
        }
      }).catch(error => {
        console.error('Service Worker registration failed:', error);
      });

      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </SessionProvider>
    </ErrorBoundary>
  );
}
