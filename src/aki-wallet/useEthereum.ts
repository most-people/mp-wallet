// useEthereum
import { ethers, BrowserProvider } from "ethers";
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  //   useWeb3ModalEvents,
  //   useWeb3ModalState,
  //   useWeb3ModalTheme,
  useWeb3ModalAccount,
  useDisconnect,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { WalletName, akiError, akiLog } from "./useAkiWallet";
import { useMemo } from "react";

export interface NativeTokenData {
  toAddress: string;
  toAmount: string;
}
export interface ERC20TokenData {
  toAddress: string;
  tokenAddress: string;
  toAmount: string;
  decimal?: number;
}

export const web3modalMetadata = {
  name: "Aki Wallet",
  description: "Aki Protocol Wallet",
  url: "https://aki-web.vercel.app",
  icons: [
    "https://imagedelivery.net/_aTEfDRm7z3tKgu9JhfeKA/a73e70dd-6a94-44c3-f749-c8d2076f4600/lg",
  ],
};

export const useEthereum = () => {
  // Set chains
  const mainnet = [
    {
      chainId: 1,
      name: "Ethereum",
      currency: "ETH",
      explorerUrl: "https://etherscan.io",
      rpcUrl: "https://cloudflare-eth.com",
    },
    {
      chainId: 56,
      name: "BNB Smart Chain",
      currency: "BNB",
      explorerUrl: "https://bscscan.com",
      rpcUrl: "https://binance.llamarpc.com",
    },
    {
      chainId: 137,
      name: "Polygon",
      currency: "MATIC",
      explorerUrl: "https://polygonscan.com",
      rpcUrl: "https://polygon-rpc.com",
    },
    {
      chainId: 169,
      name: "Manta Pacific",
      currency: "ETH",
      explorerUrl: "https://pacific-explorer.manta.network",
      rpcUrl: "https://pacific-rpc.manta.network/http",
    },
    {
      chainId: 204,
      name: "opBNB",
      currency: "BNB",
      explorerUrl: "https://mainnet.opbnbscan.com",
      rpcUrl: "https://opbnb.publicnode.com",
    },
    {
      chainId: 324,
      name: "zkSync",
      currency: "ETH",
      explorerUrl: "https://explorer.zksync.io",
      rpcUrl: "https://zksync-era.blockpi.network/v1/rpc/public",
    },
    {
      chainId: 42161,
      name: "Arbitrum One",
      currency: "ETH",
      explorerUrl: "https://arbiscan.io",
      rpcUrl: "https://arbitrum.llamarpc.com",
    },
    {
      chainId: 59144,
      name: "Linea",
      currency: "ETH",
      explorerUrl: "https://lineascan.build",
      rpcUrl: "https://linea.blockpi.network/v1/rpc/public",
    },
    {
      chainId: 3,
      name: "Ropsten",
      currency: "ETH",
      explorerUrl: "https://ropsten.etherscan.io",
      rpcUrl: "https://rpc.ankr.com/eth_ropsten",
    },
  ];

  const testnet = [
    {
      chainId: 5,
      name: "Goerli",
      currency: "ETH",
      explorerUrl: "https://goerli.etherscan.io",
      rpcUrl: "https://rpc.ankr.com/eth_goerli",
    },
    {
      chainId: 80001,
      name: "Mumbai",
      currency: "MATIC",
      explorerUrl: "https://mumbai.polygonscan.com",
      rpcUrl: "https://rpc-mumbai.maticvigil.com",
    },
    {
      chainId: 97,
      name: "BNB Smart Chain Testnet",
      currency: "tBNB",
      explorerUrl: "https://testnet.bscscan.com",
      rpcUrl: "https://endpoints.omniatech.io/v1/bsc/testnet/public",
    },
    {
      chainId: 300,
      name: "zkSync Sepolia Testnet",
      currency: "ETH",
      explorerUrl: "https://sepolia.explorer.zksync.io",
      rpcUrl: "https://sepolia.era.zksync.dev",
    },
  ];

  const chains = [...mainnet, ...testnet];

  const ethersConfig = defaultConfig({
    metadata: web3modalMetadata,
    defaultChainId: chains[0].chainId,
    rpcUrl: chains[0].rpcUrl,
  });

  // Create modal
  createWeb3Modal({
    ethersConfig,
    chains,
    projectId: "e6c2a442fa23440bfa405c0781315b15",
    chainImages: {
      204: "/chains/bnb-logo.svg",
      59144: "/chains/rsz_linea.webp",
      169: "/chains/rsz_manta.webp",
      3: "/chains/unknown-logo.png",
      5: "/chains/unknown-logo.png",
      80001: "/chains/unknown-logo.png",
      97: "/chains/unknown-logo.png",
      300: "/chains/unknown-logo.png",
    },
    // enableAnalytics: true,
    // themeMode: 'dark',
    // themeVariables: {
    //   '--w3m-color-mix': '#7EFE19',
    //   '--w3m-color-mix-strength': 20
    // }
  });

  // 4. Use modal hook
  // const state = useWeb3ModalState();
  // const theme = useWeb3ModalTheme();
  // const events = useWeb3ModalEvents();
  const account = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { walletProvider } = useWeb3ModalProvider();

  const openWalletSchema = async () => {
    try {
      const deepLink = window.localStorage.getItem(
        "WALLETCONNECT_DEEPLINK_CHOICE"
      );
      if (deepLink) {
        const schema = JSON.parse(deepLink).href;
        if (schema) {
          window.open(schema, "_blank");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const signMessage = async (message: string) => {
    if (!walletProvider) {
      akiError("Not found Wallet Provider");
      return;
    }
    const provider = new BrowserProvider(walletProvider);
    try {
      // 请求用户的账户
      // await provider.send("eth_requestAccounts", []);

      // 获取签名者
      const signer = await provider.getSigner();

      // 移动端打开 app
      openWalletSchema();

      const sig = await signer.signMessage(message);
      akiLog("Sig: " + sig);
      return sig;
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message?.slice(0, error.message.indexOf("(")) ||
        "";
      akiError("Sign Message Error: " + message);
    }
    return "";
  };
  const sendNativeToken = async (data: NativeTokenData) => {
    if (!walletProvider) {
      akiError("Not found Wallet Provider");
      return;
    }

    const { toAddress, toAmount } = data;

    // 假设你已经有一个 Web3Provider 实例
    const provider = new BrowserProvider(walletProvider);

    // 请求用户的账户
    // await provider.send("eth_requestAccounts", []);

    // 获取签名者
    const signer = await provider.getSigner();

    // 创建交易对象
    const transaction = {
      to: toAddress, // 替换为接收者的地址
      value: ethers.parseEther(toAmount), // 发送的 ETH 数量，这里是 0.01 ETH
      // 你还可以添加其他字段，如 gasLimit, gasPrice, data 等
    };

    try {
      // 移动端打开 app
      openWalletSchema();

      // 发送交易
      const tx = await signer.sendTransaction(transaction);

      akiLog("Transaction hash: " + tx.hash);

      // 等待交易被挖掘
      tx.wait().then((receipt: any) => {
        akiLog("Transaction was mined in block: " + receipt?.blockNumber);
      });

      return tx.hash;
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message?.slice(0, error.message.indexOf("(")) ||
        "";
      akiError("Transaction Error: " + message);
    }
    return "";
  };
  const sendERC20Token = async (data: ERC20TokenData) => {
    if (!walletProvider) {
      akiError("Not found Wallet Provider");
      return;
    }

    const { toAddress, tokenAddress, toAmount, decimal } = data;

    // ERC20 代币合约地址和 ABI
    const tokenABI = [
      // 只需要包含 transfer 函数的 ABI
      "function transfer(address to, uint amount) returns (bool)",
    ];

    // 连接到以太坊钱包
    const provider = new BrowserProvider(walletProvider);

    // await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();

    // 创建 ERC20 代币合约实例
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

    // 要发送的代币数量（需要考虑代币的小数位数）
    const amount = ethers.parseUnits(toAmount, decimal || 18);

    try {
      // 移动端打开 app
      openWalletSchema();

      // 执行转账
      const tx = await tokenContract.transfer(toAddress, amount);
      akiLog("Transaction hash: " + tx.hash);

      // 等待交易被挖掘
      tx.wait().then((receipt: any) => {
        akiLog("Transaction confirmed in block: " + receipt.blockNumber);
      });

      return tx.hash;
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message?.slice(0, error.message.indexOf("(")) ||
        "";
      akiError("Transaction Error: " + message);
    }
    return "";
  };

  const changeChain = () => {
    open({ view: "Networks" });
  };

  const installed = (wallet_name: WalletName) => {
    if (wallet_name === "WalletConnect") {
      return true;
    } else if (wallet_name === "MetaMask") {
      if ("ethereum" in window) {
        const ethereum = window.ethereum as any;
        return ethereum?.isMetaMask === true;
      }
    } else if (wallet_name === "OKX Wallet") {
      if ("okexchain" in window) {
        return true;
      }
    }
    return false;
  };

  const connect = async (wallet_name: WalletName) => {
    if (!installed(wallet_name)) {
      akiError("Not Found " + wallet_name);
      return;
    }
    open({ view: "Connect" });
  };

  const chainId = useMemo(() => {
    return account.chainId;
  }, [account.chainId]);

  const chainName = useMemo(() => {
    return (
      chains.find((chain) => chain.chainId === account.chainId)?.name || ""
    );
  }, [account.chainId]);

  return {
    account,
    connect,
    disconnect,
    signMessage,
    sendNativeToken,
    sendERC20Token,
    changeChain,
    walletProvider,
    installed,
    chainId,
    chainName,
    chains,
  };
};
