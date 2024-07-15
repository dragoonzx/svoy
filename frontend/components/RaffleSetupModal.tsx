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
import { GiCardRandom } from "react-icons/gi";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { setRaffleEntry } from "@/entry-functions/set_raffle";
import { aptosClient } from "@/utils/aptosClient";
import { Loader } from "lucide-react";
import { DateTimeInput } from "./ui/date-time-input";

export function RaffleSetupModal({
  ownTokenAddr,
  setKey,
  kudos,
}: {
  ownTokenAddr: string;
  setKey: (n: number) => void;
  kudos: any;
}) {
  const { account, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const [description, setDescription] = useState("Subscribe to my X profile: ...");
  const [date, setDate] = useState<Date | undefined>();

  const [isAdding, setIsAdding] = useState(false);
  const setupRaffle = async () => {
    if (!account?.address || !date) {
      return;
    }

    setIsAdding(true);
    try {
      const response = await signAndSubmitTransaction(
        setRaffleEntry({ tokenAddr: ownTokenAddr!, description, end_timestamp: date.getTime() * 1000 }),
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
      setKey(466);
    } finally {
      setIsAdding(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!kudos?.coins?.value || Number(kudos?.coins?.value) === 0}>
          <GiCardRandom size={26} /> Raffle setup
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Raffle Kudos Setup</DialogTitle>
          <DialogDescription>Raffle earned Kudos to your network</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              defaultValue="Subscribe to my X profile: ..."
              className="col-span-3"
            />
          </div>
          <div className="">
            {/* <Label htmlFor="description" className="text-right">
              End date
            </Label> */}
            <DateTimeInput
              tooltip="Raffle end date"
              label="End date"
              id="end_date"
              onDateChange={setDate}
              date={date}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isAdding} onClick={setupRaffle}>
            {isAdding ? <Loader className="animate-spin" /> : null} Setup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
