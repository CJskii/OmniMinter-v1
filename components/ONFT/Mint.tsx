import { useState } from "react";
import { ethers, providers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import CONTRACT_ADDRESS_JSON from "../../constants/contractAddress.json";
import { CONTRACT_ABI } from "../../constants/contractABI";
import getProviderOrSigner from "../../utils/getProviderOrSigner";
import { useAccount, useNetwork } from "wagmi";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface MintProps {
  setMintId: (id: number) => void;
  fromNetwork: string;
}

interface ContractAddressMap {
  [key: string]: string;
}

export const Mint = (props: MintProps) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { fromNetwork } = props;
  console.log(chain?.name);
  const [isLoading, setIsLoading] = useState(false);

  const CONTRACT_ADDRESS: ContractAddressMap =
    CONTRACT_ADDRESS_JSON as ContractAddressMap;

  const mintNft = async () => {
    if (fromNetwork.toLowerCase() !== chain?.name.toLowerCase())
      return alert("Please change network in your wallet\n\n:)");

    console.log(`Minting NFT on ${fromNetwork} network...`);

    try {
      const provider = await getProviderOrSigner();
      const signer = await getProviderOrSigner(true);
      setIsLoading(true);
      if (!(provider instanceof ethers.providers.Web3Provider)) {
        console.error("Provider is not an instance of Web3Provider");
        return;
      }
      const contract = new Contract(
        CONTRACT_ADDRESS[fromNetwork.toLowerCase()],
        CONTRACT_ABI,
        signer
      );

      const contractFeeInWei = await contract.fee();

      const feeInEther = ethers.utils.formatEther(contractFeeInWei);
      console.log(`Fee: ${feeInEther} ETH`);
      const nextMintId = await contract.nextMintId();
      console.log(`Next mint ID: ${nextMintId.toString()}`);
      let tx = await (
        await contract.mint({ value: ethers.utils.parseEther(feeInEther) })
      ).wait();

      let transactionReceipt = await provider.getTransactionReceipt(
        tx.transactionHash
      );
      console.log(transactionReceipt);
      const mintedID = parseInt(transactionReceipt.logs[0].topics[3], 16);
      props.setMintId(mintedID);
      setIsLoading(false);
      console.log(`ONFT nftId: ${mintedID.toString()}`);
      console.log(tx.transactionHash);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded w-full p-4">
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <h1 className="p-4 text-xl font-bold text-white text-left w-full border-red-600">
          Step 1: Mint NFT
        </h1>

        {address && props.fromNetwork != "" && !isLoading ? (
          <button
            onClick={mintNft}
            className="btn rounded-lg border-accent w-full hover:border-primary hover:border-2"
          >
            Mint
          </button>
        ) : (
          <button
            className="btn rounded-lg border-accent w-full hover:border-primary hover:border-2"
            disabled
          >
            Mint
          </button>
        )}
      </div>
    </div>
  );
};

export default Mint;
