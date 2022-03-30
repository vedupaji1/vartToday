import React, { useState, useEffect, useContext } from "react";
import { requiredInfo } from "../../App";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import topToday from "../../contract/topToday.json"
const Dashboard = () => {
    const [topData, setTopData] = useState(null);
    const [publishersProfile, setPublishersProfile] = useState(null);

    let contextData = useContext(requiredInfo);
    //console.log(contextData);

    const getPublisherProfile = async (tempData) => {
        let tempPublishersName = [];
        let tempPublishersProfile = [];
        for (let i = 0; i < 10; i++) {
            if (tempData[i][0] !== "") {
                if (tempPublishersName.indexOf(tempData[i][0]) === -1) {
                    tempPublishersName.push(tempData[i][0]);
                    let publisherProfile = await contextData.contract.getData(tempData[i][0]);
                    tempPublishersProfile.push(publisherProfile[publisherProfile.length - 1][1]);
                } else {
                    tempPublishersProfile.push(tempPublishersProfile[tempPublishersName.indexOf(tempData[i][0])]);
                }
            } else {
                tempPublishersProfile.push("");
            }
        }
        setPublishersProfile(tempPublishersProfile)
    }

    useEffect(async () => {
        const init = async () => {
            if ((topData === null) && (contextData.contract !== null)) {
                try {
                    let tempTopData = await contextData.contract.getTopData();
                    // contextData.loading.setShouldLoad(false);
                    setTopData(tempTopData);
                    await getPublisherProfile(tempTopData);
                    // console.log(await contract.setTopData(2, "https://ipfs.io/ipfs/bafybeienjmr3sety436mjyjdltnb766n46sn47wtynezlclgewjyzuitra/C85JZOPXUAEnB-P.jpg", "This Is Image Of Carryminati", { value: "100000000002" }))
                    // console.log(await contract.getTopDataItemsPrice());
                    // console.log(await contract.totalDataItems());
                    /*
                    https://ipfs.io/ipfs/bafybeidk4dztwtk3ezxvf4j64qhxnlks5ptktmndpsa3vqgxz4pewkoeja/tempImg.png --
                    https://ipfs.io/ipfs/bafybeiem4z37z2xn5izx4s5azblsh6f2z2rs2l65xu3gao3qdczkohs56e/japanFlag.png 
                    https://ipfs.io/ipfs/bafybeif5q5vmm2cbqoafo5fpdmruezjum7da7a26mptql7thaavmdooasy/carryminati-1.jpg
                    https://ipfs.io/ipfs/bafybeicsh2nvqkcikgsqtz2gihhkdoa6ivpbmjdgh65oj2tqars7whm6fy/triggered%20insaan.jpg
                    https://ipfs.io/ipfs/bafybeienjmr3sety436mjyjdltnb766n46sn47wtynezlclgewjyzuitra/C85JZOPXUAEnB-P.jpg --
                    */
                } catch (error) {
                    console.log(error);
                }
            }
        }
        init();
    })

    const changeAboutBoxHeight = (pos) => {
        if (document.getElementsByClassName("mainAboutData")[pos].style.maxHeight !== "none") {
            document.getElementsByClassName("mainAboutData")[pos].style.maxHeight = "none";
            document.getElementsByClassName("readMoreOption")[pos].children[0].innerText = "Read Less";
        } else {
            document.getElementsByClassName("mainAboutData")[pos].style.maxHeight = "3.5rem";
            document.getElementsByClassName("readMoreOption")[pos].children[0].innerText = "Read More";
        }

    }
    const getProperDate = (unfilteredDate) => {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let tempDate = new Date(unfilteredDate);
        let curDate = new Date();
        if (curDate.getFullYear() > tempDate.getFullYear()) {
            return tempDate.getDate() + "th " + months[tempDate.getMonth()] + " " + tempDate.getFullYear();
        } else if (curDate.getMonth() > tempDate.getMonth() || curDate.getDate() > tempDate.getDate()) {
            return tempDate.getDate() + "th " + months[tempDate.getMonth()];
        } else {
            return tempDate.getHours() + ":" + tempDate.getMinutes();
        }
    }

    const copyImageUrl = async (i) => {
        let imageURL = document.getElementsByClassName("mainImageData")[i].children[0].src;
        if (imageURL !== "") {
            await navigator.clipboard.writeText(imageURL);
            alert("Image URL Is Copied To Your Clipboard");
        } else {
            alert("Wait For Few Seconds");
        }
    }

    return (
        <>
            <div className="dashboardMain">
                <div className="dashboardSubMain" style={{ minHeight: window.innerHeight - 80 }} >

                    {
                        topData === null ? <></> :
                            topData.map((data, i) => (
                                topData[i][0] !== "" ?
                                    <div key={i} className="dataShowerComponent">
                                        <div className="publisherDetails">
                                            <Link to={"/" + topData[i][0]}>
                                                <div className="publisherImage">
                                                    {
                                                        publishersProfile === null ? <></> :
                                                            <img src={publishersProfile[i]} alt="img" />
                                                    }
                                                </div>
                                            </Link>
                                            <Link to={"/" + topData[i][0]}>
                                                <div className="publisherName">{topData[i][0]}</div>
                                            </Link>
                                            <i onClick={() => copyImageUrl(i)} className="fa fa-share" id="shareImageIcon"></i>
                                        </div>
                                        <div className="mainImageData">
                                            <img src={topData[i][1]} alt="img" className="dataImage" />
                                        </div>
                                        <div className="aboutDataImage">
                                            <div className="publishedDate">{getProperDate(topData[i][3]._hex * 1000)}</div>
                                            <div className="mainAboutData">{topData[i][2]}</div>
                                            {
                                                topData[i][2].length > 200 ?
                                                    <div className="readMoreOption"><span onClick={() => changeAboutBoxHeight(i)} style={{ cursor: "pointer" }}>Read More</span></div>
                                                    : <></>
                                            }
                                        </div>
                                    </div>
                                    : null
                            ))
                    }
                </div>
            </div>
        </>
    )
}
export default Dashboard; 