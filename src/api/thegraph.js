import { WEEK_SECONDS } from '@/constants/time';

// eslint-disable-next-line import/prefer-default-export
export function getCrvHistory({ round, user }) {
  const body = {
    query: `{
      gaugeVotes(
        where: {
          ${round !== 'all' ? `time_gt: ${WEEK_SECONDS * round}` : ''}
          ${round !== 'all' ? `time_lt: ${WEEK_SECONDS * round + WEEK_SECONDS}` : ''}
        },
        orderBy: time,
        orderDirection: desc
      )
        {
          id
          time
          user
          gauge
          weight
          gauge_weights {
            gauge
            gauge_weight
            __typename
          }
          total_weight
          veCRV
          totalveCRV
          __typename
        }
      myVotes: gaugeVotes(
          where: {
            user: "${user}",
            time_gt: ${WEEK_SECONDS * round},
            time_lt: ${WEEK_SECONDS * round + WEEK_SECONDS}
          },
          orderBy: time,
          orderDirection: desc
        ) {
          id
          time
          user
          gauge
          weight
          gauge_weights {
              gauge
              gauge_weight
              __typename
          }
          total_weight
          veCRV
          totalveCRV
          __typename
        }
      }`,
    variables: {},
  };
  console.log(body)

  return fetch('https://api.thegraph.com/subgraphs/name/pengiundev/curve-gaugecontroller-mainnet', {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        const { myVotes } = res.data;
        return myVotes;
        // const { gaugeVotes } = res.data;
        // return gaugeVotes;
      }
      return [];
    })
    .catch((error) => console.error(error));
}

// eslint-disable-next-line import/prefer-default-export
export function getRewardHistory({user, market}) {
  const body = {
    query: `{
      claimedRecords(
        first: 500
        where: {
          user: "${user}"
          ${market ? `platform: "${market}"` : ''}
        }
      ) {
        user
        rewardToken
        amount
        period
        platform
        blockNumber
        blockTimestamp
        transactionHash
      }
    }`,
  };

  //
  // https://gateway.thegraph.com/api/d2c1164eea9b21ff78599b6e1d3d87c0/subgraphs/id/Ejw1Ce11rmQfv4iB6H8VDLhJnnNnZ5QVyxEFE9TTSkZv
  return fetch('https://api.studio.thegraph.com/query/49331/lobby-subgraph/version/latest', {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      }
      return [];
    })
    .catch((error) => console.error(error));
}
