import type { Metadata } from 'next';
import { Inter, Caveat } from 'next/font/google';
import './globals.css';
import './tailwind.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  title: 'Employee Performance Dashboard',
  description: 'Track and analyze employee performance metrics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`${inter.variable} ${caveat.variable}`}>
      <body className={`${inter.className} bg-gray-50`}>
        <nav className='bg-white shadow-sm border-b border-gray-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between h-16'>
              <div className='flex'>
                <div className='flex-shrink-0 flex items-center'>
                  <span className='text-xl font-bold text-gray-800'>EPD</span>
                </div>
                <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                  <a
                    href='/'
                    className='border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                  >
                    Dashboard
                  </a>
                  <a
                    href='/employees'
                    className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                  >
                    Employees
                  </a>
                  <a
                    href='/reports'
                    className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                  >
                    Reports
                  </a>
                  <a
                    href='/kudowall'
                    className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                  >
                    Kudos Wall
                  </a>
                </div>
              </div>
              <div className='flex items-center'>
                <button className='ml-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium'>
                  New Report
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
