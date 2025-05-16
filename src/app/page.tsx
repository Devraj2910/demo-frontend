'use client';

import { useEffect, useState } from 'react';
import { GetEmployeePerformanceStats } from '@/clean-architecture/modules/employee/application/useCases/GetEmployeePerformanceStats/GetEmployeePerformanceStats';
import { EmployeeRepositoryImpl } from '@/clean-architecture/modules/employee/infrastructure/repositories/EmployeeRepositoryImpl';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement,
  LineElement,
  Title,
  Filler
);

export default function Home() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    const fetchStats = async () => {
      const repository = new EmployeeRepositoryImpl();
      const useCase = new GetEmployeePerformanceStats(repository);
      const result = await useCase.execute();
      setStats(result);
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-200 rounded"></div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const generateTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return {
      labels: months,
      datasets: Object.keys(stats?.departmentAverages || {}).map((dept, i) => ({
        label: dept,
        data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + stats?.departmentAverages[dept] - 10).map(val => Math.min(Math.max(val, 50), 100)),
        borderColor: i === 0 ? 'rgba(255, 99, 132, 1)' : i === 1 ? 'rgba(54, 162, 235, 1)' : i === 2 ? 'rgba(255, 206, 86, 1)' : 'rgba(75, 192, 192, 1)',
        backgroundColor: i === 0 ? 'rgba(255, 99, 132, 0.2)' : i === 1 ? 'rgba(54, 162, 235, 0.2)' : i === 2 ? 'rgba(255, 206, 86, 0.2)' : 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        fill: true
      }))
    };
  };

  const departmentData = {
    labels: Object.keys(stats?.departmentAverages || {}),
    datasets: [
      {
        data: Object.values(stats?.departmentAverages || {}),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topPerformersData = {
    labels: stats?.topPerformers.map((p: any) => p.fullName) || [],
    datasets: [
      {
        label: 'Performance Score',
        data: stats?.topPerformers.map((p: any) => p.performanceScore) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Employee Performance Dashboard</h1>
            <p className="text-gray-500 mt-1">Track, analyze, and improve your team's performance</p>
          </div>
          <div className="flex items-center space-x-2 bg-white p-1 rounded-md shadow-md border border-gray-200">
            <button 
              onClick={() => setTimeRange('week')} 
              className={`px-3 py-1.5 text-sm font-medium rounded ${timeRange === 'week' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setTimeRange('month')} 
              className={`px-3 py-1.5 text-sm font-medium rounded ${timeRange === 'month' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setTimeRange('quarter')} 
              className={`px-3 py-1.5 text-sm font-medium rounded ${timeRange === 'quarter' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Quarter
            </button>
          </div>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Performance</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stats?.averageScore.toFixed(1)}%</p>
                  <p className="ml-2 text-sm text-green-600">+5.2%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Departments</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{Object.keys(stats?.departmentAverages || {}).length}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Top Performer Score</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.topPerformers[0]?.performanceScore || 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Department Performance</h2>
              <div className="text-sm text-gray-500">Total Departments: {Object.keys(stats?.departmentAverages || {}).length}</div>
            </div>
            <div className="h-80 flex items-center justify-center">
              <Pie 
                data={departmentData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${context.parsed.toFixed(1)}%`;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
              <div className="text-sm text-gray-500">Top {stats?.topPerformers.length || 0} employees</div>
            </div>
            <div className="h-80">
              <Bar 
                data={topPerformersData}
                options={{
                  responsive: true,
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `Performance Score: ${context.parsed.x}%`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      max: 100,
                      grid: {
                        display: true,
                      },
                      ticks: {
                        stepSize: 20
                      }
                    },
                    y: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Performance Trend</h2>
            <div className="text-sm text-gray-500">Last 6 months</div>
          </div>
          <div className="h-80">
            <Line 
              data={generateTrendData()}
              options={{
                responsive: true,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y}%`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 40,
                    max: 100,
                    grid: {
                      display: true
                    },
                    ticks: {
                      stepSize: 10
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Improvement Suggestions Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-blue-700 font-medium mb-2">Department Insights</h3>
              <p className="text-sm text-gray-600">Engineering shows the highest average performance at {stats?.departmentAverages?.Engineering?.toFixed(1) || 0}%. Consider sharing best practices from this team with other departments.</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h3 className="text-emerald-700 font-medium mb-2">Individual Improvements</h3>
              <p className="text-sm text-gray-600">The top performer, {stats?.topPerformers[0]?.fullName || 'N/A'}, exceeds the average by {((stats?.topPerformers[0]?.performanceScore || 0) - stats?.averageScore).toFixed(1)}%. Schedule knowledge sharing sessions to elevate team performance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 