import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../utils/api.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

/**
 * ChartDashboard renders a set of charts summarising leads, bookings
 * and commissions. It requests aggregated metrics from the backend
 * and uses react-chartjs-2 to draw the graphs. If there are no
 * records the charts simply show zero values.
 */
export default function ChartDashboard() {
  const [metrics, setMetrics] = useState(null);
  const fetchMetrics = async () => {
    try {
      const res = await api.get('/metrics/overview');
      setMetrics(res.data);
    } catch (err) {
      console.error('Failed to fetch metrics', err);
    }
  };
  useEffect(() => {
    fetchMetrics();
  }, []);

  if (!metrics) {
    return <p className="text-sm text-text-dark/60">Loading charts...</p>;
  }

  // Prepare data for leads by status bar chart
  const statusLabels = Object.keys(metrics.leadsByStatus || {});
  const statusCounts = statusLabels.map((s) => metrics.leadsByStatus[s]);
  const leadsChartData = {
    labels: statusLabels,
    datasets: [
      {
        label: 'Leads',
        data: statusCounts,
        backgroundColor: '#8B5CF6',
      },
    ],
  };
  const leadsChartOptions = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: 'Status' } },
      y: { title: { display: true, text: 'Count' }, beginAtZero: true },
    },
  };

  // Prepare data for bookings by month line chart
  const bookingLabels = Object.keys(metrics.bookingsByMonth || {}).sort();
  const bookingCounts = bookingLabels.map((k) => metrics.bookingsByMonth[k]);
  const bookingsChartData = {
    labels: bookingLabels,
    datasets: [
      {
        label: 'Bookings',
        data: bookingCounts,
        borderColor: '#34D399',
        backgroundColor: 'rgba(52, 211, 153, 0.3)',
        fill: true,
      },
    ],
  };
  const bookingsChartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { title: { display: true, text: 'Bookings' }, beginAtZero: true },
    },
  };

  // Prepare data for commissions by month line chart
  const commissionLabels = Object.keys(metrics.commissionsByMonth || {}).sort();
  const commissionValues = commissionLabels.map((k) => metrics.commissionsByMonth[k]);
  const commissionsChartData = {
    labels: commissionLabels,
    datasets: [
      {
        label: 'Commissions (£)',
        data: commissionValues,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.3)',
        fill: true,
      },
    ],
  };
  const commissionsChartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { title: { display: true, text: 'Amount (£)' }, beginAtZero: true },
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-md font-semibold mb-2">Leads by Status</h3>
        <Bar data={leadsChartData} options={leadsChartOptions} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-md font-semibold mb-2">Bookings per Month</h3>
          <Line data={bookingsChartData} options={bookingsChartOptions} />
        </div>
        <div>
          <h3 className="text-md font-semibold mb-2">Commissions per Month</h3>
          <Line data={commissionsChartData} options={commissionsChartOptions} />
        </div>
      </div>
    </div>
  );
}