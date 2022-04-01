import React, { useState, useEffect, useContext } from "react";
import { requiredInfo } from "../../App";
import { useParams } from "react-router-dom";
import Error404 from "../Error404";
import CircularLoader from "../CircularLoader"
const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    let contextData = useContext(requiredInfo);
    const { username } = useParams();

    useEffect(() => {
        if (userDetails !== null) {
            for (let i = 0; i < document.getElementsByClassName("dataShowerComponent").length; i++) {
                if (document.getElementsByClassName("mainAboutData")[i].scrollHeight > 35) {
                    document.getElementsByClassName("readMoreOption")[i].style.display = "block";
                }
            }
        }
    }, [userDetails]);

    useEffect(() => {
        const init = async () => {
            if ((userDetails !== null) && (userDetails[0][1] !== username)) {
                setUserDetails(null);
            }
            if ((userDetails === null) && (contextData.contract !== null)) {
                try {
                    let tempData = await contextData.contract.getData(username);
                    if (tempData.length < 1) {
                        setUserDetails(false);
                    } else {
                        setUserDetails(tempData);
                    }
                } catch (error) {

                }
            }
        }
        init();
    })

    const changeAboutBoxHeight = (pos) => {
        if (document.getElementsByClassName("mainAboutData")[pos].style.maxHeight !== "none") {
            document.getElementsByClassName("mainAboutData")[pos].style.maxHeight = "none";
            document.getElementsByClassName("readMoreOption")[pos].children[0].innerHTML = "Read Less";
        } else {
            document.getElementsByClassName("mainAboutData")[pos].style.maxHeight = "3.5rem";
            document.getElementsByClassName("readMoreOption")[pos].children[0].innerHTML = "Read More";
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
            {
                userDetails === false ?
                    <Error404 /> :
                    <>
                        <div className="userDetailShowerMain">
                            {
                                userDetails === null ? <></> :
                                    <>
                                        <div className="profileShowerContainer">
                                            <div className="profileImageShower">
                                                {
                                                    userDetails.length > 1 ?
                                                        <img src={userDetails[userDetails.length - 1][1]} alt="" /> :
                                                        <div className="userProfileWithoutPic showUserProfileWithoutPic"><h1>{userDetails[0][1].substr(0, 1)}</h1></div>

                                                }
                                            </div>
                                            <div className="profileInfoShower">
                                                <h1>{userDetails[0][1]}</h1>
                                                <div className="postInfoShower">{userDetails.length - 1} Posts</div>
                                                <div className="joinedDateShower">Joined On {getProperDate(userDetails[0][3]._hex * 1000)}</div>
                                                <div className="aboutUserShower">{userDetails[0][2]}</div>
                                            </div>
                                        </div>
                                        <div className="dashboardSubMain" style={{ minHeight: window.innerHeight - 80 }} >
                                            {
                                                userDetails.map((data, i) => (
                                                    i !== 0 ?
                                                        <div key={i} className="dataShowerComponent">
                                                            <div className="publisherDetails">
                                                                <div className="publisherImage">
                                                                    {
                                                                        userDetails.length > 1 ?
                                                                            <img src={userDetails[userDetails.length - 1][1]} alt="" /> :
                                                                            <div className="userProfileWithoutPic"><h1>{contextData.userData[0][1].substr(0, 1)}</h1></div>
                                                                    }
                                                                </div>
                                                                <div className="publisherName">{userDetails[0][1]}</div>
                                                                <i onClick={() => copyImageUrl(i - 1)} className="fa fa-share" id="shareImageIcon"></i>
                                                            </div>
                                                            <div className="mainImageData">
                                                                <CircularLoader />
                                                                <img onLoad={() => {
                                                                    document.getElementsByClassName("mainCircularLoaderDiv")[i - 1].style.display = "none"
                                                                }} src={userDetails[i][1]} alt="img" className="dataImage" />
                                                            </div>
                                                            <div className="aboutDataImage">
                                                                <div className="publishedDate">{getProperDate(userDetails[i][3]._hex * 1000)}</div>
                                                                <div className="mainAboutData"><pre>{userDetails[i][2]}</pre></div>
                                                                <div className="readMoreOption"><span onClick={() => changeAboutBoxHeight(i - 1)} style={{ cursor: "pointer" }}>Read More</span></div>                                                 
                                                            </div>
                                                        </div>
                                                        : null
                                                ))
                                            }
                                        </div>
                                    </>
                            }

                        </div>
                    </>
            }
        </>
    )
}
export default Dashboard; 