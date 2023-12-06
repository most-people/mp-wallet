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
  const chains = [
    {
      chainId: 5,
      name: "Goerli",
      currency: "ETH",
      explorerUrl: "https://goerli.etherscan.io",
      rpcUrl: "https://rpc.ankr.com/eth_goerli",
    },
    {
      chainId: 1,
      name: "Ethereum",
      currency: "ETH",
      explorerUrl: "https://etherscan.io",
      rpcUrl: "https://cloudflare-eth.com",
    },
  ];

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

  const changeNetwork = () => {
    open({ view: "Networks" });
  };

  const installed = (wallet_name: WalletName) => {
    if (wallet_name === 'WalletConnect') {
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

  return {
    account,
    connect,
    disconnect,
    signMessage,
    sendNativeToken,
    sendERC20Token,
    changeNetwork,
    walletProvider,
    installed,
  };
};
