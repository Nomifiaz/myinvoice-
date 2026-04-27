import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { invoiceService, productService } from '../services/api';
import { 
  TrendingUp, 
  Package, 
  FileText, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  PlusCircle,
  Clock,
  Building2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { business } = useAuth();
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingInvoices: 0
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [invRes, prodRes] = await Promise.all([
          invoiceService.getInvoices(),
          productService.getProducts()
        ]);

        if (invRes.data.success) {
          const invoices = invRes.data.invoices || [];
          setRecentInvoices(invoices.slice(0, 5));
          setStats({
            totalInvoices: invoices.length,
            totalProducts: prodRes.data.products?.length || 0,
            totalRevenue: invoices.reduce((acc: number, inv: any) => acc + (inv.totalAmount || 0), 0),
            pendingInvoices: invoices.filter((inv: any) => inv.status === 'PENDING').length
          });
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const statCards = [
    { name: 'Total Revenue', value: `PKR ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%', trendUp: true },
    { name: 'Active Products', value: stats.totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+4', trendUp: true },
    { name: 'Total Invoices', value: stats.totalInvoices, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+18%', trendUp: true },
    { name: 'Pending Status', value: stats.pendingInvoices, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-2', trendUp: false },
  ];

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-32 bg-slate-200 rounded-3xl" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl" />)}
    </div>
  </div>;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 font-medium">Monitoring {business?.name} performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link 
            to="/invoices/new" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-xs font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-400 mb-1">{stat.name}</p>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Invoices */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Recent Invoices</h3>
            <Link to="/invoices" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Ref No</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Buyer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentInvoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">#{inv.invoiceRefNo?.slice(-8) || inv.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{inv.buyerBusinessName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">PKR {inv.totalAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold",
                        inv.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700" :
                        inv.status === 'PENDING' ? "bg-amber-50 text-amber-700" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                  </tr>
                ))}
                {recentInvoices.length === 0 && (
                   <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No invoices found</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Business Summary Card */}
        <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Business Profile</h3>
            <p className="text-indigo-100 mb-8 opacity-80 font-medium">Compliance Information</p>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Company NTN</p>
                <p className="text-lg font-mono font-bold tracking-tight">{business?.ntn}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Location</p>
                <p className="text-lg font-bold tracking-tight">{business?.province}</p>
              </div>
              <div className="pt-4 border-t border-indigo-500/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-100">FBR Integration</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Active</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white w-[100%] h-full" />
                </div>
              </div>
            </div>
          </div>
          
          <Building2 className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5" />
        </div>
      </div>
    </div>
  );
}
