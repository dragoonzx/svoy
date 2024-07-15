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
import { SVOY_V0_COLLECTION_ADDRESS } from "@/constants";
import { setShowcaseNftEntry } from "@/entry-functions/set_showcase_nft";
import { useGetCollectionData } from "@/hooks/useGetCollectionData";
import { cn } from "@/lib/utils";
import { aptosClient } from "@/utils/aptosClient";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { GiTotemMask } from "react-icons/gi";
import { useToast } from "./ui/use-toast";
import { Loader } from "lucide-react";

export function SetShowcaseNftModal({ ownTokenAddr, setKey }: { ownTokenAddr: string; setKey: (n: number) => void }) {
  const { account, signAndSubmitTransaction } = useWallet();
  const { data, isLoading } = useGetCollectionData(account?.address);

  const [open, setOpen] = useState(false);
  const [nft, setNft] = useState<any>();

  const collections = data
    ? data.current_token_ownerships_v2.filter(
        (token: any) => token?.current_token_data?.collection_id !== SVOY_V0_COLLECTION_ADDRESS,
      )
    : [];

  const { toast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const setShowcaseNft = async () => {
    if (!account?.address) {
      return;
    }

    setIsAdding(true);
    try {
      const response = await signAndSubmitTransaction(
        setShowcaseNftEntry({ tokenAddr: ownTokenAddr!, url: nft?.current_token_data?.token_uri }),
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
      setKey(423432);
      setNft(undefined);
    } finally {
      setIsAdding(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <div className="flex items-center justify-between py-4 flex-wrap gap-4 overflow-auto">
          {collections.map((collection) => (
            <div>
              <img
                src={collection.current_token_data.token_uri}
                width={72}
                height={72}
                className={cn(
                  "rounded-lg p-1 border cursor-pointer",
                  nft?.current_token_data?.token_uri === collection.current_token_data.token_uri
                    ? "border-bluez"
                    : "border-white",
                )}
                alt={collection.current_token_data.token_name}
                onClick={() => setNft(collection)}
              />
              <p className="mt-2 text-xs font-mono text-center">{collection.current_token_data.token_name}</p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button disabled={!nft || isAdding} onClick={setShowcaseNft}>
            {isAdding ? <Loader className="animate-spin" /> : null} Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
