import { NFTCard } from '../components/nftCard'
import { useState } from 'react'
import axios from 'axios';

const Home = () => {
  const[wallet, setWallet] = useState("");
  const[collection, setCollection] = useState("");
  const[NFTs, setNFTs] = useState([]);
  const[fetchForCollection, setFetchForCollection] = useState(false);

  const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTsForCollection/`;

  const fetchNFTs = async() => {
    let nfts; 
    console.log("fetching nfts");
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTs/`;
    var requestOptions = {
        method: 'GET'
      }; 
    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts= await fetch(fetchURL, requestOptions).then(data => data.json())
    }
  
    if (nfts) {
      console.log("nfts:", nfts.ownedNfts)
      setNFTs(nfts.ownedNfts)
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts)
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input className="w-2/5 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm" disabled={fetchForCollection} onChange={(e) => {setWallet(e.target.value)}} value={wallet} placeholder="wallet address"></input>
        <input className="w-2/5 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm" onChange={(e) => {setCollection(e.target.value)}} value={collection} type={"text"}placeholder="collection address"></input>
        <label className=' text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-slate-200'><input type={"checkbox"} onChange={(e) => {setFetchForCollection(e.target.checked)}} value={fetchForCollection} ></input>  Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={() => {
          if(fetchForCollection)
            fetchNFTsForCollection();
          else 
            fetchNFTs();
          }
        }>
          Let's go!
        </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map((nft, index) => {
            return (
              <NFTCard key={index} nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home
