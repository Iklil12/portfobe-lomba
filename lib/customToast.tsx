// lib/customToast.tsx
import toast from 'react-hot-toast';

interface ToastOptions {
  message: string;
  id: string; 
  icon?: string; 
  type?: 'success' | 'error' | 'loading' | 'warning' | 'info';
}

export const showToast = ({ message, id, icon, type = 'info' }: ToastOptions) => {
  const options = { id, icon };
  
  if (type === 'success') {
    return toast.success(message, options);
  } else if (type === 'error') {
    return toast.error(message, options);
  } else if (type === 'loading') {
    return toast.loading(message, options);
  } else {
    // Custom handling for warning/info using the base toast
    return toast(message, {
      ...options,
      // We can pass the type via className or a custom property, but react-hot-toast 
      // doesn't have a built-in 'warning' type. We'll rely on the Toaster wrapper in layout.tsx
      // to read the icon or provide a default style.
      className: type, 
    });
  }
};