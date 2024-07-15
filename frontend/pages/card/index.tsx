import { GiveKudosModal } from "@/components/GiveKudosModal";
import { RaffleSetupModal } from "@/components/RaffleSetupModal";
import { SetLinksModal } from "@/components/SetLinksModal";
import { SetShowcaseNftModal } from "@/components/SetShowcaseNftModal";
import { SvoyCard } from "@/components/SvoyCard";
import Timer from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SVOY_V0_COLLECTION_ADDRESS } from "@/constants";
import { raffleWinnerEntry } from "@/entry-functions/raffle_winner";
import { useGetCollectionData } from "@/hooks/useGetCollectionData";
import { cn } from "@/lib/utils";
import { aptosClient } from "@/utils/aptosClient";
import { APT_DECIMALS } from "@/utils/helpers";
import { getKudos } from "@/view-functions/getKudos";
import { getLastRaffle } from "@/view-functions/getLastRaffle";
import { getShowcaseNft } from "@/view-functions/getShowcaseNft";
import { getSocialLink } from "@/view-functions/getSocialLink";
import { getSvoyToken } from "@/view-functions/getSvoyToken";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CardPage = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const { cardId } = useParams();

  const [key, setKey] = useState(1);

  const { data, isLoading } = useGetCollectionData(account?.address);

  const svoyToken = data
    ? data.current_token_ownerships_v2.find(
        (token: any) => token?.current_token_data?.collection_id === SVOY_V0_COLLECTION_ADDRESS,
      )
    : undefined;

  const [svToken, setSvToken] = useState<any>(null);
  useEffect(() => {
    const getSvToken = async () => {
      const svToken = await getSvoyToken(cardId!);
      setSvToken(svToken);
    };
    if (cardId) {
      getSvToken();
    }
  }, [cardId]);

  const isMyAccount = svoyToken?.current_token_data?.token_data_id === cardId;

  const { data: socialLinks } = useQuery({
    queryKey: ["social" + key],
    enabled: !!cardId,
    queryFn: () => {
      return getSocialLink(cardId!);
    },
  });

  const { data: kudos } = useQuery({
    queryKey: ["kudos" + key],
    enabled: !!cardId,
    queryFn: () => {
      return getKudos(cardId!);
    },
  });

  const { data: showcaseNft } = useQuery({
    queryKey: ["showcaseNft" + key],
    enabled: !!cardId,
    queryFn: () => {
      return getShowcaseNft(cardId!);
    },
  });

  const { data: lastRaffle } = useQuery({
    queryKey: ["lastRaffle" + key],
    enabled: !!cardId,
    queryFn: () => {
      return getLastRaffle(cardId!);
    },
  });

  console.log({ lastRaffle });

  const hasRaffle = lastRaffle && lastRaffle.start_timestamp > 0;

  const { toast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const claimWinner = async () => {
    if (!account?.address) {
      return;
    }

    setIsAdding(true);
    try {
      const response = await signAndSubmitTransaction(raffleWinnerEntry({ tokenAddr: cardId! }));
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
    }
  };

  return (
    <div className="flex items-center justify-center my-20">
      <div className="flex flex-col items-center w-[380px]">
        <div className="mb-8">
          <SvoyCard
            name={svToken?.name}
            description={svToken?.description}
            socialLinks={socialLinks}
            pfpUrl={showcaseNft?.pfp_url}
          />
        </div>
        {kudos?.coins?.value && Number(kudos?.coins?.value) > 0 ? (
          <div className="mt-0 mb-8">
            <div className="bg-chetoblack px-4 py-2 rounded-md flex flex-col justify-between items-center">
              <p>Kudos ⚡️</p>
              <p className="font-mono text-xs">{kudos.coins.value / 10 ** APT_DECIMALS} APT</p>
            </div>
          </div>
        ) : null}
        <div className="flex items-center justify-evenly w-full flex-wrap gap-4">
          <div>
            <GiveKudosModal setTokenKey={setKey} receiverToken={cardId!} isMyAccount={isMyAccount} />
          </div>
          {isMyAccount ? (
            <div>
              <RaffleSetupModal kudos={kudos} ownTokenAddr={cardId!} setKey={setKey} />
            </div>
          ) : null}
          {isMyAccount ? (
            <div>
              <SetLinksModal ownTokenAddr={cardId!} setKey={setKey} />
            </div>
          ) : null}
        </div>
        {isMyAccount ? (
          <div className="mt-4">
            <div>
              <SetShowcaseNftModal ownTokenAddr={cardId!} setKey={setKey} />
            </div>
          </div>
        ) : null}
        {hasRaffle ? (
          <div className="mt-8 w-full">
            <div>Raffle</div>
            <div className="mt-2 w-full bg-chetoblack px-4 py-2 rounded-md space-y-3 relative overflow-hidden">
              <div className="space-y-0.5">
                <div>Kudos at stake</div>
                <div className="text-sm text-muted-foreground">
                  {Number(lastRaffle.award.value) / 10 ** APT_DECIMALS} APT
                </div>
              </div>
              <div className="space-y-0.5">
                <div>Conditions</div>
                <div className="text-sm text-muted-foreground">{lastRaffle.description}</div>
              </div>
              <div className="space-y-0.5">
                <div>End timer</div>
                <div className="text-sm text-muted-foreground">
                  <Timer expiryTimestamp={new Date(Number(lastRaffle.end_timestamp) / 1000)} />
                </div>
              </div>
              <Button
                disabled={isAdding || Date.now() < Number(lastRaffle.end_timestamp) / 1000 || lastRaffle.is_claimed}
                className="w-full"
                onClick={claimWinner}
              >
                {isAdding ? <Loader className="animate-spin" /> : null} Claim
              </Button>
              <div
                className={cn(
                  "absolute rotate-45 w-28 h-4 text-xs top-3 -right-6 text-center",
                  lastRaffle.is_claimed ? "bg-red-600" : "bg-bluez",
                )}
              >
                Raffle {lastRaffle.is_claimed ? "over" : "now"}!
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CardPage;
