import Link from "next/link";

type StatusPageProps = {
  code: string;
  title: string;
  description: string;
  action: { href: string; label: string };
};

export default function StatusPage({
  code,
  title,
  description,
  action,
}: StatusPageProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <p className="text-label text-muted-foreground">{code}</p>
      <h1 className="text-headline-sm text-foreground">{title}</h1>
      <p className="max-w-prose text-body-md text-muted-foreground">
        {description}
      </p>
      <Link
        href={action.href}
        className="motion-fast focus-ring rounded-control bg-primary px-4 py-2 text-label text-on-primary hover:bg-primary-hover"
      >
        {action.label}
      </Link>
    </main>
  );
}
