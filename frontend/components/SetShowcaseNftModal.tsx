import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GiTotemMask } from "react-icons/gi";

export function SetShowcaseNftModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <GiTotemMask size={26} /> Set showcase NFT
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Showcase NFT</DialogTitle>
          <DialogDescription>Choose NFT that will be showed on your card</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between py-4"></div>
      </DialogContent>
    </Dialog>
  );
}
