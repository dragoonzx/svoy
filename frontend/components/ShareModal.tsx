import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { CopyIcon } from "lucide-react";
import { QRCode } from "react-qrcode-logo";
import { useToast } from "./ui/use-toast";

const getShareLink = (address?: string) => {
  if (!address) {
    return `${window.location.origin}/app?`;
  }
  return `${window.location.origin}/app?connection=${address}`;
};

export function ShareModal({ tokenAddr }: { tokenAddr: string }) {
  const { toast } = useToast();

  const copyShareLink = async () => {
    const shareLink = getShareLink(tokenAddr);
    await navigator.clipboard.writeText(shareLink);
    toast({
      variant: "default",
      title: "Success!",
      description: "Succesfully copied link!",
    });
  };

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
          <QRCode value={getShareLink(tokenAddr)} qrStyle="dots" style={{ borderRadius: "12px" }} />
          <div data-orientation="vertical" role="none" className="shrink-0 bg-chetoblack ml-8 h-full w-[1px]"></div>
          <div className="w-full flex justify-center">
            <Button onClick={copyShareLink}>
              <CopyIcon /> Copy link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
