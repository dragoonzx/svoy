import { SVOY_V0_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getConnections = async (tokenId: string): Promise<{ connections: string[] }> => {
  const connections = await aptosClient().getAccountResource({
    accountAddress: tokenId,
    resourceType: `${SVOY_V0_ADDRESS}::svoy_v0::Connections`,
  });
  return connections;
};
