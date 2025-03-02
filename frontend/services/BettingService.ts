import { ethers } from "ethers";
import { useWalletClient } from "wagmi";
import BettingABI from "@/abi/Betting.json";
const contractAddress = "0x930aE314a7285B7Cac2E5c7b1c59319837816D48";

export const useBettingService = () => {
  const { data: walletClient } = useWalletClient();

  const createBet = async (
    title: string,
    description: string,
    category: string,
    twitterHandle: string,
    endDate: number,
    joinAmount: number,
    initialPoolAmount: number,
    imageURL: string
  ) => {
    if (!walletClient) {
      throw new Error("Wallet client not found");
    }
    console.log("Creating bet with parameters:", {
      title,
      description,
      category,
      twitterHandle,
      endDate,
      joinAmount,
      initialPoolAmount,
      imageURL,
    });

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
      ethers.parseEther(joinAmount.toString()),
      ethers.parseEther(initialPoolAmount.toString()),
      "imageURL",
      {
        value:
          ethers.parseEther(joinAmount.toString()) +
          ethers.parseEther(initialPoolAmount.toString()),
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
