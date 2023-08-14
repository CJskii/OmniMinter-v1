import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  goerli,
  mainnet,
  polygonMumbai,
  optimismGoerli,
  arbitrumGoerli,
  sepolia,
  baseGoerli,
  lineaTestnet,
  bscTestnet,
  mantleTestnet,
  metisGoerli,
  polygonZkEvmTestnet,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import Navbar from "../components/Navbar";
import "@fontsource/ibm-plex-mono";
import Image from "next/image";
import Head from "next/head";

// TODO: Add coreDAO chain

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    goerli,
    sepolia,
    arbitrumGoerli,
    optimismGoerli,
    baseGoerli,
    polygonMumbai,
    bscTestnet,
    lineaTestnet,
    polygonZkEvmTestnet,
    mantleTestnet,
    metisGoerli,

    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  projectId: "af8a43a89e4e91e96ced8cf39b3ac9a7",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Head>
          <title>Mintly</title>
          <meta name="description" content="Mintly" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col justify-between items-center min-h-screen font-plex-mono">
          <Navbar />
          <main className="flex flex-col justify-center items-center gap-4 py-8 px-4 rounded-lg my-4 w-full min-h-full">
            <Component {...pageProps} />
          </main>
          <footer className="bg-base-200 min-w-full p-4 flex justify-center items-center">
            {/* <a
              href="https://twitter.com/cjski_web3"
              rel="noopener noreferrer"
              target="_blank"
            >
              Made with ❤️ by CJski
            </a> */}
            <Image
              src="/layerzero.svg"
              width={200}
              height={200}
              alt="layerZero"
              className="py-2"
            />
          </footer>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
