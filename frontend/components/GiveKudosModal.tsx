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
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { GiMoneyStack } from "react-icons/gi";
import { useToast } from "./ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { giveKudosEntry } from "@/entry-functions/give_kudos";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { APT_DECIMALS, convertAmountFromHumanReadableToOnChain } from "@/utils/helpers";
import { Loader } from "lucide-react";

export function GiveKudosModal({
  isMyAccount,
  receiverToken,
  setTokenKey,
}: {
  isMyAccount: boolean;
  receiverToken: string;
  setTokenKey: (number: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const { account, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();

  const [amount, setAmount] = useState<string | undefined>();

  const [isAdding, setIsAdding] = useState(false);
  const giveKudos = async () => {
    if (!account?.address || !amount) {
      return;
    }

    setIsAdding(true);
    try {
      const response = await signAndSubmitTransaction(
        giveKudosEntry({
          receiverToken,
          amount: convertAmountFromHumanReadableToOnChain(Number(amount), APT_DECIMALS),
        }),
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
      setTokenKey(5454);
    } finally {
      setAmount(undefined);
      setIsAdding(false);
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isMyAccount}>
          <GiMoneyStack size={26} /> Give kudos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Give Kudos</DialogTitle>
          <DialogDescription>Give kudos (in APT) to your connectee</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Amount (APT)
            </Label>
            <Input
              id="name"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              defaultValue="0.1"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isAdding} onClick={giveKudos}>
            {isAdding ? <Loader className="animate-spin" /> : null} Give kudos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
