import { Button } from "@/src/components/common/Button";
import GoogleIcon from "@/src/components/icons/google-icon";

type GoogleButtonProps = {
  onClick: () => void;
};

export default function GoogleButton({ onClick }: GoogleButtonProps) {
  return (
    <Button variant="outline" size="md" fullWidth onClick={onClick}>
      <GoogleIcon />
      ورود با حساب گوگل
    </Button>
  );
}
