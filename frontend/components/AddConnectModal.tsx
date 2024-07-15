import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SVOY_V0_COLLECTION_ADDRESS } from "@/constants";
import { useGetCollectionData } from "@/hooks/useGetCollectionData";
import { SvoyCardShort } from "./SvoyCardShort";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useToast } from "./ui/use-toast";
import { addConnectionEntry } from "@/entry-functions/add_connection";
import { aptosClient } from "@/utils/aptosClient";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { getSvoyToken } from "@/view-functions/getSvoyToken";

export function AddConnectModal({
  ownTokenAddr,
  connectionTokenAddr,
  open,
  setOpen,
  setTokenKey,
}: {
  ownTokenAddr: string | undefined;
  connectionTokenAddr: string;
  open: boolean;
  setOpen: any;
  setTokenKey: any;
}) {
  const [svToken, setSvToken] = useState<any>(null);
  useEffect(() => {
    const getSvToken = async () => {
      const svToken = await getSvoyToken(connectionTokenAddr);
      setSvToken(svToken);
    };
    if (connectionTokenAddr) {
      getSvToken();
    }
  }, [connectionTokenAddr]);

  const { account, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const addConnection = async () => {
    if (!account?.address) {
      return;
    }

    setIsAdding(true);
    try {
      const response = await signAndSubmitTransaction(
        addConnectionEntry({ signer: account.address, tokenAddr: ownTokenAddr!, connectionAddr: connectionTokenAddr }),
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
      setTokenKey(458);
    } finally {
      setIsAdding(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect</DialogTitle>
          <DialogDescription>Add profile to your network</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between py-4">
          <SvoyCardShort name={svToken?.name} description={svToken?.description} />
        </div>
        <DialogFooter>
          <Button disabled={isAdding} onClick={addConnection}>
            {isAdding ? <Loader className="animate-spin" /> : null} Add connection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
