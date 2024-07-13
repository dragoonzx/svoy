import { useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";

import { useGetCollectionData } from "@/hooks/useGetCollectionData";

import { MintModal } from "@/components/MintModal";
import { Button, buttonVariants } from "@/components/ui/button";
import { SvoyCard } from "@/components/SvoyCard";
import { ShareModal } from "@/components/ShareModal";
import { SvoyCardShort } from "@/components/SvoyCardShort";
import { Link } from "react-router-dom";
import { LucideEdit } from "lucide-react";

export function Feed() {
  const { data, isLoading } = useGetCollectionData();

  const queryClient = useQueryClient();
  const { account } = useWallet();
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [account, queryClient]);

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <h1 className="title-md">Loading...</h1>
      </div>
    );
  }

  const svoyToken = true;
  const connections = ["0x0", "0x1", "0x2", "0x3", "0x4", "0x5", "0x6"];
  let mainContent;

  if (!account) {
    mainContent = (
      <h1 className="mt-10 text-3xl p-16">Connect wallet to create Svoy profile /// or to see your connections</h1>
    );
  }

  if (account && !svoyToken) {
    mainContent = (
      <div className="mt-10">
        <MintModal />
      </div>
    );
  }

  if (account && svoyToken && !connections.length) {
    mainContent = (
      <div className="flex flex-col items-center w-[380px]">
        <div className="mb-8">
          <p className="font-mono mb-2 text-left w-full text-sm">My card</p>
          <SvoyCard />
        </div>
        <ShareModal />
      </div>
    );
  }

  if (account && svoyToken && connections.length) {
    mainContent = (
      <div className="flex flex-col items-center w-[380px]">
        <div>
          <div className="flex items-center justify-between">
            <div className="font-mono text-left w-full text-sm">
              <Link to={`/app/card/${account.address}`} className={buttonVariants({ variant: "link" })}>
                My card
              </Link>
            </div>
            {/* <div className="font-mono text-sm">
              <Link to={`/app/card/${account.address}`} className={buttonVariants({ variant: "link" })}>
                <LucideEdit size={14} /> edit
              </Link>
            </div> */}
          </div>
          <SvoyCard />
        </div>
        <div className="mb-8">
          <div className="font-mono mt-8 text-left w-full text-sm">
            <Link to="/connections" className={buttonVariants({ variant: "link" })}>
              My connections
            </Link>
          </div>
          <div className="relative space-y-4">
            {connections.map((el, i) => (
              <Link to={`/app/card/${el}`} className="block">
                <SvoyCardShort />
              </Link>
            ))}
          </div>
        </div>
        <ShareModal />
      </div>
    );
  }

  // todo
  // [] - account && !svoyToken => btn with modal to mint Svoy Token
  // [] - account && svoyToken && !connections => show your svoy card with edit icon btn & show share btn
  // [] - account && svoyToken && connections => show your svoy card with edit icon btn & show connections cards & show share btn
  // [] -
  return (
    <>
      <div className="overflow-hidden">
        <main className="text-center">
          <div className="mt-10 mb-20 flex flex-col items-center">{mainContent}</div>
        </main>
      </div>
    </>
  );
}
