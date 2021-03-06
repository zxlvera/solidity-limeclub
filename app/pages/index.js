import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { BigNumber, providers, Contract } from "ethers";
import Web3Modal from "web3modal";
import { useState, useEffect } from "react";
import SqueezeContract from "../utils/SqueezePortal.json";
import { SQUEEZE_CONTRACT_ADDRESS } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [squeezeCount, setSqueezeCount] = useState(0);
  const [allSqueezes, setAllSqueezes] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const contractABI = SqueezeContract.abi;

  // Web3Modal to get Provider or Signer
  const getProviderOrSigner = async (needSigner = false) => {
    const web3Modal = new Web3Modal({
      network: "rinkeby",
      providerOptions: {},
      disableInjectedProvider: false,
      theme: "dark",
    });

    const instance = await web3Modal.connect();
    const provider = new providers.Web3Provider(instance);
    const { chainId } = await provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = provider.getSigner();
      return signer;
    }

    return provider;
  };

  // Functions - Connect Wallet when user lands on page
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  // Functions - user clicks Squeeze()
  const squeeze = async (event) => {
    event.preventDefault();

    try {
      const signer = await getProviderOrSigner(true);
      const squeezeContract = new Contract(
        SQUEEZE_CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      const tx = await squeezeContract.squeeze(message, { gasLimit: 300000 });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      getTotalSqueezes();
      getAllSqueezes();
    } catch (error) {
      setLoading(false);
      setError(error);
      console.log(error);
    }
  };

  // Function - get All Squeezes
  const getAllSqueezes = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const squeezeContract = new Contract(
        SQUEEZE_CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      const squeezes = await squeezeContract.getAllSqueezes();

      let squeezeCleaned = [];
      squeezes.forEach((squeeze) => {
        squeezeCleaned.push({
          address: squeeze.squeezer,
          timestamp: new Date(squeeze.timestamp * 1000).toLocaleString(),
          message: squeeze.message,
        });
      });
      console.log(squeezeCleaned);
      setAllSqueezes([...squeezeCleaned].reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalSqueezes = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const squeezeContract = new Contract(
        SQUEEZE_CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      const currentSqueezeCount = await squeezeContract.getTotalSqueezes();
      setSqueezeCount(currentSqueezeCount.toString());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let squeezeContract;

    const onNewSqueeze = (from, timestamp, message) => {
      setAllSqueezes((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (!walletConnected) {
      connectWallet();
    } else {
      getTotalSqueezes();
      getAllSqueezes();
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const squeezeContract = new Contract(
          SQUEEZE_CONTRACT_ADDRESS,
          contractABI,
          signer
        );
        squeezeContract.on("NewSqueeze", onNewSqueeze);
      } catch (error) {
        console.log(error);
      }
    }

    return () => {
      if (squeezeContract) {
        squeezeContract.off("NewSqueeze", onNewSqueeze);
      }
    };
  }, [walletConnected]);

  const renderButton = () => {
    if (walletConnected) {
      return (
        <div>
          <div>
            <form onSubmit={squeeze} className={styles.form}>
              <input
                placeholder="tell me a secret"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              ></input>
              <br></br>
              <button type="submit">???????????? Squeeze! ???????????? </button>
            </form>
            {loading && <span>loading...</span>}
            {error && <span>Wait for 15mins to send again!</span>}
          </div>
          <div>
            <h2>{squeezeCount} limes squeezed</h2>
          </div>
          <div>
            {allSqueezes.map((squeeze, index) => {
              return (
                <div className={styles.card} key={index}>
                  <p className={styles.code}>{squeeze.message}</p>
                  <pre className={styles.details}>
                    {squeeze.timestamp.toString()}
                  </pre>
                  <pre className={styles.details}>{squeeze.address}</pre>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return <button onClick={connectWallet}>Connect your wallet</button>;
    }
  };

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/MontserratAlternates-Regular.ttf"
          as="font"
          crossOrigin=""
        />
      </Head>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.grid}>
            <div>
              <div className={styles.title}>
                ???????? Welcome to Lime Club! ????????
              </div>
              <div className={styles.description}>
                <p>Heya these messages are stored on the blockchain!</p>
                <p>Build with Solidity Smart Contract</p>
              </div>
            </div>
            {renderButton()}
          </div>
        </div>
        <footer className={styles.footer}>Made by moonplant#5230</footer>
      </div>
    </>
  );
}
