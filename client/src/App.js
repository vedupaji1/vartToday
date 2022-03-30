import React, { useState, useEffect, createContext } from 'react'
import { ethers } from "ethers";
import topToday from "./contract/topToday.json";
import Header from "./Components/Header/Header";
import Error404 from "./Components/Error404"
import MainDashboardComponent from './Components/MainDashboardComponent';
import './App.css';
import { Route, Switch } from "react-router-dom";

const requiredInfo = createContext();
const App = () => {
  const [userData, setUserData] = useState(null);
  const [ETHContract, setETHContract] = useState(null); // It Will Hold Instance Of Our Contract And Using "ETHContract" We Can Call Any Method Of Our Solidity Contract. 
  const [isMetamask, setIsMetamask] = useState(null);
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [shouldCreateAccount, setShouldCreateAccount] = useState(false);

  const reloadPage = () => {
    window.location.reload();
  }

  if (window.ethereum) { // This Statement Will Caught When Account Will Changed In Metamask.
    window.ethereum.on('accountsChanged', () => reloadPage());
  }

  useEffect(() => {
    const init = async () => {
      if ((window.ethereum !== undefined)) { // This Statement Checks That Whether User Have Metamask Or Not,  
        setIsMetamask(true);
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        await provider.send("eth_requestAccounts", []); // It Will Send Request For Connecting To Metamask.
        const signer = provider.getSigner();
        const contractAddress = "0xfE42adBBDa7e03471034B31787AFFa8A53a3a716";
        let contract = new ethers.Contract(contractAddress, topToday.abi, signer)
        try {
          setETHContract(contract);
          setUserData(await contract.getData(((await contract.usersData(await signer.getAddress(), 0))[1])));
        } catch (error) {
          setUserData(false);
        }
      } else {
        setIsMetamask(false);
        let provider = ethers.getDefaultProvider("ropsten");
        // let provider = new InfuraProvider("ropsten");
        let wallet = new ethers.Wallet("0xaeb9ba5c292d59456a378c2112d66b87a1c898afd58aa2fc5b3ad44b61033627");
        let signer = wallet.connect(provider)
        const contractAddress = "0xfE42adBBDa7e03471034B31787AFFa8A53a3a716";
        let contract = new ethers.Contract(contractAddress, topToday.abi, signer);
        setETHContract(contract)
        alert("Please Install Metamask For Managing Account On VARt TopToday");
      }
    }
    init();
    
  }, [])

  return (
    <>
      <requiredInfo.Provider
        value={{
          contract: ETHContract,
          userData: userData,
          isMetamask: isMetamask,
          imageUpload: { isImageUpload: isImageUpload, setIsImageUpload: setIsImageUpload },
          createAccount: { shouldCreateAccount: shouldCreateAccount, setShouldCreateAccount: setShouldCreateAccount },
          loading: { shouldLoad: shouldLoad, setShouldLoad: setShouldLoad }
        }}>
        <Header />
        <Switch>
          <Route exact path='/:username?'>
            <MainDashboardComponent />
          </Route>
          <Route>
            <Error404 />
          </Route>
        </Switch>
      </requiredInfo.Provider>
    </>
  )
}

export default App;
export { requiredInfo };
