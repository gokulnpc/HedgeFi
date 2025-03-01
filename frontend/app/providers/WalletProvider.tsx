"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useWalletStore, WalletState } from "../store/walletStore";
import { ethers } from "ethers";

// Create context with additional methods
interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  getContract: (address: string, abi: any) => Promise<ethers.Contract | null>;
  isMetaMaskInstalled: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // Get wallet state and methods from the store
  const wallet = useWalletStore();

  // Check if MetaMask is installed
  const isMetaMaskInstalled =
    typeof window !== "undefined" && !!window.ethereum;

  // Auto-connect if previously authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (isAuthenticated && isMetaMaskInstalled && !wallet.isConnected) {
      // Try to reconnect silently
      wallet.connect().catch((error) => {
        console.error("Failed to auto-connect wallet:", error);
      });
    }
  }, [wallet, isMetaMaskInstalled]);

  // Listen for network changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleChainChanged = () => {
        // Reload the page on chain change as recommended by MetaMask
        window.location.reload();
      };

      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  // Combine wallet state and methods with additional context properties
  const contextValue: WalletContextType = {
    ...wallet,
    isMetaMaskInstalled,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};
