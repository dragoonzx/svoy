import { SVOY_V0_ADDRESS } from "@/constants";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type MintNftArguments = {
  name: string;
  description: string;
  uri: string;
  userAddr?: string;
};

export const mintSvoyProfileNFT = (args: MintNftArguments): InputTransactionData => {
  const { name, description, uri, userAddr } = args;
  return {
    data: {
      function: `${SVOY_V0_ADDRESS}::svoy_v0::mint_svoy_token`,
      typeArguments: [],
      functionArguments: [name, description, uri, userAddr],
    },
  };
};
