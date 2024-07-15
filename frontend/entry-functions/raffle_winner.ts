import { SVOY_V0_ADDRESS } from "@/constants";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type RaffleArgs = {
  tokenAddr: string;
};

export const raffleWinnerEntry = (args: RaffleArgs): InputTransactionData => {
  const { tokenAddr } = args;
  return {
    data: {
      function: `${SVOY_V0_ADDRESS}::svoy_v0::raffle_winner_and_transfer`,
      typeArguments: [],
      functionArguments: [tokenAddr],
    },
  };
};
