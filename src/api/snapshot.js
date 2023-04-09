import client from '@/eth/snapshot';
// import provider from '@/eth/provider';
import config from '@/config';
import { Web3Provider } from '@ethersproject/providers';

// const client = new snapshot.Client712(hub);

// import { Web3Provider } from '@ethersproject/providers';

// const web3 = new Web3Provider(window.ethereum);
// const [account] = await web3.listAccounts();

// const receipt = await client.vote(web3, account, {
//   space: 'yam.eth',
//   proposal: '0x21ea31e896ec5b5a49a3653e51e787ee834aaf953263144ab936ed756f36609f',
//   type: 'single-choice',
//   choice: 1,
//   reason: 'Choice 1 make lot of sense',
//   app: 'my-app'
// });

const hub = 'https://hub.snapshot.org';

const query = `
  query {
    proposals(
      first: 1,
      skip: 0,
      where: {
        space_in: ["iwan.eth"],
        title_contains: "Gauge Weight for Week of",
        state: "active"
      },
      orderBy: "created",
      orderDirection: desc
    ) {
      id
      title
      body
      type
      choices
      start
      end
      snapshot
      state
      author
      space {
        id
        name
      }
    }
  }
`;

// eslint-disable-next-line import/prefer-default-export
export function getProposal() {
  return fetch(`${hub}/graphql?`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .then((res) => {
      if (res?.data?.proposals) {
        const keyword = 'Gauge Weight for Week of';
        const target = res?.data?.proposals.find((item) => item.title.match(keyword));
        if (target) {
          return target;
        }
      }
      return {};
    })
    .catch((error) => console.error(error));
}

export async function vote({ account, proposal, choice }) {
  const web3 = new Web3Provider(window.ethereum);
  // console.log(web3, account, {
  //   space: config.space,
  //   // type: 'weight',
  //   app: 'my-app',
  //   proposal,
  //   choice,
  // });
  const receipt = await client.vote(web3, account, {
    space: config.space,
    type: 'weighted',
    // app: 'my-app',
    proposal,
    choice,
  });

  return receipt;
}
