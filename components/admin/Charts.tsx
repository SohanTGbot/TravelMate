import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartWrapperProps {
    title: string;
    children: React.ReactNode;
    height?: number;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({ title, children, height = 300 }) => {
    return (
        <div className="bg-charcoal-900 p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
            <ResponsiveContainer width="100%" height={height}>
                {children}
            </ResponsiveContainer>
        </div>
    );
};

// User Growth Line Chart
interface UserGrowthData {
    month: string;
    users: number;
}

export const UserGrowthChart: React.FC<{ data: UserGrowthData[] }> = ({ data }) => {
    return (
        <ChartWrapper title="User Growth Trend">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 5 }}
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ChartWrapper>
    );
};

// Revenue Trend Area Chart
interface RevenueData {
    month: string;
    revenue: number;
}

export const RevenueTrendChart: React.FC<{ data: RevenueData[] }> = ({ data }) => {
    return (
        <ChartWrapper title="Revenue Trends">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Legend />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#F97316"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                />
            </AreaChart>
        </ChartWrapper>
    );
};

// Trip Requests Bar Chart
interface TripRequestData {
    destination: string;
    requests: number;
}

export const TripRequestsChart: React.FC<{ data: TripRequestData[] }> = ({ data }) => {
    return (
        <ChartWrapper title="Trip Requests by Destination">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="destination" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                />
                <Legend />
                <Bar dataKey="requests" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ChartWrapper>
    );
};

// Booking Status Pie Chart
interface BookingStatusData {
    name: string;
    value: number;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export const BookingStatusChart: React.FC<{ data: BookingStatusData[] }> = ({ data }) => {
    return (
        <ChartWrapper title="Booking Status Distribution" height={350}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                />
                <Legend />
            </PieChart>
        </ChartWrapper>
    );
};

// Newsletter Growth Chart
interface NewsletterData {
    month: string;
    subscribers: number;
}

export const NewsletterGrowthChart: React.FC<{ data: NewsletterData[] }> = ({ data }) => {
    return (
        <ChartWrapper title="Newsletter Subscriber Growth">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                />
                <Legend />
                <Area
                    type="monotone"
                    dataKey="subscribers"
                    stroke="#EC4899"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSubscribers)"
                />
            </AreaChart>
        </ChartWrapper>
    );
};
