import { useChainWallet } from "@cosmos-kit/react-lite";
import { WalletName, akiError } from "./useAkiWallet";

export type CosmosChainName = "Kava" | "Dora Vota" | "Injective";

export const useCosmos = () => {
  // Juno: "juno",
  // Osmosis: "osmosis",
  // Stargaze: "stargaze",
  // "Cosmos Hub": "cosmoshub",

  const wallet = useChainWallet("cosmoshub", "keplr-extension", false);

  const installed = (wallet_name: WalletName) => {
    if (wallet_name === "Keplr") {
      if ("keplr" in window) {
        return true;
      }
    }
    return false;
  };

  const connect = async (wallet_name: WalletName) => {
    if (installed(wallet_name)) {
      try {
        await wallet.connect();
      } catch (error: any) {
        akiError(error);
      }
      return;
    }
    akiError("Not Found " + wallet_name);
  };

  const signMessage = async (message: string) => {
    akiError("Cosmos cannot sign message");
  };

  const changeNetwork = (chain_name: CosmosChainName) => {
    akiError("Todo: change network" + chain_name);
  };

  return {
    signMessage,
    connect,
    disconnect: wallet.disconnect,
    installed,
    wallet,
    changeNetwork,
  };
};
