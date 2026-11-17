import type { ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
};

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="w-full max-w-auth rounded-card border border-border bg-surface p-card shadow-card md:p-featured">
      {children}
    </div>
  );
}
