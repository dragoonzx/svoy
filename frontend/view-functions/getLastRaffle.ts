import { SVOY_V0_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";

interface Raffle {
  start_timestamp: number;
  end_timestamp: number;
  award: { value: string };
  description: string;
  tickets: string[];
  winner: string;
  is_claimed: boolean;
}

export const getLastRaffle = async (tokenId: string): Promise<Raffle> => {
  const raffle = await aptosClient().getAccountResource({
    accountAddress: tokenId,
    resourceType: `${SVOY_V0_ADDRESS}::svoy_v0::Raffle`,
  });
  return raffle;
};
