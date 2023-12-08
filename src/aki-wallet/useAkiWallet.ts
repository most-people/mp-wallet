// useSui
import { useMemo, useState } from "react";
import { NativeTokenData, useEthereum } from "./useEthereum";
import { useSui } from "./useSui";
import { useAptos } from "./useAptos";
import { useCosmos } from "./useCosmos";

export type WalletName =
  | ""
  // Ethereum
  | "MetaMask"
  | "WalletConnect"
  | "OKX Wallet"
  // Aptos
  | "Petra"
  | "Martian"
  // Sui
  | "Martian Sui Wallet"
  | "Sui Wallet"
  // Cosmos
  | "Keplr";

export type Platform = "" | "Ethereum" | "Aptos" | "Sui" | "Cosmos";

export const akiError = (message: string) => {
  console.error(message);
  alert(message);
};
export const akiLog = (message: string) => {
  console.log(message);
  alert(message);
};

const getPlatform = (wallet_name?: WalletName): Platform => {
  const w = wallet_name || localStorage.getItem("wallet_name") || "";
  if (w === "MetaMask" || w === "WalletConnect" || w === "OKX Wallet") {
    return "Ethereum";
  } else if (w === "Petra" || w === "Martian") {
    return "Aptos";
  } else if (w === "Martian Sui Wallet" || w === "Sui Wallet") {
    return "Sui";
  } else if (w === "Keplr") {
    return "Cosmos";
  }
  return "";
};

export const useAkiWallet = () => {
  const ethereum = useEthereum();
  const sui = useSui();
  const aptos = useAptos();
  const cosmos = useCosmos();

  const [walletName, setWalletName] = useState<WalletName>("");

  const platform = useMemo(() => {
    return getPlatform(walletName);
  }, [walletName]);

  const chainId = useMemo(() => {
    if (platform === "Ethereum") {
      return ethereum.chainId;
    } else if (platform === "Aptos") {
      return aptos.chainId;
    } else if (platform === "Cosmos") {
      return cosmos.chainId;
    } else if (platform === "Sui") {
      return sui.chainId;
    }
    return "";
  }, [ethereum.chainId, aptos.chainId, cosmos.chainId, sui.chainId]);

  const chainName = useMemo(() => {
    if (platform === "Ethereum") {
      return ethereum.chainName;
    } else if (platform === "Aptos") {
      return aptos.chainName;
    } else if (platform === "Cosmos") {
      return cosmos.chainName;
    } else if (platform === "Sui") {
      return sui.chainName;
    }
    return "";
  }, [ethereum.chainName, aptos.chainName, cosmos.chainName, sui.chainName]);

  const address = useMemo(() => {
    return (
      ethereum.account.address ||
      aptos.account?.address ||
      sui.wallet.address ||
      cosmos.wallet.address ||
      ""
    );
  }, [
    ethereum.account.address,
    sui.wallet.address,
    aptos.account?.address,
    cosmos.wallet.address,
  ]);

  const connect = async (wallet_name: WalletName) => {
    setWalletName(wallet_name);
    localStorage.setItem("wallet_name", wallet_name);
    const platform = getPlatform(wallet_name);
    if (platform === "Ethereum") {
      ethereum.connect(wallet_name);
    } else if (platform === "Aptos") {
      aptos.connect(wallet_name);
    } else if (platform === "Sui") {
      sui.connect(wallet_name);
    } else if (platform === "Cosmos") {
      cosmos.connect(wallet_name);
    }
  };

  const disconnect = async () => {
    setWalletName('')
    localStorage.removeItem("wallet_name");
    try {
      await Promise.all([
        ethereum.disconnect(),
        sui.disconnect(),
        aptos.disconnect(),
        cosmos.disconnect(),
      ]);
    } catch (error) {
      // console.log("error", error);
    }
  };

  const signMessage = (message: string) => {
    const platform = getPlatform(walletName);
    if (platform === "Ethereum") {
      return ethereum.signMessage(message);
    } else if (platform === "Aptos") {
      return aptos.signMessage(message);
    } else if (platform === "Sui") {
      return sui.signMessage(message);
    } else if (platform === "Cosmos") {
      return cosmos.signMessage(message);
    }
  };

  const sendNativeToken = (data: NativeTokenData) => {
    const platform = getPlatform(walletName);
    if (platform === "Ethereum") {
      ethereum.sendNativeToken(data);
    } else if (platform === "Aptos") {
      //
    } else if (platform === "Sui") {
      //
    } else if (platform === "Cosmos") {
      //
    }
  };

  const changeChain = () => {
    const platform = getPlatform(walletName);
    if (platform === "Ethereum") {
      ethereum.changeChain();
    } else if (platform === "Aptos") {
      //
    } else if (platform === "Sui") {
      //
    } else if (platform === "Cosmos") {
      //
    }
  };

  const installed = (wallet_name: WalletName) => {
    const platform = getPlatform(wallet_name);
    if (platform === "Ethereum") {
      return ethereum.installed(wallet_name);
    } else if (platform === "Aptos") {
      return aptos.installed(wallet_name);
    } else if (platform === "Sui") {
      return sui.installed(wallet_name);
    } else if (platform === "Cosmos") {
      return cosmos.installed(wallet_name);
    }
  };

  return {
    platform,
    getPlatform,
    walletName,
    address,
    connect,
    disconnect,
    signMessage,
    sendNativeToken,
    installed,
    changeChain,
    chainId,
    chainName,
    // Ethereum
    ethereum,
    // Sui
    sui,
    // Aptos
    aptos,
    // Cosmos
    cosmos,
  };
};
