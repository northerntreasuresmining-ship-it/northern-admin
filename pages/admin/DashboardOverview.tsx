import React, { useState, useEffect } from 'react';
import {
    Users,
    ShoppingBag,
    Package,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { adminService, AdminStats } from '../../services/adminService';
import { analyticsService } from '../../services/analyticsService';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const DashboardOverview: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsData, analyticsData] = await Promise.all([
                adminService.getDashboardStats(),
                analyticsService.getAnalytics('daily', parseInt(period))
            ]);
            setStats(statsData);
            setAnalytics(analyticsData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-8 rounded-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-slate-50 border border-slate-200 rounded-sm"></div>
                    ))}
                </div>
                <div className="h-96 bg-slate-50 border border-slate-200 rounded-sm"></div>
            </div>
        );
    }

    if (error || !stats || !analytics) {
        return (
            <div className="p-8 bg-red-50 text-red-600 rounded-sm border border-red-200">
                <h3 className="font-bold uppercase tracking-widest text-sm mb-2">Error Accessing Data</h3>
                <p>{error || 'Unable to load dashboard'}</p>
            </div>
        );
    }

    // Format daily data for charts
    const formattedDailyData = analytics.dailyData.map((item: any) => ({
        date: `${item._id.month}/${item._id.day}`,
        revenue: item.revenue,
        orders: item.orders
    }));

    // Format category data for pie chart
    const categoryData = analytics.categoryStats.map((item: any) => ({
        name: item._id,
        value: item.revenue
    }));

    // Format top products
    const topProductsChart = analytics.topProducts.slice(0, 5).map((item: any) => ({
        name: item.product.name.substring(0, 20),
        revenue: item.totalRevenue,
        quantity: item.totalQuantity
    }));

    const statCards = [
        {
            label: 'Total Revenue',
            value: `PKR ${stats.stats.totalRevenue.toLocaleString()}`,
            growth: analytics.growth.revenue,
            icon: DollarSign,
            color: 'bg-slate-50',
            textColor: 'text-accent-gold'
        },
        {
            label: 'Total Orders',
            value: stats.stats.totalOrders.toString(),
            growth: analytics.growth.orders,
            icon: ShoppingBag,
            color: 'bg-slate-50',
            textColor: 'text-primary'
        },
        {
            label: 'Total Customers',
            value: stats.stats.totalUsers.toString(),
            growth: '+12.5',
            icon: Users,
            color: 'bg-slate-50',
            textColor: 'text-primary'
        },
        {
            label: 'Products',
            value: stats.stats.totalProducts.toString(),
            growth: '+5.2',
            icon: Package,
            color: 'bg-slate-50',
            textColor: 'text-primary'
        }
    ];

    return (
        <div className="space-y-8 min-h-screen text-slate-900">
            {/* Period Selector */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-sans font-black tracking-tighter uppercase mb-2">Analytics <span className="text-accent-gold italic">Dashboard</span></h1>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Comprehensive Obsidian & Gold Insights</p>
                </div>
                <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 p-1 px-3">
                    <Calendar className="w-4 h-4 text-accent-gold" />
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-transparent text-slate-900 text-[10px] uppercase font-black tracking-widest focus:outline-none appearance-none cursor-pointer py-2 pl-2 pr-8 border-none focus:ring-0"
                    >
                        <option value="7" className="bg-white text-slate-900">Last 7 Days</option>
                        <option value="30" className="bg-white text-slate-900">Last 30 Days</option>
                        <option value="90" className="bg-white text-slate-900">Last 90 Days</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((card) => (
                    <div key={card.label} className="card-premium grain-texture p-8 group relative overflow-hidden bg-white border border-slate-100">
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="bg-slate-50 p-4 rounded-2xl text-accent border border-accent/20 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 shimmer-gold opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <card.icon className="w-6 h-6 relative z-10" />
                            </div>
                            <div className={`flex items-center space-x-1 ${parseFloat(card.growth) >= 0 ? 'text-emerald-500' : 'text-rose-500'} font-black text-xs`}>
                                {parseFloat(card.growth) >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                <span className="tracking-widest">{Math.abs(parseFloat(card.growth))}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] mb-2">
                                {card.label}
                            </p>
                            <h4 className="text-4xl font-sans font-black text-primary tracking-tighter">
                                {card.value}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Over Time */}
                <div className="bg-white border border-slate-100 p-8 grain-texture shadow-premium relative">
                    <h3 className="font-sans font-black text-slate-900 text-xl uppercase tracking-tighter mb-6 relative z-10">Revenue <span className="text-accent-gold italic">Trend</span></h3>
                    <ResponsiveContainer width="100%" height={300} className="relative z-10">
                        <AreaChart data={formattedDailyData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#009e99" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#009e99" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#f1f5f9' }} tickLine={{ stroke: '#f1f5f9' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#f1f5f9' }} tickLine={{ stroke: '#f1f5f9' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', fontSize: '10px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#009e99' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#009e99" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Order Volume Over Time */}
                <div className="bg-white border border-slate-100 p-8 grain-texture shadow-premium relative">
                    <h3 className="font-sans font-black text-slate-900 text-xl uppercase tracking-tighter mb-6 relative z-10">Order <span className="text-slate-400 italic">Volume</span></h3>
                    <ResponsiveContainer width="100%" height={300} className="relative z-10">
                        <BarChart data={formattedDailyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#f1f5f9' }} tickLine={{ stroke: '#f1f5f9' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#f1f5f9' }} tickLine={{ stroke: '#f1f5f9' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', fontSize: '10px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="orders" fill="#00827f" fillOpacity={0.8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Sales by Category */}
                <div className="bg-white border border-slate-100 p-8 grain-texture shadow-premium relative">
                    <h3 className="font-sans font-black text-slate-900 text-xl uppercase tracking-tighter mb-6 relative z-10">Sales <span className="text-accent-gold italic">By Category</span></h3>
                    <ResponsiveContainer width="100%" height={300} className="relative z-10">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => entry.name}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                stroke="#fff"
                                strokeWidth={2}
                            >
                                {categoryData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#009e99' : index === 1 ? '#0B1215' : index === 2 ? '#666666' : '#cbd5e1'} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', fontSize: '10px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Products */}
                <div className="bg-white border border-slate-100 p-8 grain-texture shadow-premium relative">
                    <h3 className="font-sans font-black text-slate-900 text-xl uppercase tracking-tighter mb-6 relative z-10">Top <span className="text-slate-400 italic">Products</span></h3>
                    <ResponsiveContainer width="100%" height={300} className="relative z-10">
                        <BarChart data={topProductsChart} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#f1f5f9' }} tickLine={{ stroke: '#f1f5f9' }} />
                            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900, textTransform: 'uppercase' }} axisLine={{ stroke: '#f1f5f9' }} tickLine={{ stroke: '#f1f5f9' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', fontSize: '10px', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="revenue" fill="#009e99" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white border border-slate-100 grain-texture shadow-premium overflow-hidden rounded-none relative">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between relative z-10">
                    <h3 className="font-sans font-black text-slate-900 text-xl uppercase tracking-tighter">Recent <span className="text-accent-gold italic">Orders</span></h3>
                    <span className="text-[9px] font-black text-accent-gold bg-accent-gold/10 px-3 py-1 border border-accent-gold/20 uppercase tracking-[0.3em]">Live Feed</span>
                </div>
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Order Ref</th>
                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Client ID</th>
                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Valuation</th>
                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats.recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5 font-mono text-[10px] text-slate-500">
                                        {order._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-8 py-5 font-black text-slate-700 text-xs uppercase tracking-widest">
                                        {order.user?.name || 'GUEST-001'}
                                    </td>
                                    <td className="px-8 py-5 font-bold text-accent-gold text-sm font-sans">
                                        PKR {order.totalPrice.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' :
                                            order.status === 'Shipped' ? 'bg-amber-100 text-amber-600' :
                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-[10px] text-slate-400 font-black tracking-widest uppercase">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
