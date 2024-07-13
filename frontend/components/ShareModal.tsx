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
import { QRCode } from "react-qrcode-logo";

export function ShareModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Connections /// Share profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>Share your profile with others</DialogDescription>
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
