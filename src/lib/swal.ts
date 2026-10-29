import Swal from "sweetalert2";

/* SweetAlert2 Toast configuration matching admin1 */
export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  background: "#1e2433",
  color: "#e2e8f0",
  iconColor: "#4ade80",
  customClass: {
    popup: "swal-toast-popup",
    title: "swal-toast-title",
  },
});

export const showToast = (icon: "success" | "error" | "info" | "warning", title: string) => {
  Toast.fire({
    icon,
    title,
    iconColor:
      icon === "success"
        ? "#4ade80"
        : icon === "error"
        ? "#f87171"
        : icon === "warning"
        ? "#facc15"
        : "#60a5fa",
  });
};

export const showSuccess = (message: string) => {
  Toast.fire({ icon: "success", title: message, iconColor: "#4ade80" });
};

export const showError = (message: string) => {
  Toast.fire({ icon: "error", title: message, iconColor: "#f87171" });
};

export const showWarning = (message: string) => {
  Toast.fire({ icon: "warning", title: message, iconColor: "#facc15" });
};

export const showInfo = (message: string) => {
  Toast.fire({ icon: "info", title: message, iconColor: "#60a5fa" });
};

/** Drop-in toast API backed by SweetAlert2 */
export const toast = {
  success: (title: string) => showSuccess(title),
  error: (title: string) => showError(title),
  warning: (title: string) => showWarning(title),
  info: (title: string) => showInfo(title),
};

export const showConfirm = async ({
  title,
  html,
  text,
  icon = "warning",
  confirmButtonText = "Yes, Continue",
  cancelButtonText = "Cancel",
  confirmButtonColor = "#dc2626",
  cancelButtonColor = "#374151",
}: {
  title: string;
  html?: string;
  text?: string;
  icon?: "warning" | "error" | "info" | "question";
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}) => {
  return await Swal.fire({
    title,
    html: html ?? (text ? `<p style="color:#e2e8f0;font-size:0.9rem;">${text}</p>` : undefined),
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    background: "#1e2433",
    color: "#e2e8f0",
    confirmButtonColor,
    cancelButtonColor,
  });
};

export { Swal };
export default Swal;
