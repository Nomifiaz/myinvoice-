import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, invoiceService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  UserCircle, 
  MapPin, 
  Calendar as CalendarIcon,
  Trash2,
  Plus,
  ArrowRight,
  Loader2,
  Package,
  Calculator,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function NewInvoice() {
  const { business } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    businessId: business?.id,
    invoiceDate: new Date().toISOString().split('T')[0],
    buyer: {
      buyerNTNCNIC: '',
      buyerBusinessName: '',
      buyerProvince: 'Punjab',
      buyerAddress: '',
      buyerRegistrationType: 'Unregistered'
    },
    items: [
      { productId: '', quantity: 1, price: 0 }
    ]
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await productService.getProducts();
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await invoiceService.createInvoice(formData);
      navigate('/invoices');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center font-bold text-slate-400">Initializing Invoice Engine...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-slate-800 font-bold transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-extrabold text-slate-800">New Sale Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Buyer Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center">
            <UserCircle className="w-6 h-6 text-indigo-600 mr-2" />
            <h2 className="font-bold text-slate-800">Buyer Information</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Buyer Business Name</label>
              <input
                type="text"
                required
                value={formData.buyer.buyerBusinessName}
                onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, buyerBusinessName: e.target.value }})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="Enter customer name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Buyer NTN / CNIC (Optional)</label>
              <input
                type="text"
                value={formData.buyer.buyerNTNCNIC}
                onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, buyerNTNCNIC: e.target.value }})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4"
                placeholder="e.g. 1234567-8"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Registration Type</label>
              <select
                value={formData.buyer.buyerRegistrationType}
                onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, buyerRegistrationType: e.target.value }})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 appearance-none"
              >
                <option value="Unregistered">Unregistered</option>
                <option value="Registered">Registered</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Province</label>
              <select
                value={formData.buyer.buyerProvince}
                onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, buyerProvince: e.target.value }})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 appearance-none"
              >
                {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Invoice Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  required
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Buyer Address</label>
              <textarea
                value={formData.buyer.buyerAddress}
                onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, buyerAddress: e.target.value }})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 min-h-[80px]"
                placeholder="Shipping/Billing address..."
              />
            </div>
          </div>
        </motion.div>

        {/* Step 2: Line Items */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center">
              <Package className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="font-bold text-slate-800">Invoice Items</h2>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest px-4">
              <div className="col-span-6 text-left">Product / Service</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-3 text-right">Unit Price</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {formData.items.map((item, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    key={idx} 
                    className="grid grid-cols-12 gap-4 items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group"
                  >
                    <div className="col-span-12 md:col-span-6">
                      <select
                        required
                        value={item.productId}
                        onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium"
                      >
                        <option value="">Select a product</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.itemName} ({p.hsCode})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-6 md:col-span-2">
                       <input
                        type="number"
                        required
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-center"
                        placeholder="Qty"
                      />
                    </div>
                    <div className="col-span-6 md:col-span-3">
                       <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">PKR</span>
                        <input
                          type="number"
                          required
                          value={item.price}
                          onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-right"
                          placeholder="0.00"
                        />
                       </div>
                    </div>
                    <div className="col-span-12 md:col-span-1 flex justify-end">
                      <button 
                        type="button"
                        onClick={() => removeItem(idx)}
                        disabled={formData.items.length === 1}
                        className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors disabled:opacity-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Total Calculation */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8 border-t border-slate-50">
              <div className="flex-1 max-w-sm">
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start">
                  <Calculator className="w-5 h-5 text-amber-600 mr-3 shrink-0" />
                  <p className="text-xs font-medium text-amber-800 leading-relaxed">
                    Note: Taxes (ST/FED) will be calculated automatically based on product HS codes and registration status.
                  </p>
                </div>
              </div>

              <div className="w-full md:w-80 space-y-3">
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span>PKR {calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-indigo-600 font-bold text-xl pt-3 border-t border-slate-100">
                  <span>Estimated Total</span>
                  <span>PKR {calculateSubtotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-10 py-4 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center group"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Finalize & Submit to FBR
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
