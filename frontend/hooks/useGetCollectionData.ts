import { useQuery } from "@tanstack/react-query";

import { aptosClient } from "@/utils/aptosClient";

export function useGetCollectionData(address?: string, key?: string): any {
  return useQuery({
    queryKey: [key ?? "nfts"],
    refetchInterval: 1000 * 30,
    enabled: !!address,
    queryFn: async () => {
      try {
        const res = await aptosClient().queryIndexer({
          query: {
            variables: {
              address,
            },
            query: `
						query GetAccountNfts($address: String) {
              current_token_ownerships_v2(
                where: {owner_address: {_eq: $address}, amount: {_gt: "0"}}
              ) {
                current_token_data {
                  collection_id
                  largest_property_version_v1
                  current_collection {
                    collection_id
                    collection_name
                    description
                    creator_address
                    uri
                    __typename
                  }
                  description
                  token_name
                  token_data_id
                  token_standard
                  token_uri
                  __typename
                }
                owner_address
                amount
                __typename
              }
            }`,
          },
        });

        return res;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  });
}
