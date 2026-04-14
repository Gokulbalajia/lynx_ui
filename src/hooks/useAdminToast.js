import { useState, useCallback } from 'react';

export const useAdminToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

export const AdminToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-[320px] rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-sm transition-all duration-150 ${
            toast.type === 'success'
              ? 'bg-zinc-950 border-emerald-500/30 text-emerald-300'
              : toast.type === 'error'
              ? 'bg-zinc-950 border-red-500/30 text-red-300'
              : 'bg-zinc-950 border-blue-500/30 text-blue-300'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm leading-6">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-zinc-300"
              type="button"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
