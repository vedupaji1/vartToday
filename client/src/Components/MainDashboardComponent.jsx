import React, { useContext } from "react";
import { requiredInfo } from "../App";
import { useParams } from "react-router-dom"
import Dashboard from "./Dashboard/Dashboard";
import UploadImage from "./Header/UploadImage";
import CreateAccount from "./Header/CreateAccount";
import Loading from "./Loading";
import User from "./User/User"
const MainDashboardComponent = () => {
    const { username } = useParams();
    let contextData = useContext(requiredInfo);
    return (
        <>
            {
                username === undefined ? <Dashboard /> : <User />
            }
            {
                contextData.imageUpload.isImageUpload === true ? <UploadImage /> : <></>
            }
            {
                contextData.createAccount.shouldCreateAccount === true ? <CreateAccount /> : <></>
            }
            {
                contextData.loading.shouldLoad === true ? <Loading /> : <></>
            }
        </>
    )
}

export default MainDashboardComponent;
