import React, { useEffect, useState } from 'react';
import { invoiceService } from '../services/api';
import { 
  FileText, 
  Search, 
  PlusCircle, 
  Filter, 
  Download,
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await invoiceService.getInvoices();
        setInvoices(res.data.invoices || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.buyerBusinessName.toLowerCase().includes(search.toLowerCase()) || 
    inv.invoiceRefNo?.includes(search)
  ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Invoices</h1>
          <p className="text-slate-500 font-medium">History of all transactions and compliance status</p>
        </div>
        <Link 
          to="/invoices/new" 
          className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Invoice
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by buyer name or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
          />
        </div>
        <button className="inline-flex items-center px-5 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors">
          <Filter className="w-5 h-5 mr-2" />
          More Filters
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Ref & Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Buyer Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Amount Info</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">FBR Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                    </tr>
                  ))
                ) : filteredInvoices.map((inv) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={inv.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900 mb-0.5">#{inv.invoiceRefNo?.slice(-8) || inv.id}</div>
                      <div className="flex items-center text-xs text-slate-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(inv.invoiceDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-800">{inv.buyerBusinessName}</div>
                      <div className="text-xs text-slate-500">{inv.buyerProvince} • {inv.buyerRegistrationType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">PKR {inv.totalAmount?.toLocaleString()}</div>
                      <div className="text-xs text-indigo-500 font-medium">Incl. Tax: {inv.taxAmount?.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold",
                        inv.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700" :
                        inv.status === 'PENDING' ? "bg-amber-50 text-amber-700" :
                        inv.status === 'FAILED' ? "bg-rose-50 text-rose-700" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {inv.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {inv.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                        {inv.status === 'FAILED' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          to={`/invoices/${inv.id}`}
                          className="p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 rounded-xl transition-all"
                          title="View Detail"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button className="p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 rounded-xl transition-all">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {!loading && filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-slate-200 mb-3" />
                        <p className="text-slate-400 font-medium">No invoices found matching your search</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
