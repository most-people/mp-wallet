import {
  useWallet,
  WalletName as AptosWalletName,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-react";
import { WalletName, akiError, akiLog } from "./useAkiWallet";

export const useAptos = () => {
  const aptos = useWallet();
  const signMessage = async (message: string) => {
    const payload = {
      message: message,
      nonce: Math.random().toString(16),
    };
    try {
      const result = await aptos.signMessage(payload);
      akiLog(JSON.stringify(result, null, 2));
      return result.signature as string;
    } catch (error: any) {
      akiError(error);
    }
    return "";
  };

  const installed = (wallet_name: WalletName) => {
    const wallet = aptos.wallets.find((e) => e.name === wallet_name);
    if (wallet) {
      return (
        wallet.readyState === WalletReadyState.Loadable ||
        wallet.readyState === WalletReadyState.Installed
      );
    }
    return false;
  };

  const connect = async (wallet_name: WalletName) => {
    if (!installed(wallet_name)) {
      akiError("Not Found " + wallet_name);
      return;
    }
    try {
      await aptos.connect(wallet_name as AptosWalletName);
    } catch (error: any) {
      akiError(error);
    }
  };

  return {
    connect,
    signMessage,
    account: aptos.account,
    wallets: aptos.wallets,
    disconnect: aptos.disconnect,
    installed,
  };
};
