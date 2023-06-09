import client from '@/eth/snapshot';
// import provider from '@/eth/provider';
import config from '@/config';
import { Web3Provider } from '@ethersproject/providers';
import snapshot from '@snapshot-labs/snapshot.js';
import provider from '@/eth/provider';

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

export function getProposalListById(ids) {
  const query = `
    query {
      proposals(
        first: 100,
        skip: 0,
        where: {
          space_in: ["${config.space}"],
          id_in: ${JSON.stringify(ids)},
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
        return res?.data?.proposals;
      }
      return {};
    })
    .catch((error) => console.error(error));
}

// eslint-disable-next-line import/prefer-default-export
export function getProposal() {
  const query = `
    query {
      proposals(
        first: 1,
        skip: 0,
        where: {
          space_in: ["${config.space}"],
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

// eslint-disable-next-line import/prefer-default-export
export function getCvxVotes({ voter, start, end }) {
  // created_gt: 1681011582
  // created_lt: 1681048725
  const query = `
    query {
      votes (
        first: 1000
        skip: 0
        where: {
          voter: "${voter}"
          created_gt: ${start}
          created_lt: ${end}
        }
        orderBy: "created"
        orderDirection: desc
      ) {
        id
        voter
        vp
        vp_by_strategy
        vp_state
        created
        proposal {
          id
          choices
        }
        choice
        space {
          id
        }
      }
    }
    `;

  return fetch(`${hub}/graphql?`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

// eslint-disable-next-line import/prefer-default-export
export function getVotePower({ proposal, voter }) {
  // proposal: "${proposal}"
  const query = `
    query {
      vp (
        voter: "${voter}"
        space: "${config.space}"
      ) {
        vp
        vp_by_strategy
        vp_state
      }
    }
    `;

  return fetch(`${hub}/graphql?`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

export async function vote({ account, proposal, choice }) {
  const web3 = new Web3Provider(window.ethereum);
  const receipt = await client.vote(web3, account, {
    space: config.space,
    type: 'weighted',
    // app: 'my-app',
    proposal,
    choice,
  });

  return receipt;
}

export async function getTotalDelegate() {
  const address = config.DelegateAddress;
  const network = '1';
  const strategies = [
    {
      name: 'erc20-balance-of',
      network: '1',
      params: {
        symbol: 'CVX',
        address: config.VlCVX,
        decimals: 18,
      },
    },
    {
      name: 'erc20-balance-of-delegation',
      network: '1',
      params: {
        symbol: 'CVX',
        address: config.VlCVX,
        decimals: 18,
      },
    },
  ];

  // Should get the current block number
  // const blockNumber = 17597962;
  const { space } = config;
  const delegation = false;
  const blockNumber = await provider.getBlockNumber();
  console.log(blockNumber)
  const vp = await snapshot.utils.getVp(address, network, strategies, blockNumber, space, delegation)

  console.log('Voting Power', vp);
  const myVp = vp.vp_by_strategy[0];
  const totalVp = vp.vp_by_strategy[1];
  const delegatedVp = totalVp - myVp;
  // console.log("Delegated voting power: " + delegatedVp);
  return delegatedVp;
}
