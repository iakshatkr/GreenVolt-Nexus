import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { apiClient } from '../../api/client';
import { StationMap } from '../../components/map/StationMap';
import { MetricCard } from '../../components/shared/MetricCard';
import { SectionCard } from '../../components/shared/SectionCard';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import type { ApiResponse, Booking, Payment, Station } from '../../types';

export const UserDashboardPage = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedStationId, setSelectedStationId] = useState('');
  const [filters, setFilters] = useState({ city: 'Jaipur', search: '' });
  const [bookingForm, setBookingForm] = useState({
    portNumber: 1,
    startTime: '',
    endTime: '',
    energyRequestedKwh: 20
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const selectedStation = stations.find((station) => station._id === selectedStationId) ?? stations[0];

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const stationResponse = await apiClient.get<ApiResponse<Station[]>>('/stations', {
        params: {
          city: filters.city || undefined,
          search: filters.search || undefined
        }
      });
      const bookingResponse = await apiClient.get<ApiResponse<Booking[]>>('/bookings/my');
      const paymentResponse = await apiClient.get<ApiResponse<Payment[]>>('/payments/history');

      setStations(stationResponse.data.data);
      setSelectedStationId((current) => current || stationResponse.data.data[0]?._id || '');
      setBookings(bookingResponse.data.data);
      setPayments(paymentResponse.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const bookingSeries = Object.entries(
    bookings.reduce<Record<string, number>>((accumulator, booking) => {
      const label = booking.station?.name ?? 'Station';
      accumulator[label] = (accumulator[label] ?? 0) + 1;
      return accumulator;
    }, {})
  ).map(([stationName, bookingsCount]) => ({ stationName, bookings: bookingsCount }));

  const spendSeries = payments
    .slice()
    .reverse()
    .map((payment) => ({
      invoice: payment.invoiceNumber.slice(-4),
      amount: payment.amount
    }));

  const totalSpend = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const upcomingBookings = bookings.filter((booking) => booking.status === 'pending').length;

  const createBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStation) {
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      await apiClient.post('/bookings', {
        stationId: selectedStation._id,
        ...bookingForm,
        portNumber: Number(bookingForm.portNumber),
        energyRequestedKwh: Number(bookingForm.energyRequestedKwh)
      });
      setMessage('Booking created successfully.');
      await loadDashboard();
    } catch {
      setMessage('We could not create that booking. The slot may already be reserved.');
    } finally {
      setSubmitting(false);
    }
  };

  const simulatePayment = async (bookingId: string) => {
    setMessage('');
    try {
      await apiClient.post(`/payments/checkout/${bookingId}`);
      setMessage('Payment completed and invoice recorded.');
      await loadDashboard();
    } catch {
      setMessage('Payment simulation failed. Please try again.');
    }
  };

  if (loading) {
    return <div className="panel p-10 text-center text-slate-500">Loading user dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel overflow-hidden bg-[linear-gradient(135deg,#082032,#115037)] p-8 text-white">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-200">Driver dashboard</p>
          <h1 className="mt-4 font-display text-4xl font-bold">
            Book solar-powered charging without the guesswork.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-200">
            Search nearby stations, compare pricing and port availability, reserve a charging window, and complete a simulated payment.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
          <MetricCard label="Stations Found" value={String(stations.length)} hint="Approved stations in your current search." />
          <MetricCard label="Upcoming" value={String(upcomingBookings)} hint="Bookings waiting to start." />
          <MetricCard label="Total Spend" value={formatCurrency(totalSpend)} hint="All simulated payments on your account." />
        </div>
      </section>

      <SectionCard
        title="Nearby stations"
        subtitle="Search by city or free-text location details."
        action={
          <form
            className="flex flex-col gap-3 md:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              void loadDashboard();
            }}
          >
            <input className="input" placeholder="City" value={filters.city} onChange={(event) => setFilters((current) => ({ ...current, city: event.target.value }))} />
            <input className="input" placeholder="Search station or address" value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} />
            <button className="btn-primary" type="submit">
              Search
            </button>
          </form>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <StationMap
            stations={stations}
            selectedStationId={selectedStation?._id}
            onSelect={(station) => setSelectedStationId(station._id)}
          />

          <div className="space-y-4">
            {stations.map((station) => (
              <button
                key={station._id}
                type="button"
                onClick={() => setSelectedStationId(station._id)}
                className={`w-full rounded-3xl border p-5 text-left transition ${
                  selectedStation?._id === station._id
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-xl font-bold text-night">{station.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{station.address}</p>
                  </div>
                  <StatusBadge value={station.approvalStatus} />
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                  <p>{station.solarCapacityKw} kW solar</p>
                  <p>{station.chargingPorts} ports</p>
                  <p>{formatCurrency(station.pricePerKwh)}/kWh</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title={selectedStation ? selectedStation.name : 'Book a station'}
          subtitle={selectedStation?.description ?? 'Choose a station to create your booking.'}
        >
          {selectedStation ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="panel-muted p-4">
                  <p className="text-sm text-slate-500">Pricing</p>
                  <p className="mt-2 font-semibold text-night">{formatCurrency(selectedStation.pricePerKwh)}/kWh</p>
                </div>
                <div className="panel-muted p-4">
                  <p className="text-sm text-slate-500">Connectors</p>
                  <p className="mt-2 font-semibold text-night">{selectedStation.connectorTypes.join(', ')}</p>
                </div>
              </div>

              <form className="mt-6 space-y-4" onSubmit={createBooking}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="label">Charging port</label>
                    <select
                      className="input"
                      value={bookingForm.portNumber}
                      onChange={(event) =>
                        setBookingForm((current) => ({
                          ...current,
                          portNumber: Number(event.target.value)
                        }))
                      }
                    >
                      {Array.from({ length: selectedStation.chargingPorts }, (_, index) => index + 1).map((port) => (
                        <option key={port} value={port}>
                          Port {port}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Energy request (kWh)</label>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      value={bookingForm.energyRequestedKwh}
                      onChange={(event) =>
                        setBookingForm((current) => ({
                          ...current,
                          energyRequestedKwh: Number(event.target.value)
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="label">Start time</label>
                    <input
                      className="input"
                      type="datetime-local"
                      value={bookingForm.startTime}
                      onChange={(event) =>
                        setBookingForm((current) => ({ ...current, startTime: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="label">End time</label>
                    <input
                      className="input"
                      type="datetime-local"
                      value={bookingForm.endTime}
                      onChange={(event) =>
                        setBookingForm((current) => ({ ...current, endTime: event.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <button className="btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Booking...' : 'Reserve charging slot'}
                </button>
                {message ? <p className="text-sm text-brand-700">{message}</p> : null}
              </form>
            </>
          ) : (
            <p className="text-slate-500">No approved stations match your current search.</p>
          )}
        </SectionCard>

        <SectionCard title="Booking insights" subtitle="Your charging usage and payment trend at a glance.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="panel-muted h-72 p-4">
              <p className="mb-4 text-sm font-semibold text-slate-600">Bookings by station</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingSeries}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="stationName" hide />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#219f66" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="panel-muted h-72 p-4">
              <p className="mb-4 text-sm font-semibold text-slate-600">Payment trend</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendSeries}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="invoice" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#082032" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Bookings and payments" subtitle="Complete your payment after creating a reservation.">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3">Station</th>
                <th className="pb-3">Window</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Invoice</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t border-slate-100">
                  <td className="py-4">
                    <p className="font-semibold text-night">{booking.station.name}</p>
                    <p className="text-slate-500">{booking.station.city}</p>
                  </td>
                  <td className="py-4 text-slate-600">
                    <p>{formatDateTime(booking.startTime)}</p>
                    <p>{formatDateTime(booking.endTime)}</p>
                  </td>
                  <td className="py-4 space-x-2">
                    <StatusBadge value={booking.status} />
                    <StatusBadge value={booking.paymentStatus} />
                  </td>
                  <td className="py-4 text-slate-600">{booking.invoiceNumber}</td>
                  <td className="py-4 font-semibold text-night">{formatCurrency(booking.estimatedAmount)}</td>
                  <td className="py-4">
                    {booking.paymentStatus === 'pending' ? (
                      <button className="btn-primary !px-4 !py-2 text-sm" onClick={() => void simulatePayment(booking._id)}>
                        Pay now
                      </button>
                    ) : (
                      <span className="text-slate-500">Paid</span>
                    )}
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
