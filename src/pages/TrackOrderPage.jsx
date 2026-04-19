import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Truck, MapPin, CheckCircle2, Clock, Loader2, ArrowRight, Package } from 'lucide-react';

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await axios.get(`/shipments/${orderId.trim()}`);
      setTrackingData(response.data);
    } catch (err) {
      console.error('Tracking error:', err);
      setError(
        err.response?.status === 404
          ? 'Order ID not found. Please check and try again.'
          : 'Unable to fetch tracking details. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentStep = steps.indexOf(status);
    return currentStep === -1 ? 0 : currentStep;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header Section */}
      <div className="bg-zinc-900/50 border-b border-zinc-800 pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-6">Track Your Package</h1>
            <p className="text-zinc-400 text-lg mb-8">
              Stay updated on your Lynx Pet Shop delivery. Enter your Order ID below to see the latest status.
            </p>

            <form onSubmit={handleTrack} className="relative max-w-xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. 550e8400-e29b...)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-5 pl-14 pr-32 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white font-medium"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-full font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Track'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12">
        <div className="max-w-4xl mx-auto">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 text-center animate-in fade-in slide-in-from-top-4 duration-300">
              <p className="text-red-200 font-medium">{error}</p>
            </div>
          )}

          {/* Result Section */}
          {trackingData && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Status Header */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Status</p>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    {trackingData.shipment_status === 'Delivered' ? (
                      <CheckCircle2 className="text-green-500" size={32} />
                    ) : (
                      <Truck className="text-blue-500 animate-pulse" size={32} />
                    )}
                    {trackingData.shipment_status}
                  </h2>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Tracking ID</p>
                  <p className="text-lg font-mono text-zinc-300">{trackingData.tracking_id || 'Not assigned'}</p>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-10 flex items-center gap-2">
                  <Clock size={20} className="text-blue-500" />
                  Delivery Timeline
                </h3>

                <div className="relative">
                  {/* Progress Line Background */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-800 hidden md:block" />
                  
                  <div className="space-y-12 relative">
                    {/* Steps */}
                    {[
                      { label: 'Processing', icon: Package, date: trackingData.shipped_at ? 'Completed' : 'Pending' },
                      { label: 'Shipped', icon: Truck, date: trackingData.shipped_at ? new Date(trackingData.shipped_at).toLocaleDateString() : 'Waiting for handover' },
                      { label: 'Out for Delivery', icon: MapPin, date: trackingData.shipment_status === 'Out for Delivery' || trackingData.shipment_status === 'Delivered' ? 'Today' : 'Upcoming' },
                      { label: 'Delivered', icon: CheckCircle2, date: trackingData.delivered_at ? new Date(trackingData.delivered_at).toLocaleDateString() : 'Estimated soon' }
                    ].map((step, idx) => {
                      const isCompleted = getStatusStep(trackingData.shipment_status) >= idx;
                      const isCurrent = getStatusStep(trackingData.shipment_status) === idx;

                      return (
                        <div key={idx} className="flex gap-6 items-start">
                          <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${
                            isCompleted ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-600'
                          } ${isCurrent ? 'ring-4 ring-blue-500/30 scale-110' : ''}`}>
                            <step.icon size={24} />
                          </div>
                          <div className="flex-1 pt-1">
                            <h4 className={`font-bold text-lg ${isCompleted ? 'text-white' : 'text-zinc-600'}`}>
                              {step.label}
                            </h4>
                            <p className="text-zinc-500 text-sm mt-1">{step.date}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Support CTA */}
              <div className="bg-blue-600 rounded-3xl p-8 text-center sm:text-left sm:flex items-center justify-between gap-6">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Need help with your delivery?</h4>
                  <p className="text-blue-100 italic">"Our support huskies are here to guide you."</p>
                </div>
                <Link to="/help" className="mt-6 sm:mt-0 inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-zinc-100 transition-all">
                  Contact Support
                </Link>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!trackingData && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-900 border border-zinc-800 border-dashed rounded-3xl">
              <Package size={64} className="text-zinc-800 mb-6" />
              <p className="text-zinc-500 font-medium">No order details to display yet</p>
              <p className="text-zinc-600 text-sm mt-2 text-center max-w-sm px-6">
                Your Order ID can be found in your order confirmation email.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-6 mt-12 text-center">
        <Link to="/" className="text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2">
           Back to home
        </Link>
      </div>
    </div>
  );
};

export default TrackOrderPage;
