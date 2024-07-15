import { SVOY_V0_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getShowcaseNft = async (tokenAddr: string): Promise<{ pfp_url: string }> => {
  const showcaseNft = await aptosClient().getAccountResource({
    accountAddress: tokenAddr,
    resourceType: `${SVOY_V0_ADDRESS}::svoy_v0::ShowcaseNFT`,
  });
  return showcaseNft;
};
