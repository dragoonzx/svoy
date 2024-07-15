import { SVOY_V0_ADDRESS } from "@/constants";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type AddConnectionArgs = {
  tokenAddr: string;
  url: string;
};

export const setShowcaseNftEntry = (args: AddConnectionArgs): InputTransactionData => {
  const { tokenAddr, url } = args;
  return {
    data: {
      function: `${SVOY_V0_ADDRESS}::svoy_v0::set_showcase_nft`,
      typeArguments: [],
      functionArguments: [tokenAddr, url],
    },
  };
};
