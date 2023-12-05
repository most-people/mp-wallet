import { useChainWallet, useWallet } from "@cosmos-kit/react-lite";
import { WalletName, akiError, akiLog } from "./useAkiWallet";
import { chains } from "chain-registry";

export type CosmosChainName = "Cosmos Hub" | "Kava" | "Dora Vota" | "Injective";

const walletName = "keplr-extension";

const getChainName = (chain_name: CosmosChainName) => {
  return {
    "Cosmos Hub": "cosmoshub",
    Kava: "kava",
    "Dora Vota": "kava",
    Injective: "kava",
  }[chain_name];
};

export const useCosmos = () => {
  const wallet = useChainWallet(getChainName("Cosmos Hub"), walletName, false);
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
    const chain = chains.find((chain) => {
      return chain.chain_name === getChainName("Cosmos Hub");
    });

    try {
      const result = await mainWallet?.client?.signArbitrary?.(
        chain?.chain_id || "",
        wallet.address || "",
        message
      );
      if (result) {
        akiLog("Sig: " + result.signature);
        return result.signature;
      }
    } catch (error) {
      akiError("Sign Message Error: " + error);
    }
    return "";
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
