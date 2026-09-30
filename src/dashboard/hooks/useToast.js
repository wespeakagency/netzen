import { useCallback, useEffect, useRef, useState } from "react";

let nextToastId = 1;

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timeoutId = timersRef.current.get(id);
    if (timeoutId) clearTimeout(timeoutId);
    timersRef.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast) => {
    const id = nextToastId++;
    const timeoutId = setTimeout(() => {
      timersRef.current.delete(id);
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3000);

    timersRef.current.set(id, timeoutId);
    setToasts((current) => [...current, { id, type: "success", ...toast }]);
    return id;
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timeoutId) => clearTimeout(timeoutId));
      timers.clear();
    };
  }, []);

  return { toasts, showToast, dismissToast };
}
