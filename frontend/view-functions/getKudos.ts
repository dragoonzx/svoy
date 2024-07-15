import { SVOY_V0_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getKudos = async (tokenAddr: string): Promise<any> => {
  const kudos = await aptosClient().getAccountResource({
    accountAddress: tokenAddr,
    resourceType: `${SVOY_V0_ADDRESS}::svoy_v0::Kudos`,
  });
  return kudos;
};
