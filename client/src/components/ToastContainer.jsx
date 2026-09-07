import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectToasts, removeToast } from "../features/ui/uiSlice";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export default function ToastContainer() {
  const dispatch = useDispatch();
  const toasts = useSelector(selectToasts);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-black shrink-0 stroke-[2.5]" />,
    error: <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 stroke-[2.5]" />,
    warning: <AlertTriangle className="w-5 h-5 text-black shrink-0 stroke-[2.5]" />,
    info: <Info className="w-5 h-5 text-black shrink-0 stroke-[2.5]" />,
  };

  const bgStyles = {
    success: "bg-[#86EFAC] border-2 border-black text-black shadow-[4px_4px_0px_#000]",
    error: "bg-rose-100 border-2 border-rose-600 text-rose-900 shadow-[4px_4px_0px_#000]",
    warning: "bg-[#FFE27C] border-2 border-black text-black shadow-[4px_4px_0px_#000]",
    info: "bg-[#6CC5F5] border-2 border-black text-black shadow-[4px_4px_0px_#000]",
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl transition-all duration-300 transform translate-y-0 ${
        bgStyles[toast.type] || bgStyles.info
      }`}
    >
      {icons[toast.type] || icons.info}
      <div className="flex-1 text-xs font-black leading-relaxed pr-2">
        {toast.message}
      </div>
      <button
        onClick={onClose}
        className="text-black hover:opacity-70 p-1 rounded-lg transition-opacity"
      >
        <X className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
}
