import React from "react";
import { createPortal } from "react-dom";
import { VustIcon } from "../VustIcon/VustIcon";
import "./VustToast.css";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export interface VustToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 通知列表 */
  toasts: ToastItem[];
  /** 关闭事件 */
  onClose?: (id: string) => void;
  /** 关闭按钮的无障碍标签 */
  closeLabel?: string;
}

export const VustToast: React.FC<VustToastProps> = ({
  toasts = [],
  onClose,
  closeLabel = "Close notification",
  className = "",
  ...rest
}) => {
  const getToastIconName = (type: ToastItem["type"]) => {
    if (type === "success") return "success";
    if (type === "error") return "error";
    if (type === "warning") return "warning";
    return "info";
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`vl-toast-container ${className}`.trim()}
      aria-live="polite"
      aria-relevant="additions"
      {...rest}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`vl-toast-item is-${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
        >
          <div className="vl-toast-icon">
            <VustIcon name={getToastIconName(toast.type)} size={20} />
          </div>
          <div className="vl-toast-content">
            <h4 className="vl-toast-title">{toast.title}</h4>
            <p className="vl-toast-message">{toast.message}</p>
          </div>
          <button
            type="button"
            className="vl-toast-close"
            aria-label={closeLabel}
            onClick={() => onClose?.(toast.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>,
    document.body,
  );
};
