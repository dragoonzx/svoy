import { SVOY_V0_ADDRESS } from "@/constants";
import { U64 } from "@aptos-labs/ts-sdk";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type GiveKudosEntry = {
  receiverToken: string;
  amount: number;
};

export const giveKudosEntry = (args: GiveKudosEntry): InputTransactionData => {
  const { receiverToken, amount } = args;
  return {
    data: {
      function: `${SVOY_V0_ADDRESS}::svoy_v0::give_kudos_in_apt`,
      typeArguments: [],
      functionArguments: [receiverToken, new U64(amount)],
    },
  };
};
