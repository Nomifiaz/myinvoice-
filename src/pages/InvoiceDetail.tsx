import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoiceService } from '../services/api';
import { 
  FileText, 
  ChevronLeft, 
  Printer, 
  Download, 
  Building2, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await invoiceService.getInvoiceById(id!);
        if (res.data.success) {
          setInvoice(res.data.invoices[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Standard trick to trigger print which allows "Save as PDF"
    window.print();
  };

  if (loading) return <div className="h-64 flex items-center justify-center font-bold text-slate-400 animate-pulse">Loading Invoice Details...</div>;
  if (!invoice) return <div className="h-64 flex items-center justify-center font-bold text-slate-400">Invoice not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <style>
        {`
          @media print {
            body { 
              background: white !important; 
              padding: 0 !important;
              margin: 0 !important;
            }
            .no-print { display: none !important; }
            .print-container { 
              box-shadow: none !important; 
              border: none !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            aside, header { display: none !important; }
            main { padding: 0 !important; margin: 0 !important; }
            .bg-slate-50 { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; }
            .bg-indigo-600 { background-color: #4f46e5 !important; -webkit-print-color-adjust: exact; }
            .bg-indigo-500 { background-color: #6366f1 !important; -webkit-print-color-adjust: exact; }
            .text-white { color: white !important; -webkit-print-color-adjust: exact; }
          }
        `}
      </style>

      <div className="flex items-center justify-between no-print">
        <button 
          onClick={() => navigate('/invoices')}
          className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to List
        </button>
        <div className="flex items-center space-x-3">
          <button 
             onClick={handlePrint}
             className="inline-flex items-center px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </button>
          <button 
             onClick={handleDownload}
             className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 print-container"
      >
        {/* Status Banner */}
        <div className={cn(
          "px-8 py-4 flex items-center justify-between text-white no-print",
          invoice.status === 'APPROVED' ? "bg-emerald-500" :
          invoice.status === 'PENDING' ? "bg-amber-500" :
          "bg-indigo-500"
        )}>
          <div className="flex items-center font-bold">
            {invoice.status === 'APPROVED' ? <CheckCircle2 className="w-5 h-5 mr-2" /> :
             invoice.status === 'PENDING' ? <Clock className="w-5 h-5 mr-2" /> :
             <AlertCircle className="w-5 h-5 mr-2" />}
            Status: {invoice.status}
          </div>
          <div className="text-xs font-mono font-bold uppercase tracking-widest opacity-80">
            FBR Verification ID: {invoice.fbrInvoiceNo || 'Pending'}
          </div>
        </div>

        {/* Invoice Page */}
        <div className="p-12 space-y-12 bg-white print:p-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{invoice.sellerBusinessName}</h2>
              </div>
              <div className="text-slate-500 text-sm font-medium space-y-1">
                <p>{invoice.sellerAddress}</p>
                <p>{invoice.sellerProvince}</p>
                <p className="font-bold text-slate-800">NTN: {invoice.sellerNTNCNIC}</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-5xl font-black text-slate-200 mb-6 uppercase tracking-tighter">Invoice</h1>
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Invoice Reference</p>
                <p className="text-xl font-mono font-bold text-indigo-600">{invoice.invoiceRefNo?.slice(0, 12)}</p>
                <div className="pt-4 space-y-1">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date Issued</p>
                   <p className="text-sm font-bold text-slate-800">{new Date(invoice.invoiceDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-12 border-t border-slate-100">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bill To:</h4>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900">{invoice.buyerBusinessName}</p>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{invoice.buyerAddress}</p>
                <p className="text-sm text-slate-500 font-medium">{invoice.buyerProvince} • {invoice.buyerRegistrationType}</p>
                {invoice.buyerNTNCNIC && <p className="text-sm font-bold text-slate-800 pt-2">NTN/CNIC: {invoice.buyerNTNCNIC}</p>}
              </div>
            </div>
            <div className="space-y-4">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance Data:</h4>
               <div className="bg-slate-50 p-4 rounded-2xl flex items-center">
                 {invoice.qrCode ? (
                   <div className="w-24 h-24 bg-white border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-mono text-center px-1">
                     QR CODE IMAGE PLACEHOLDER
                   </div>
                 ) : (
                   <div className="w-full flex items-center">
                     <ShieldCheck className="w-10 h-10 text-indigo-200 mr-4" />
                     <div>
                       <p className="text-sm font-bold text-slate-700">POS Verification</p>
                       <p className="text-xs text-slate-500 font-medium">Synced with FBR servers on {new Date(invoice.createdAt).toLocaleDateString()}</p>
                     </div>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">S.No</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Item Description</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">HS Code</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Qty</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Rate</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Value (Excl)</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Tax (ST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoice.items?.map((item, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 text-sm font-bold text-slate-400">{i + 1}</td>
                    <td className="px-6 py-4 border-l border-slate-50">
                      <p className="text-sm font-bold text-slate-800">{item.productDescription}</p>
                      <p className="text-xs text-slate-400 font-medium">Unit: {item.uoM || item.UoM}</p>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-mono text-slate-500">{item.hsCode || item.ItemCode}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-800">{item.quantity}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-800">{item.rate}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-800">{item.valueSalesExcludingST?.toLocaleString() || item.TotalValues?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-sm font-black text-indigo-600">{item.salesTaxApplicable?.toLocaleString() || item.TaxCharged?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-8">
            <div className="w-80 space-y-3">
              <div className="flex justify-between items-center text-slate-500 font-bold px-4">
                <span className="text-xs uppercase tracking-widest">Exclusive Value</span>
                <span>PKR {(invoice.totalAmount - invoice.taxAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-bold px-4">
                <span className="text-xs uppercase tracking-widest">Sales Tax ({(invoice.taxAmount / (invoice.totalAmount - invoice.taxAmount) * 100).toFixed(0)}%)</span>
                <span>PKR {invoice.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-indigo-600 text-white rounded-2xl p-6 shadow-xl shadow-indigo-100">
                <span className="font-extrabold text-indigo-100">Grand Total</span>
                <span className="text-3xl font-black">PKR {invoice.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="pt-12 mt-12 border-t border-dashed border-slate-200">
            <p className="text-[10px] text-slate-400 text-center font-medium uppercase tracking-[0.2em]">
              This is a computer generated document and does not require a physical signature. Verified by FBR Integrated POS System.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
