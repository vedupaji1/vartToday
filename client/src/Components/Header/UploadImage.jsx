import React, { useState, useContext } from "react";
import { requiredInfo } from "../../App";
import SelectPosition from "./SelectPosition";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from 'ipfs-http-client' // This Line Of Code Is Taken From "https://github.com/dappuniversity/nft_marketplace/blob/main/src/frontend/components/Create.js", Basically Web3.Storage Was Not Working With ReactJs Because Of This We Are Using IPFS-Client.
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const UploadImage = () => {
    let contextData = useContext(requiredInfo);
    const [isSetTopData, setIsSetTopData] = useState(false);
    const [topDataPosition, setTopDataPosition] = useState(null);
    const [topDataPrice, setTopDataPrice] = useState(null);
    const [bidInterval, setBidInterval] = useState(null);
    const storeData = async () => {
        if (document.getElementById("getFileInp").value !== "" && document.getElementById("getFileInp").value !== " ") {
            if (document.getElementById("imageDescription").value.trim() !== "") {
                let filePath = document.querySelector('input[type="file"]').files[0];
                if ((filePath.name.indexOf(" ") === -1) && ((filePath.type === "image/jpeg") || (filePath.type === "image/png") || (filePath.type === "image/svg+xml"))) {
                    if (isSetTopData === true) {
                        if ((topDataPosition !== null) && (topDataPosition > 0 && topDataPosition <= 10)) {
                            let userEnteredBidValue = ethers.utils.parseEther(document.getElementById("bidValueTakerInp").value);
                            if (userEnteredBidValue > topDataPrice[topDataPosition - 1]) {
                                if (userEnteredBidValue % bidInterval === 0) {
                                    alert("Your Data Image Is Uploading");
                                    contextData.loading.setShouldLoad(true);
                                    let dataDescription = document.getElementById("imageDescription").value.trim();
                                    const result = await client.add(filePath)
                                    let mainData = "https://ipfs.io/ipfs/" + result.path;
                                    console.log(mainData);
                                    let res = await contextData.contract.setTopData(topDataPosition, mainData, dataDescription, { value: userEnteredBidValue });
                                    await res.wait();
                                    alert("Your Data Image Is Uploaded");
                                    contextData.loading.setShouldLoad(false);
                                    window.location.reload();
                                } else {
                                    alert("Your Bid Value Should Divisible By " + bidInterval);
                                }
                            } else {
                                alert("Your Bid Value Should Higher Than " + (topDataPrice[topDataPosition - 1]) + " Wei  And It Should Divisible By " + bidInterval);
                            }
                        } else {
                            alert("Please Select TopData Position");
                        }
                    } else if (isSetTopData === false) {
                        try {
                            alert("Your Data Image Is Uploading");
                            contextData.loading.setShouldLoad(true);
                            let dataDescription = document.getElementById("imageDescription").value.trim();
                            const result = await client.add(filePath)
                            let mainData = "https://ipfs.io/ipfs/" + result.path;
                            console.log(mainData);
                            let res = await contextData.contract.setData(mainData, dataDescription);
                            await res.wait();
                            alert("Your Data Image Is Uploaded");
                            contextData.loading.setShouldLoad(false);
                            window.location.reload();
                        } catch (error) {
                            console.log(error);
                        }
                    }
                } else {
                    alert("Invalid File Path Or Type, Your File Should Not Contain Spaces And They Should Image File");
                }
            } else {
                alert("Please Enter Description");
            }
        } else {
            alert("Please Choose File");
        }
    }

    return (
        <>
            <div className="uploadImageMain">
                <div className="uploadImageSub">
                    <div className="closeUploadIcon">
                        <i onClick={() => {
                            contextData.imageUpload.setIsImageUpload(false)
                        }} className="fa fa-close" aria-hidden="true"></i>
                    </div>
                    <div className="uploadImageSubPart">
                        <h1 className="fileNameShower" style={{ paddingLeft: "2rem" }}> </h1>
                        <label htmlFor="getFileInp" className="getFile">Select <i className="fa fa-file-image-o" aria-hidden="true"></i></label>
                        <input onChange={(e) => {
                            document.getElementsByClassName("fileNameShower")[0].innerText = document.querySelector('input[type="file"]').files[0].name
                        }} type="file" style={{ visibility: "hidden" }} name="getFile" id="getFileInp" placeholder="Select" />

                        <div className="checkIsSetTopDataDiv">
                            <label htmlFor="isSetTopData">Set TopData <i style={{
                                display: isSetTopData === true ? "inline-block" : "none"
                            }} className="fa fa-check" id="checkBoxStatusShower" aria-hidden="true"></i></label>
                            <input onChange={(e) => {
                                document.getElementById("isSetTopData").checked === true ?
                                    setIsSetTopData(true) :
                                    setIsSetTopData(false)
                            }} type="checkbox" id="isSetTopData" />
                        </div>

                        {
                            isSetTopData === true ?
                                <div className="topDataPosAndBidInpSub">
                                    <SelectPosition
                                        setTopDataPosition={setTopDataPosition}
                                        topDataPrice={topDataPrice}
                                        setTopDataPrice={setTopDataPrice}
                                        bidInterval={bidInterval}
                                        setBidInterval={setBidInterval} />
                                    <input type="number" placeholder="Enter Bid Value In ETH" name="bidValueTakerInp" id="bidValueTakerInp" />
                                </div>
                                : <></>
                        }

                        <textarea onChange={() => {
                            document.getElementById("imageDescription").style.height = "auto"
                            document.getElementById("imageDescription").style.height = document.getElementById("imageDescription").scrollHeight / 10 + "rem";
                        }} name="imageDescription" id="imageDescription"></textarea>
                        <button className="imageUploadSubmit" onClick={() => storeData()}>Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default UploadImage;