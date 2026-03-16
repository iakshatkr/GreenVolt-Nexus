import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { apiClient } from '../../api/client';
import { MetricCard } from '../../components/shared/MetricCard';
import { SectionCard } from '../../components/shared/SectionCard';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency } from '../../lib/utils';
import type { AdminAnalytics, ApiResponse, AuthUser, Station } from '../../types';

type AdminUser = AuthUser & {
  _id: string;
  isActive?: boolean;
};

export const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [message, setMessage] = useState('');

  const loadDashboard = async () => {
    const [analyticsResponse, usersResponse, stationsResponse] = await Promise.all([
      apiClient.get<ApiResponse<AdminAnalytics>>('/analytics/admin'),
      apiClient.get<ApiResponse<AdminUser[]>>('/admin/users'),
      apiClient.get<ApiResponse<Station[]>>('/admin/stations')
    ]);

    setAnalytics(analyticsResponse.data.data);
    setUsers(usersResponse.data.data);
    setStations(stationsResponse.data.data);
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const moderateStation = async (stationId: string, approvalStatus: 'approved' | 'rejected') => {
    setMessage('');
    await apiClient.patch(`/admin/stations/${stationId}/approval`, { approvalStatus });
    setMessage(`Station ${approvalStatus}.`);
    await loadDashboard();
  };

  const deleteUser = async (userId: string) => {
    setMessage('');
    await apiClient.delete(`/admin/users/${userId}`);
    setMessage('User deleted.');
    await loadDashboard();
  };

  const sustainabilityData = analytics
    ? [
        { label: 'Solar kWh', value: analytics.solarGeneratedKwh },
        { label: 'Delivered kWh', value: analytics.totalDeliveredKwh },
        { label: 'Carbon Saved', value: analytics.carbonSavedKg }
      ]
    : [];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Users" value={String(analytics?.users ?? 0)} hint="Registered platform accounts." />
        <MetricCard label="Stations" value={String(analytics?.stations ?? 0)} hint="All station listings in the system." />
        <MetricCard label="Pending Reviews" value={String(analytics?.pendingStations ?? 0)} hint="Stations waiting for admin action." />
        <MetricCard label="Revenue" value={formatCurrency(analytics?.totalRevenue ?? 0)} hint="Total simulated payments captured." />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="System controls" subtitle="Approve stations, manage users, and monitor platform growth.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="panel-muted p-5">
              <p className="text-sm text-slate-500">Total bookings</p>
              <p className="mt-3 font-display text-3xl font-bold text-night">{analytics?.bookings ?? 0}</p>
            </div>
            <div className="panel-muted p-5">
              <p className="text-sm text-slate-500">Pending station queue</p>
              <p className="mt-3 font-display text-3xl font-bold text-night">{analytics?.pendingStations ?? 0}</p>
            </div>
          </div>
          {message ? <p className="mt-4 text-sm text-brand-700">{message}</p> : null}
        </SectionCard>

        <SectionCard title="Sustainability snapshot" subtitle="Network-wide energy delivery and solar output.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sustainabilityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#115037" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Station moderation" subtitle="Approve or reject newly submitted charging stations.">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3">Station</th>
                <th className="pb-3">Owner</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr key={station._id} className="border-t border-slate-100">
                  <td className="py-4">
                    <p className="font-semibold text-night">{station.name}</p>
                    <p className="text-slate-500">{station.address}</p>
                  </td>
                  <td className="py-4 text-slate-600">{station.owner?.name ?? 'Owner'}</td>
                  <td className="py-4">
                    <StatusBadge value={station.approvalStatus} />
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="btn-primary !px-4 !py-2 text-sm" onClick={() => void moderateStation(station._id, 'approved')}>
                        Approve
                      </button>
                      <button className="btn-secondary !px-4 !py-2 text-sm" onClick={() => void moderateStation(station._id, 'rejected')}>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="User management" subtitle="Inspect roles and remove accounts when necessary.">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">City</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-slate-100">
                  <td className="py-4 font-semibold text-night">{user.name}</td>
                  <td className="py-4 text-slate-600">{user.email}</td>
                  <td className="py-4 text-slate-600">{user.city}</td>
                  <td className="py-4">
                    <StatusBadge value={user.role} />
                  </td>
                  <td className="py-4">
                    <button className="btn-secondary !px-4 !py-2 text-sm" onClick={() => void deleteUser(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};
