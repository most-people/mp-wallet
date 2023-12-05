import React from "react";
import ReactDOM from "react-dom/client";
// sui
import { WalletProvider, SuiWallet } from "@suiet/wallet-kit";
// aptos
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// cosmos
import { ChainProvider } from "@cosmos-kit/react-lite";
import { chains, assets } from "chain-registry";
import { wallets } from "@cosmos-kit/keplr";

import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const AptosWallet = [new MartianWallet(), new PetraWallet()];

root.render(
  <React.StrictMode>
    <ChainProvider chains={chains} assetLists={assets} wallets={wallets}>
      <WalletProvider defaultWallets={[SuiWallet]}>
        <AptosWalletAdapterProvider
          plugins={AptosWallet}
          autoConnect
          onError={(error) => {
            console.log("Custom error handling", error);
          }}
        >
          <App />
        </AptosWalletAdapterProvider>
      </WalletProvider>
    </ChainProvider>
  </React.StrictMode>
);
