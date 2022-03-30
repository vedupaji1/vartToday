import React, { useContext } from "react";
import { requiredInfo } from "../../App";
import { useHistory, Link } from "react-router-dom";
const Header = () => {
    let contextData = useContext(requiredInfo);
    let history = useHistory();
    const searchUser = async (e) => {
        if (e.keyCode === 13 && document.getElementsByClassName("searchDataInp")[0].value.trim() !== "") {
            let searchInput = document.getElementsByClassName("searchDataInp")[0].value;
            try {
                let tempData = await contextData.contract.getData(searchInput);
                if (tempData.length < 1) {
                    alert("User " + searchInput + " Does Not Exists");
                } else {
                    document.getElementsByClassName("searchDataInp")[0].value = "";
                    history.push("/" + searchInput);
                }
            } catch (error) {

            }
        }
    }

    return (
        <>
            <div className="headerMain">
                <div className="headingComponent">
                    <Link to="/">
                        <h1 className="heading">
                            VARt<span>Today</span>
                        </h1>
                    </Link>
                </div>

                <div className="subHeader">
                    <div className="searchBarComponent">
                        <div className="searchIcon">
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </div>
                        <input type="text" className="searchDataInp" placeholder="Search" onKeyDown={(e) => searchUser(e)} />
                    </div>
                    <div className="uploadAndUserDetails">
                        {
                            contextData.isMetamask !== false && contextData.isMetamask !== null ?
                                <>
                                    {
                                        contextData.userData !== false && contextData.userData !== null ?
                                            <>
                                                <div className="uploadSVGImg">
                                                    <svg onClick={() => {
                                                        contextData.imageUpload.setIsImageUpload(true)
                                                    }} aria-label="New Post" className="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line></svg>
                                                </div>
                                                <div className="userProfileImage">
                                                    <Link to={"/" + contextData.userData[0][1]}>
                                                        {
                                                            contextData.userData.length > 1 ?
                                                                <img src={contextData.userData[contextData.userData.length - 1][1]} alt="" /> :
                                                                <div className="userProfileWithoutPic"><h1>{contextData.userData[0][1].substr(0, 1)}</h1></div>
                                                        }
                                                    </Link>
                                                </div>
                                            </> :
                                            <div className="signUpShower">
                                                <i onClick={() => {
                                                    contextData.createAccount.setShouldCreateAccount(true)
                                                }} className="fa fa-user-plus"></i>
                                            </div>
                                    }
                                </> :
                                <></>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}
export default Header; 