
import React from 'react';
import { Button } from '../Button';

interface DashboardStatsProps {
    data: {
        users: number;
        bookings: number;
        revenue: number;
        reviews: number;
        activeTrips: number;
    };
    recentBookings: any[];
    chartData?: number[];
    topDestinations?: any[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ data, recentBookings, chartData = [], topDestinations = [] }) => {
    // Basic array normalization for chart display
    // If no data, show zeros
    const normalizedChart = chartData.length > 0 ? chartData : [0, 0, 0, 0, 0, 0, 0];
    const maxVal = Math.max(...normalizedChart, 1);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                    <p className="text-charcoal-400 text-sm">Realtime insights from Supabase</p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline">Download Report</Button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-charcoal-800 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-charcoal-400 text-xs font-bold uppercase tracking-wider">Total Users</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{data.users}</h3>
                            <div className="flex items-center gap-1 mt-2 text-green-400 text-xs font-medium">
                                <span className="animate-pulse">●</span>
                                <span className="text-charcoal-500">Live Count</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <span className="text-xl">👥</span>
                        </div>
                    </div>
                </div>

                <div className="bg-charcoal-800 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-forest-500/30 transition-colors">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-charcoal-400 text-xs font-bold uppercase tracking-wider">Bookings</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{data.bookings}</h3>
                            <div className="flex items-center gap-1 mt-2 text-green-400 text-xs font-medium">
                                <span>↑ New</span>
                                <span className="text-charcoal-500">Requests</span>
                            </div>
                        </div>
                        <div className="p-3 bg-forest-500/10 rounded-xl text-forest-400">
                            <span className="text-xl">✈️</span>
                        </div>
                    </div>
                </div>

                <div className="bg-charcoal-800 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-charcoal-400 text-xs font-bold uppercase tracking-wider">Active Trips</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{data.activeTrips}</h3>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
                            <span className="text-xl">🌍</span>
                        </div>
                    </div>
                </div>

                <div className="bg-charcoal-800 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-charcoal-400 text-xs font-bold uppercase tracking-wider">Est. Revenue</p>
                            <h3 className="text-3xl font-bold text-white mt-1">${data.revenue.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                            <span className="text-xl">💰</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-charcoal-800 border border-white/5 rounded-3xl p-6">
                    <header className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-white">Booking Activity (Last 7 Days)</h3>
                    </header>
                    <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4 border-b border-white/5">
                        {normalizedChart.map((val, i) => {
                            const heightPct = (val / maxVal) * 100;
                            return (
                                <div key={i} className="w-full flex flex-col items-center gap-2 group">
                                    <div className="w-full max-w-[40px] bg-charcoal-700 rounded-t-xl relative overflow-hidden group-hover:bg-forest-900 transition-all h-full flex flex-col justify-end">
                                        <div
                                            className="w-full bg-forest-500 rounded-t-xl hover:bg-forest-400 transition-all relative group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                                            style={{ height: `${heightPct}%`, minHeight: '4px' }}
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-lg pointer-events-none transition-opacity">
                                                {val}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-charcoal-500 font-medium">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Donut Chart / Top Destinations */}
                <div className="bg-charcoal-800 border border-white/5 rounded-3xl p-6">
                    <header className="mb-6">
                        <h3 className="font-bold text-lg text-white">Trending Destinations</h3>
                    </header>
                    <div className="space-y-4">
                        {topDestinations.map((d, i) => (
                            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-charcoal-300">{d.name}</span>
                                    <span className="text-xs font-bold text-white">{d.pct}%</span>
                                </div>
                                <div className="h-2 w-full bg-charcoal-900 rounded-full overflow-hidden">
                                    <div className={`h-full ${d.col || 'bg-blue-500'}`} style={{ width: `${d.pct}%` }}></div>
                                </div>
                            </div>
                        ))}
                        {topDestinations.length === 0 && (
                            <p className="text-charcoal-500 text-sm text-center py-4">No requests found yet.</p>
                        )}
                    </div>
                    <div className="mt-8 p-4 bg-charcoal-900 rounded-xl text-center">
                        <p className="text-charcoal-400 text-xs">Total Revenue</p>
                        <p className="text-2xl font-bold text-white mt-1">${data.revenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-charcoal-800 border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Recent Trip Requests</h3>
                    <Button size="sm" variant="ghost">View All</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-charcoal-900 text-charcoal-400 text-xs uppercase font-medium">
                            <tr>
                                <th className="p-4 pl-6">User</th>
                                <th className="p-4">Destination</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentBookings.map((booking, idx) => (
                                <tr key={idx} className="hover:bg-charcoal-700/30 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                                {booking.userName?.charAt(0) || 'G'}
                                            </div>
                                            <span className="font-medium text-sm text-white">{booking.userName || 'Guest'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-charcoal-300">{booking.destination}</td>
                                    <td className="p-4 text-xs text-charcoal-500">{new Date(booking.timestamp).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <button className="text-charcoal-400 hover:text-white transition-colors">
                                            •••
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {recentBookings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-charcoal-500 text-sm">No recent bookings found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
