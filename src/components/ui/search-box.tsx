import Input, { type InputProps } from "@/src/components/common/input";
import SearchIcon from "@/src/components/icons/search-icon";

export type SearchBoxProps = Omit<
  InputProps,
  "type" | "startAdornment" | "endAdornment"
> & {
  label: string;
};

export default function SearchBox({ label, ...props }: SearchBoxProps) {
  return (
    <Input
      type="search"
      label={label}
      startAdornment={<SearchIcon className="size-5" />}
      {...props}
    />
  );
}
