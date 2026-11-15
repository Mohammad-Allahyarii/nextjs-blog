export default function Divider() {
  return (
    <div className="relative my-5 flex items-center justify-center md:my-6">
      <span aria-hidden="true" className="h-px w-full bg-border" />
      <span className="absolute bg-surface px-3 text-body-sm text-muted-foreground">
        یا
      </span>
    </div>
  );
}
