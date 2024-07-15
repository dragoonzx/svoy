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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mintSvoyProfileNFT } from "@/entry-functions/mint_nft";
import { aptosClient } from "@/utils/aptosClient";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

export function MintModal({ setTokenKey }: { setTokenKey: (i: number) => void }) {
  const [open, setOpen] = useState(false);
  const { account, signAndSubmitTransaction } = useWallet();

  const [name, setName] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);

  const [isMinting, setIsMinting] = useState(false);

  const { toast } = useToast();

  const mintSvoyProfile = async () => {
    try {
      setIsMinting(true);
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(
        mintSvoyProfileNFT({
          userAddr: account?.address,
          name: name ?? "Anon",
          description: description ?? "No info",
          uri: `https://svoy-eta.vercel.app/app/card/${account?.address}`,
        }),
      );
      // wait for transaction
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
      await aptosClient().waitForTransaction({ transactionHash: response.hash });

      setName(undefined);
      setDescription(undefined);
      setTokenKey(52);
      setOpen(false);
    } catch (error: unknown) {
      console.log("Error:", error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create profile</DialogTitle>
          <DialogDescription>Mint Svoy token to join the club</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              defaultValue="Expert in Move"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isMinting} onClick={mintSvoyProfile}>
            {isMinting ? <Loader className="animate-spin" /> : null} Mint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
