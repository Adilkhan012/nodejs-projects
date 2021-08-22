import {
  defaultWeb3,
  getContractBusd,
  getContractPresaleFactory,
} from './smart-contracts.js';

import EthDater from 'ethereum-block-by-date';

const _1_Day = 86400 * 1000;

const init = async () => {
  // const res = await getPresalesNotApprovedAddresses();
  // console.log('res: ', res);

  const dater = new EthDater(
    defaultWeb3, // Web3 object, required.
  );

  // Getting block by date:
  let fromBlock = await dater.getDate(new Date(Date.now() - 60 * _1_Day), true);

  let toBlock = await dater.getDate(new Date(Date.now()), true);

  console.log('blockFrom: ', fromBlock.block);
  console.log('blockNow: ', toBlock.block);

  const config = {
    fromBlock: fromBlock.block,
    toBlock: toBlock.block,
  };

  const allEvents = await getContractBusd().getPastEvents('Transfer', config);
  console.log('allEvents: ', allEvents[0]);
};

init();

/*













      config = {
          fromBlock: startFrom,
          toBlock,
        };
      }

      const allEvents = await erc20Contract.getPastEvents('Transfer', config);

      // console.log(startBlock, '****startBlock IN SYNC FOR ERC20');
      allEvents.length > 0 &&
        console.log(
          `*Handle  transactions for deposit  of total events`,
          allEvents.length,
          ' -> SYMBOL :',
          token.symbol,
        );

      let blockNoForTxToInsert = startBlock;

      if (allEvents.length === 0) {
        blockNoForTxToInsert = startBlock + 1000;
      }
      for (const pastTransferEvent of allEvents) {
        const blockInfo = await this.web3.eth.getBlock(
          pastTransferEvent.blockNumber,
        );

        const from = pastTransferEvent.returnValues.from;
        const to = pastTransferEvent.returnValues.to;
        const value = this.web3.utils.fromWei(
          pastTransferEvent.returnValues.value,
        );
        blockNoForTxToInsert = pastTransferEvent.blockNumber;

        console.log(
          'OWNER SHIP TRANSFER FROM : ',
          from,
          ' -> to -> ',
          to,
          ' of token ID : ',
          value,
          ' FOR SYMBOL : ',
          token.symbol,
        );

        console.log(
          'this.lastUpdatedTxHash === pastTransferEvent.transactionHash: ',
          this.lastUpdatedTxHash === pastTransferEvent.transactionHash,
        );
        console.log('this.lastUpdatedTxHash: ', this.lastUpdatedTxHash);
        console.log(
          'pastTransferEvent.transactionHash: ',
          pastTransferEvent.transactionHash,
        );
        if (this.lastUpdatedTxHash === pastTransferEvent.transactionHash)
          return;

        this.lastUpdatedTxHash = pastTransferEvent.transactionHash;

        const updateResult = await this.UserTransactionsModel.create({
          // orderId: "" ,
          txhash: pastTransferEvent.transactionHash,
          from: from.toLowerCase(),
          to: to.toLowerCase(), // we will use this "to" value to return transactions
          value,
          symbol: token.symbol,
          network: token.network,
          blockNumber: pastTransferEvent.blockNumber,
          blockHash: pastTransferEvent.blockHash,
          event: pastTransferEvent.event,
          transactionId: pastTransferEvent.transactionIndex,
          transactionIndex: pastTransferEvent.transactionIndex,
          removed: pastTransferEvent.removed,
          created_at: new Date(Number(blockInfo.timestamp) * 1000),
          updated_at: new Date(),
          contractAddress: pastTransferEvent.address,
        });
        console.log(updateResult);
      } // end of for loop





*/

export const getPresalesNotApprovedAddresses = async (
  index = 0,
  amountToFetch = 10,
) =>
  await getContractPresaleFactory()
    .methods.getPresales(index, amountToFetch, false)
    .call();
