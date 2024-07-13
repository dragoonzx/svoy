import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CopyIcon } from "lucide-react";
import { GiMoneyStack } from "react-icons/gi";
import { QRCode } from "react-qrcode-logo";

export function GiveKudosModal({ isMyAccount }: { isMyAccount: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isMyAccount}>
          <GiMoneyStack size={26} /> Give kudos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Give Kudos</DialogTitle>
          <DialogDescription>Give aptos to your connectee</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between py-4">
          <QRCode value="https://github.com/gcoro/react-qrcode-logo" qrStyle="dots" style={{ borderRadius: "12px" }} />
          <div data-orientation="vertical" role="none" className="shrink-0 bg-chetoblack ml-8 h-full w-[1px]"></div>
          <div className="w-full flex justify-center">
            <Button>
              <CopyIcon /> Copy link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
