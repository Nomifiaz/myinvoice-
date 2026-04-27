import React, { useEffect, useState } from 'react';
import { productService } from '../services/api';
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical,
  Loader2,
  X,
  PlusCircle,
  TrendingUp,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  
  const [newProduct, setNewProduct] = useState({
    itemName: '',
    hsCode: '',
    taxRate: 18,
    uom: 'Numbers'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await productService.getProducts();
      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await productService.addProduct(newProduct);
      setShowModal(false);
      setNewProduct({ itemName: '', hsCode: '', taxRate: 18, uom: 'Numbers' });
      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.itemName.toLowerCase().includes(search.toLowerCase()) || 
    p.hsCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Products</h1>
          <p className="text-slate-500 font-medium">Manage your inventory and tax rates</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Product
        </button>
      </div>

      {/* Tools Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by name or HS code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
          />
        </div>
        <button className="inline-flex items-center px-5 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors">
          <Filter className="w-5 h-5 mr-2" />
          Filter
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 animate-pulse h-48" />
            ))
          ) : filteredProducts.map((p, idx) => (
            <motion.div
              layout
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Package className="w-6 h-6" />
                </div>
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="font-bold text-slate-800 text-lg mb-1">{p.itemName}</h3>
              <div className="flex items-center text-slate-400 text-sm font-medium mb-4">
                <Tag className="w-3.5 h-3.5 mr-1" />
                {p.hsCode}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tax Rate</p>
                  <p className="font-bold text-indigo-600">{p.taxRate}%</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unit</p>
                  <p className="font-bold text-slate-800">{p.uom}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Add New Product</h2>
                <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.itemName}
                    onChange={(e) => setNewProduct({ ...newProduct, itemName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    placeholder="e.g. Mechanical Part X"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">HS Code / PCT Code</label>
                    <input
                      type="text"
                      required
                      value={newProduct.hsCode}
                      onChange={(e) => setNewProduct({ ...newProduct, hsCode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                      placeholder="0000.0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">UOM (Unit)</label>
                    <input
                      type="text"
                      required
                      value={newProduct.uom}
                      onChange={(e) => setNewProduct({ ...newProduct, uom: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                      placeholder="Numbers / PCS"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Sales Tax Rate (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      value={newProduct.taxRate}
                      onChange={(e) => setNewProduct({ ...newProduct, taxRate: parseFloat(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-4 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
