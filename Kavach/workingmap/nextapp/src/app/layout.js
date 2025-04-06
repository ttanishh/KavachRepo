import { Geist, Geist_Mono } from 'next/font/google';
import { SocketProvider } from '@/context/SocketContext';
import './globals.css';

const geistSans = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist-sans' 
});

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono' 
});

export const metadata = {
  title: 'Kavach - Crime Reporting System',
  description: 'An interactive crime reporting and visualization platform for citizens',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50">
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}