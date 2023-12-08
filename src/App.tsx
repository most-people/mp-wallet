import { useState } from "react";

import logo from "./logo.svg";
import "./App.css";
import { useAkiWallet } from "./aki-wallet/useAkiWallet";

export default function App() {
  const [toAddress, setToAddress] = useState(
    "0xb3D7e9b7de14477399232326B33B221316d8765F"
  );
  const [tokenAddress, setTokenAddress] = useState(
    "0xF789578a6E5794BE065FedcFe76dEAC44380C4dC"
  );
  const [toAmount, setToAmount] = useState("0.001");

  const aki = useAkiWallet();

  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <p>Aki Protocol | Web3 Influencer Marketing, Rewards & Data</p>
      </header>
      <main>
        <code>
          {aki.platform}: {aki.walletName}
        </code>
        <br />
        <code>Address: {aki.address}</code>
        <br />
        <code>Chain ID: {aki.chainId}</code>
        <br />
        <code>Chain Name: {aki.chainName}</code>
        <br />
        <br />
        {aki.address ? (
          <>
            <button onClick={() => aki.disconnect()}>Disconnect</button>
            <button onClick={() => aki.signMessage("Hello! Aki Protocol")}>
              Sign Message
            </button>
            {aki.platform === "Ethereum" && (
              <>
                <button onClick={() => aki.changeChain()}>
                  Choose Network
                </button>
                <button
                  onClick={() => aki.sendNativeToken({ toAddress, toAmount })}
                >
                  Send Native Token
                </button>
                <button
                  onClick={() =>
                    aki.ethereum.sendERC20Token({
                      toAddress,
                      toAmount,
                      tokenAddress,
                      decimal: 18,
                    })
                  }
                >
                  Send ERC20 Token
                </button>
                <br />
                <br />
                <pre>
                  <code>ERC20 Token Address:</code>
                </pre>
                <input
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="ERC20 Token Address"
                />

                <pre>
                  <code>Send to Address:</code>
                </pre>
                <input
                  type="text"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="Send to Address"
                />

                <pre>
                  <code>Send to Amount:</code>
                </pre>
                <input
                  type="text"
                  value={toAmount}
                  onChange={(e) => setToAmount(e.target.value)}
                  placeholder="Send to Amount"
                />
              </>
            )}

            {aki.platform === "Cosmos" && (
              <>
                <br />
                <code>Choose Network</code>
                <br />
                <br />
                <button onClick={() => aki.cosmos.changeChain("Dora Vota")}>
                  Dora Vota
                </button>
                <button onClick={() => aki.cosmos.changeChain("Kava")}>
                  Kava
                </button>
                <button onClick={() => aki.cosmos.changeChain("Injective")}>
                  Injective
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <button onClick={() => aki.connect("WalletConnect")}>
              WalletConnect
            </button>
            <button onClick={() => aki.connect("MetaMask")}>MetaMask</button>{" "}
            {aki.installed("MetaMask") ? "" : "Not installed"}
            <button onClick={() => aki.connect("OKX Wallet")}>
              OKX Wallet
            </button>{" "}
            {aki.installed("OKX Wallet") ? "" : "Not installed"}
            <br />
            <button onClick={() => aki.connect("Sui Wallet")}>
              Sui Wallet
            </button>{" "}
            {aki.installed("Sui Wallet") ? "" : "Not installed"}
            <button onClick={() => aki.connect("Martian Sui Wallet")}>
              Martian Sui Wallet
            </button>{" "}
            {aki.installed("Martian Sui Wallet") ? "" : "Not installed"}
            <br />
            <button onClick={() => aki.connect("Petra")}>Petra</button>{" "}
            {aki.installed("Petra") ? "" : "Not installed"}
            <button onClick={() => aki.connect("Martian")}>Martian</button>{" "}
            {aki.installed("Martian") ? "" : "Not installed"}
            <br />
            <button onClick={() => aki.connect("Keplr")}>Keplr</button>{" "}
            {aki.installed("Keplr") ? "" : "Not installed"}
          </>
        )}
      </main>
      <footer>
        <br />
        <a
          className="App-link"
          href="https://akiprotocol.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          @2023 AkiProtocol.io丨Version 12.06.21.12
        </a>
      </footer>
    </div>
  );
}
