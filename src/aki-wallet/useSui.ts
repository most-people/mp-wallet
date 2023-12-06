import { useWallet } from "@suiet/wallet-kit";
import { WalletName, akiError, akiLog } from "./useAkiWallet";

export const useSui = () => {
  const wallet = useWallet();
  const { select, disconnect, connected } = useWallet();
  const signMessage = async (message: string) => {
    if (!wallet.account) {
      akiError("Not found Wallet account");
      return;
    }

    try {
      const msgBytes = new TextEncoder().encode(message);
      const result = await wallet.signMessage({
        message: msgBytes,
      });
      akiLog(JSON.stringify(result, null, 2));
      return result.signature;
    } catch (error: any) {
      akiError(error);
    }
    return "";
  };

  const connect = async (wallet_name: WalletName) => {
    if (!installed(wallet_name)) {
      akiError("Not Found " + wallet_name);
      return;
    }
    select(wallet_name);
  };

  const installed = (wallet_name: WalletName) => {
    return Boolean(
      wallet.allAvailableWallets.find((e) => e.name === wallet_name)
    );
  };

  return {
    connect,
    disconnect,
    signMessage,
    wallet,
    installed,
  };
};
