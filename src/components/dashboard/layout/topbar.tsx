import Avatar from "@/src/components/ui/avatar";
import Badge from "@/src/components/ui/badge";
import IconButton from "./icon-button";

type TopbarProps = {
  userName: string;
  userImage: string | null;
};

export default function Topbar({ userName, userImage }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 hidden h-16 items-center justify-between gap-4 border-b border-border bg-surface/80 px-gutter backdrop-blur-xl lg:flex">
      <Badge variant="neutral">پیش‌نویس خودکار فعال است</Badge>
      <div className="flex items-center gap-2">
        <IconButton icon="notifications" label="اعلان‌ها" />
        <IconButton icon="search" label="جستجو" />
        <Avatar name={userName} src={userImage} size="sm" />
      </div>
    </header>
  );
}
