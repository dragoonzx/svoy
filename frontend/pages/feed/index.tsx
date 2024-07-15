import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";

import { useGetCollectionData } from "@/hooks/useGetCollectionData";

import { MintModal } from "@/components/MintModal";
import { buttonVariants } from "@/components/ui/button";
import { SvoyCard } from "@/components/SvoyCard";
import { ShareModal } from "@/components/ShareModal";
import { SvoyCardShort } from "@/components/SvoyCardShort";
import { Link, useSearchParams } from "react-router-dom";
import { SVOY_V0_COLLECTION_ADDRESS } from "@/constants";
import { getConnections } from "@/view-functions/getConnections";
import { AddConnectModal } from "@/components/AddConnectModal";
import { getSocialLink } from "@/view-functions/getSocialLink";
import { getSvoyToken } from "@/view-functions/getSvoyToken";
import { getShowcaseNft } from "@/view-functions/getShowcaseNft";

export function Feed() {
  const queryClient = useQueryClient();
  const { account } = useWallet();
  const [tokenKey, setTokenKey] = useState(0);
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [tokenKey, account, queryClient]);

  const { data, isLoading } = useGetCollectionData(account?.address);

  const [searchParams, setSearchParams] = useSearchParams();
  // [] - call random to claim award
  // [] - skeleton loaders
  const svoyToken = data
    ? data.current_token_ownerships_v2.find(
        (token: any) => token?.current_token_data?.collection_id === SVOY_V0_COLLECTION_ADDRESS,
      )
    : false;

  const { data: connectionsData } = useQuery({
    queryKey: ["connections" + tokenKey],
    refetchInterval: 1000 * 30,
    enabled: !!account && !!svoyToken,
    queryFn: async () => {
      const res = [];
      const connections = await getConnections(svoyToken.current_token_data?.token_data_id);
      for (const addr of connections.connections) {
        const svToken = await getSvoyToken(addr);
        if (svToken && Object.keys(svToken)?.length) {
          res.push({ token_addr: addr, ...svToken });
        }
      }
      return res;
    },
  });

  const { data: socialLinks } = useQuery({
    queryKey: ["social" + tokenKey],
    enabled: !!svoyToken,
    queryFn: () => {
      return getSocialLink(svoyToken?.current_token_data?.token_data_id);
    },
  });

  const { data: showcaseNft } = useQuery({
    queryKey: ["showcaseNft" + tokenKey],
    enabled: !!svoyToken,
    queryFn: () => {
      return getShowcaseNft(svoyToken?.current_token_data?.token_data_id);
    },
  });

  const [openAddConnectionModal, setOpenAddConnectionModal] = useState(false);
  const [connectionAddr, setConnectionAddr] = useState("");

  useEffect(() => {
    if (account && svoyToken && searchParams.has("connection")) {
      const connectionAddress = searchParams.get("connection");
      setConnectionAddr(connectionAddress!);
      setOpenAddConnectionModal(true);
      setSearchParams("");
    }
  }, [account, svoyToken, searchParams]);

  console.log({ data });

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <h1 className="title-md">Loading...</h1>
      </div>
    );
  }

  const connections = connectionsData ?? [];
  let mainContent;

  if (!account) {
    mainContent = (
      <h1 className="mt-10 text-3xl p-16">Connect wallet to create Svoy profile /// or to see your connections</h1>
    );
  }

  if (account && !svoyToken) {
    mainContent = (
      <div className="mt-10">
        <MintModal setTokenKey={setTokenKey} />
      </div>
    );
  }

  if (account && svoyToken && !connections.length) {
    mainContent = (
      <div className="flex flex-col items-center w-[380px]">
        <div className="mb-8">
          <p className="font-mono text-left w-full text-sm">
            <Link
              to={`/app/card/${svoyToken?.current_token_data?.token_data_id}`}
              className={buttonVariants({ variant: "link" })}
            >
              My card
            </Link>
          </p>
          <SvoyCard
            name={svoyToken.current_token_data.token_name}
            description={svoyToken.current_token_data.description}
            socialLinks={socialLinks}
            pfpUrl={showcaseNft?.pfp_url}
          />
        </div>
        <ShareModal tokenAddr={svoyToken.current_token_data.token_data_id} />
      </div>
    );
  }

  if (account && svoyToken && connections.length) {
    mainContent = (
      <div className="flex flex-col items-center w-[380px]">
        <div>
          <div className="flex items-center justify-between">
            <div className="font-mono text-left w-full text-sm">
              <Link
                to={`/app/card/${svoyToken?.current_token_data?.token_data_id}`}
                className={buttonVariants({ variant: "link" })}
              >
                My card
              </Link>
            </div>
            {/* <div className="font-mono text-sm">
              <Link to={`/app/card/${account.address}`} className={buttonVariants({ variant: "link" })}>
                <LucideEdit size={14} /> edit
              </Link>
            </div> */}
          </div>
          <SvoyCard
            name={svoyToken.current_token_data.token_name}
            description={svoyToken.current_token_data.description}
            socialLinks={socialLinks}
            pfpUrl={showcaseNft?.pfp_url}
          />
        </div>
        <div className="mb-8">
          <div className="font-mono mt-8 text-left w-full text-sm">
            <Link to="/app" className={buttonVariants({ variant: "link" })}>
              My connections
            </Link>
          </div>
          <div className="relative space-y-4">
            {connections.map((el, i) => (
              <Link to={`/app/card/${el.token_addr}`} key={i} className="block">
                <SvoyCardShort name={el.name} description={el.description} index={`000${i + 1}`} />
              </Link>
            ))}
          </div>
        </div>
        <ShareModal tokenAddr={svoyToken.current_token_data.token_data_id} />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden">
        <main className="text-center">
          <div className="mt-10 mb-20 flex flex-col items-center">{mainContent}</div>
          <AddConnectModal
            ownTokenAddr={svoyToken?.current_token_data?.token_data_id}
            connectionTokenAddr={connectionAddr!}
            open={openAddConnectionModal}
            setOpen={setOpenAddConnectionModal}
            setTokenKey={setTokenKey}
          />
        </main>
      </div>
    </>
  );
}
