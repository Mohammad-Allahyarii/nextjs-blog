"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/src/components/common/Button";
import CloseIcon from "@/src/components/icons/close-icon";
import { cn } from "@/src/lib/utils/ui.utils";

export type ToastVariant = "success" | "danger" | "info";

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastRecord = ToastInput & { id: number };

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 5000;

const variantStyles: Record<ToastVariant, string> = {
  success: "border-success/40",
  danger: "border-danger/40",
  info: "border-primary/40",
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastRecord;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(item.id), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [item.id, onDismiss]);

  const variant = item.variant ?? "info";

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border bg-surface p-3 shadow-card-hover",
        variantStyles[variant],
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-start">
        <p className="text-body-sm font-medium text-foreground">{item.title}</p>
        {item.description ? (
          <p className="text-body-sm text-muted-foreground">
            {item.description}
          </p>
        ) : null}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="بستن اعلان"
        onClick={() => onDismiss(item.id)}
      >
        <CloseIcon className="size-4" />
      </Button>
    </div>
  );
}

export function ToastProvider({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [items, setItems] = useState<ToastRecord[]>([]);
  const nextIdRef = useRef(1);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = nextIdRef.current;
    nextIdRef.current += 1;
    setItems((current) => [...current, { ...input, id }]);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4",
          className,
        )}
      >
        {items.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
