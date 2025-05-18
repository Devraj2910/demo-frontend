import { ChartData, ChartOptions, AnalyticsChartsData, AnalyticsChartOptions } from '../types/ChartTypes';
import { AnalyticsDashboardData } from '../../domain/entities/AnalyticsData';

/**
 * Chart Formatter Service
 * Handles the formatting of analytics data into chart-compatible formats
 */
export class ChartFormatterService {
  /**
   * Format analytics dashboard data into chart data
   * @param dashboardData Raw analytics dashboard data
   * @returns Formatted chart data for all charts
   */
  formatChartData(dashboardData: AnalyticsDashboardData): AnalyticsChartsData {
    return {
      monthlyTrendChart: this.formatMonthlyTrendChart(dashboardData),
      teamAnalyticsChart: this.formatTeamAnalyticsChart(dashboardData),
      titleAnalyticsChart: this.formatTitleAnalyticsChart(dashboardData),
    };
  }

  /**
   * Get default chart options for all chart types
   * @returns Chart options for all chart types
   */
  getChartOptions(): AnalyticsChartOptions {
    return {
      line: this.getLineChartOptions(),
      bar: this.getBarChartOptions(),
      doughnut: this.getDoughnutChartOptions(),
    };
  }

  /**
   * Format monthly analytics data for a line chart
   * @param data Analytics dashboard data
   * @returns Formatted chart data
   */
  private formatMonthlyTrendChart(data: AnalyticsDashboardData): ChartData {
    return {
      labels: data.monthlyAnalytics.map((item) => item.month),
      datasets: [
        {
          label: 'Active Users',
          data: data.monthlyAnalytics.map((item) => item.activeUsers),
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Cards Created',
          data: data.monthlyAnalytics.map((item) => item.cardsCreated),
          borderColor: 'rgba(244, 63, 94, 1)',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }

  /**
   * Format team analytics data for a bar chart
   * @param data Analytics dashboard data
   * @returns Formatted chart data
   */
  private formatTeamAnalyticsChart(data: AnalyticsDashboardData): ChartData {
    return {
      labels: data.teamAnalytics.map((item) => item.name),
      datasets: [
        {
          label: 'Cards Count',
          data: data.teamAnalytics.map((item) => item.cardCount),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(79, 70, 229, 0.8)',
            'rgba(67, 56, 202, 0.8)',
            'rgba(55, 48, 163, 0.8)',
            'rgba(49, 46, 129, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  /**
   * Format title analytics data for a donut chart
   * @param data Analytics dashboard data
   * @returns Formatted chart data
   */
  private formatTitleAnalyticsChart(data: AnalyticsDashboardData): ChartData {
    return {
      labels: data.titleAnalytics.map((item) => item.title),
      datasets: [
        {
          label: 'Kudos Count',
          data: data.titleAnalytics.map((item) => item.count),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(244, 63, 94, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(20, 184, 166, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  /**
   * Get options for line charts
   * @returns Line chart options
   */
  private getLineChartOptions(): ChartOptions {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Monthly Activity',
        },
      },
      animation: {
        duration: 2000,
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  }

  /**
   * Get options for bar charts
   * @returns Bar chart options
   */
  private getBarChartOptions(): ChartOptions {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Team Analytics',
        },
      },
      animation: {
        duration: 1500,
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  }

  /**
   * Get options for doughnut charts
   * @returns Doughnut chart options
   */
  private getDoughnutChartOptions(): ChartOptions {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Kudos by Title',
        },
      },
      animation: {
        duration: 1500,
      },
    };
  }
}
