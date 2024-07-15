import { SVOY_V0_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getSocialLink = async (tokenAddr: string): Promise<any> => {
  const socialLink = await aptosClient().getAccountResource({
    accountAddress: tokenAddr,
    resourceType: `${SVOY_V0_ADDRESS}::svoy_v0::SocialLinks`,
  });
  return socialLink;
};
