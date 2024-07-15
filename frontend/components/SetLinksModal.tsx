import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GiLinkedRings } from "react-icons/gi";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { setSocialConnectionEntry } from "@/entry-functions/set_social_link";
import { useState } from "react";
import { aptosClient } from "@/utils/aptosClient";
import { Loader } from "lucide-react";

export function SetLinksModal({ ownTokenAddr, setKey }: { ownTokenAddr: string; setKey: any }) {
  const { account, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [href, setHref] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const setLinks = async () => {
    if (!account?.address) {
      return;
    }

    setIsAdding(true);
    try {
      const response = await signAndSubmitTransaction(
        setSocialConnectionEntry({ tokenAddr: ownTokenAddr!, title, href }),
      );
      await aptosClient().waitForTransaction({ transactionHash: response.hash });
      toast({
        title: "Success",
        description: (
          <div>
            Success! View your transaction at{" "}
            <a href={`https://explorer.aptoslabs.com/txn/${response.hash}`} target="_blank">
              explorer
            </a>
          </div>
        ),
      });
      setKey(45);
    } finally {
      setIsAdding(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <GiLinkedRings size={26} /> Set links
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Social Links </DialogTitle>
          <DialogDescription>
            {" "}
            <span className="font mono text-sm text-muted-foreground">[Only one available for beta]</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              defaultValue="X profile"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Link
            </Label>
            <Input
              id="description"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              defaultValue="https://x.com/..."
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isAdding} onClick={setLinks}>
            {isAdding ? <Loader className="animate-spin" /> : null} Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
