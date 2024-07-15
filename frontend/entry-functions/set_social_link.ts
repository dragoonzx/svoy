import { SVOY_V0_ADDRESS } from "@/constants";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type AddConnectionArgs = {
  tokenAddr: string;
  title: string;
  href: string;
};

export const setSocialConnectionEntry = (args: AddConnectionArgs): InputTransactionData => {
  const { tokenAddr, title, href } = args;
  return {
    data: {
      function: `${SVOY_V0_ADDRESS}::svoy_v0::set_social_links`,
      typeArguments: [],
      functionArguments: [tokenAddr, title, href],
    },
  };
};
