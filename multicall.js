import { Multicall } from "ethereum-multicall";
import { defaultWeb3, multicallCustomContractAddress, nftAbi, nftAddress } from "./smart-contract.js";

export const getNftHolders = async () => {
  const multicall = new Multicall({
    multicallCustomContractAddress,
    web3Instance: defaultWeb3,
    tryAggregate: true,
  });

  let calls1 = [];

  // let supply = 

  for (let i = 0; i <= 1550; i++) {
    calls1.push({
      methodName: "ownerOf",
      methodParameters: [i],
    });
  }

  const contractCallContext = [
    {
      reference: "SmartContractCall1",
      contractAddress: nftAddress,
      abi: nftAbi,
      calls: calls1,
    },
  ];

  const results = await multicall.call(contractCallContext);

  // console.log(JSON.stringify(results));

  let holders = [];
  results.results["SmartContractCall1"].callsReturnContext.map((obj, i) => obj.success && holders.push(obj.returnValues[0]));

  return holders;
};