import { SVOY_V0_ADDRESS } from "@/constants";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type AddConnectionArgs = {
  signer: string;
  tokenAddr: string;
  connectionAddr: string;
};

export const addConnectionEntry = (args: AddConnectionArgs): InputTransactionData => {
  const { tokenAddr, connectionAddr } = args;
  return {
    data: {
      function: `${SVOY_V0_ADDRESS}::svoy_v0::update_svoy_connections`,
      typeArguments: [],
      functionArguments: [tokenAddr, connectionAddr],
    },
  };
};
