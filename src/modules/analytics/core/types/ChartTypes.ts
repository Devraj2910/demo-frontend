/**
 * Common types for chart data used in the analytics module
 */

/**
 * Basic Chart Data structure
 * Compatible with Chart.js
 */
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }>;
}

/**
 * Chart options for different chart types
 */
export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      position?: 'top' | 'bottom' | 'left' | 'right';
      display?: boolean;
    };
    title?: {
      display?: boolean;
      text?: string;
    };
    tooltip?: {
      enabled?: boolean;
    };
  };
  animation?: {
    duration?: number;
  };
  scales?: {
    y?: {
      beginAtZero?: boolean;
      suggestedMax?: number;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    x?: {
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
}

/**
 * Complete chart configuration
 */
export interface ChartConfig {
  data: ChartData;
  options: ChartOptions;
  type: 'line' | 'bar' | 'doughnut' | 'pie' | 'polarArea' | 'radar';
}

/**
 * Charts data for the analytics dashboard
 */
export interface AnalyticsChartsData {
  monthlyTrendChart: ChartData;
  teamAnalyticsChart: ChartData;
  titleAnalyticsChart: ChartData;
}

/**
 * Chart options for the analytics dashboard
 */
export interface AnalyticsChartOptions {
  line: ChartOptions;
  bar: ChartOptions;
  doughnut: ChartOptions;
}
