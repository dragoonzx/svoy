import { GiveKudosModal } from "@/components/GiveKudosModal";
import { RaffleSetupModal } from "@/components/RaffleSetupModal";
import { SetLinksModal } from "@/components/SetLinksModal";
import { SetShowcaseNftModal } from "@/components/SetShowcaseNftModal";
import { SvoyCard } from "@/components/SvoyCard";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useParams } from "react-router-dom";

const CardPage = () => {
  const { account } = useWallet();
  const { cardId } = useParams();

  const isMyAccount = account?.address === cardId;

  const hasRaffle = true;

  return (
    <div className="flex items-center justify-center my-20">
      <div className="flex flex-col items-center w-[380px]">
        <div className="mb-8">
          <SvoyCard />
        </div>
        <div className="flex items-center justify-evenly w-full flex-wrap gap-4">
          <div>
            <GiveKudosModal isMyAccount={isMyAccount} />
          </div>
          {isMyAccount ? (
            <div>
              <RaffleSetupModal />
            </div>
          ) : null}
          {isMyAccount ? (
            <div>
              <SetLinksModal />
            </div>
          ) : null}
        </div>
        {isMyAccount ? (
          <div className="mt-4">
            <div>
              <SetShowcaseNftModal />
            </div>
          </div>
        ) : null}
        {hasRaffle ? (
          <div className="mt-8 w-full">
            <div>Raffle</div>
            <div className="mt-4 w-full bg-chetoblack px-4 py-2 rounded-md">
              <div>Description: bla bla bla </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CardPage;
