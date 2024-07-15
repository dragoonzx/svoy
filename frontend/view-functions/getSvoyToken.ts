import { SVOY_V0_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getSvoyToken = async (tokenAddr: string): Promise<any> => {
  const svToken = await aptosClient().getAccountResource({
    accountAddress: tokenAddr,
    resourceType: `${SVOY_V0_ADDRESS}::svoy_v0::SvoyToken`,
  });
  return svToken;
};
