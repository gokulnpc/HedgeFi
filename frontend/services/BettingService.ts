import { ethers } from "ethers";
import { useWalletClient } from "wagmi";
import BettingABI from "@/abi/Betting.json";
const contractAddress = "0x3aB8c5Af341a90a287e93736B735c30BCb3f0D94";

export const useBettingService = () => {
  const { data: walletClient } = useWalletClient();

  const createBet = async (
    title: string,
    description: string,
    category: string,
    twitterHandle: string,
    endDate: number,
    amount: number,
    initialPoolAmount: number,
    imageURL: string
  ) => {
    if (!walletClient) {
      throw new Error("Wallet client not found");
    }
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const bettingContract = new ethers.Contract(
      contractAddress,
      BettingABI,
      signer
    );
    const tx = await bettingContract.createBet(
      title,
      description,
      category,
      twitterHandle,
      endDate,
      amount,
      initialPoolAmount,
      imageURL,
      {
        value: amount + initialPoolAmount,
      }
    );
    const receipt = await tx.wait();
    return receipt;
  };

  const joinBet = async (betId: number, support: boolean) => {
    if (!walletClient) {
      throw new Error("Wallet client not found");
    }
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const bettingContract = new ethers.Contract(
      contractAddress,
      BettingABI,
      signer
    );
    const tx = await bettingContract.joinBet(betId, support, {
      value: ethers.parseEther("1.0"), // Assuming 1 ETH as the bet amount
    });
    const receipt = await tx.wait();
    return receipt;
  };

  const closeBet = async (betId: number, outcome: boolean) => {
    if (!walletClient) {
      throw new Error("Wallet client not found");
    }
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const bettingContract = new ethers.Contract(
      contractAddress,
      BettingABI,
      signer
    );
    const tx = await bettingContract.closeBet(betId, outcome);
    const receipt = await tx.wait();
    return receipt;
  };

  const withdraw = async () => {
    if (!walletClient) {
      throw new Error("Wallet client not found");
    }
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const bettingContract = new ethers.Contract(
      contractAddress,
      BettingABI,
      signer
    );
    const tx = await bettingContract.withdraw();
    const receipt = await tx.wait();
    return receipt;
  };

  return {
    createBet,
    joinBet,
    closeBet,
    withdraw,
  };
};
