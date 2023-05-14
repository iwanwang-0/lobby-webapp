// 1683763200 / (7 * 24 * 60 * 60)
// 2784
// 1684368000 / (7 * 24 * 60 * 60)
// 2785
const WEEK_SECONDS = 7 * 24 * 60 * 60;

// eslint-disable-next-line import/prefer-default-export
export function getCrvHistory({ round, user }) {
  const body = {
    query: `{
      gaugeVotes(
        where: {
          time_gt: ${WEEK_SECONDS * round},
          time_lt: ${WEEK_SECONDS * round + WEEK_SECONDS}
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

  return fetch('https://api.thegraph.com/subgraphs/name/pengiundev/curve-gaugecontroller-mainnet', {
    body: JSON.stringify(body),
    method: 'POST',
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        // const { myVotes } = res.data;
        // return myVotes;
        const { gaugeVotes } = res.data;
        return gaugeVotes;
      }
      return [];
    })
    .catch((error) => console.error(error));
}
