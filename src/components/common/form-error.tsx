import type { ReactNode } from "react";
import AlertIcon from "@/src/components/icons/alert-icon";

type FormErrorProps = {
  id?: string;
  children: ReactNode;
};

export default function FormError({ id, children }: FormErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1 flex items-center gap-1 text-body-sm font-medium text-danger"
    >
      <AlertIcon className="size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
