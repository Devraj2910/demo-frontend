'use client';

import { useState } from 'react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('performance');

  // Mock data for demonstration
  const reportTypes = [
    { id: 'performance', name: 'Performance Reports' },
    { id: 'department', name: 'Department Analytics' },
    { id: 'trends', name: 'Performance Trends' },
    { id: 'reviews', name: 'Review Statistics' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Generate and view employee performance reports</p>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Report Types</h2>
              </div>
              <nav className="p-2">
                <ul>
                  {reportTypes.map((report) => (
                    <li key={report.id}>
                      <button
                        onClick={() => setSelectedReport(report.id)}
                        className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                          selectedReport === report.id
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {report.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Export Options
              </h3>
              <div className="space-y-3">
                <button className="flex items-center text-sm text-gray-700 hover:text-indigo-600">
                  <svg className="mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export as PDF
                </button>
                <button className="flex items-center text-sm text-gray-700 hover:text-indigo-600">
                  <svg className="mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export as Excel
                </button>
                <button className="flex items-center text-sm text-gray-700 hover:text-indigo-600">
                  <svg className="mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share Report
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {reportTypes.find(r => r.id === selectedReport)?.name || 'Report'}
                </h2>
                <div>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Generate Report
                  </button>
                </div>
              </div>
              
              {/* Placeholder for report content */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No report generated</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure your report parameters and click on Generate Report to view data.
                </p>
              </div>
              
              {/* Report configuration form */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Report Configuration</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="report-period" className="block text-sm font-medium text-gray-700">
                      Time Period
                    </label>
                    <select
                      id="report-period"
                      name="report-period"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option>Last 30 days</option>
                      <option>Last quarter</option>
                      <option>Last year</option>
                      <option>Custom range</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <select
                      id="department-filter"
                      name="department-filter"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option>All Departments</option>
                      <option>Engineering</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>HR</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="metrics" className="block text-sm font-medium text-gray-700">
                      Performance Metrics
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <input
                          id="metrics-overall"
                          name="metrics"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="metrics-overall" className="ml-2 text-sm text-gray-700">
                          Overall Performance Score
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="metrics-trend"
                          name="metrics"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="metrics-trend" className="ml-2 text-sm text-gray-700">
                          Performance Trends
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="metrics-department"
                          name="metrics"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="metrics-department" className="ml-2 text-sm text-gray-700">
                          Department Comparisons
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 