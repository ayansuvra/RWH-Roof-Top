type ToastVariant = "default" | "destructive";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastOptions) => {
    const prefix = variant === "destructive" ? "[Error]" : "[Info]";
    // Minimal no-UI fallback; integrate with your UI toast system later
    console.log(prefix, title ?? "", description ?? "");
  };

  return { toast };
}

