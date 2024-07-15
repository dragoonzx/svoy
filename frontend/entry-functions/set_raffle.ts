import { SVOY_V0_ADDRESS } from "@/constants";
import { U64 } from "@aptos-labs/ts-sdk";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type RaffleArgs = {
  tokenAddr: string;
  description: string;
  end_timestamp: number;
};

export const setRaffleEntry = (args: RaffleArgs): InputTransactionData => {
  const { tokenAddr, description, end_timestamp } = args;
  return {
    data: {
      function: `${SVOY_V0_ADDRESS}::svoy_v0::create_raffle`,
      typeArguments: [],
      functionArguments: [tokenAddr, description, new U64(end_timestamp)],
    },
  };
};
