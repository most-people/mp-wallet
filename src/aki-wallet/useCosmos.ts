import { useChainWallet, useWallet } from "@cosmos-kit/react-lite";
import { WalletName, akiError, akiLog } from "./useAkiWallet";
import { chains } from "chain-registry";
import { useState } from "react";

export type CosmosChainName = "Cosmos Hub" | "Kava" | "Dora Vota" | "Injective";

export const useCosmos = () => {
  const walletName = "keplr-extension";

  const [chainName, setChainName] = useState("cosmoshub");

  const wallet = useChainWallet(chainName, walletName, false);
  const { mainWallet } = useWallet(walletName);

  const installed = (wallet_name: WalletName) => {
    if (wallet_name === "Keplr") {
      if ("keplr" in window) {
        return true;
      }
    }
    return false;
  };

  const connect = async (wallet_name: WalletName) => {
    if (!installed(wallet_name)) {
      akiError("Not Found " + wallet_name);
    }
    try {
      await wallet.connect();
    } catch (error: any) {
      akiError(error);
    }
  };

  const signMessage = async (message: string) => {
    const chain = chains.find((chain) => {
      return chain.chain_name === chainName;
    });

    try {
      const result = await mainWallet?.client?.signArbitrary?.(
        chain?.chain_id || "",
        wallet.address || "",
        message
      );
      if (result) {
        return result.signature as string;
      }
    } catch (error) {
      akiError("Sign Message Error: " + error);
    }
    return "";
  };

  const changeChain = (chain_name: CosmosChainName) => {
    const dict = {
      "Cosmos Hub": "cosmoshub",
      Kava: "kava",
      "Dora Vota": "doravota",
      Injective: "injective",
    };
    setChainName(dict[chain_name]);
    // connect("Keplr");
  };

  return {
    signMessage,
    connect,
    disconnect: wallet.disconnect,
    installed,
    wallet,
    changeChain,
  };
};
