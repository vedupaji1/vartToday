import React, { useContext } from "react";
import { requiredInfo } from "../../App";
/* Note Large Amount Of Code Is Copied From UploadImage Component */

const CreateAccount = () => {
    let contextData = useContext(requiredInfo);
    const createUserAccount = async () => {
        if (document.getElementById("imageDescription").value.trim() !== "" && document.getElementById("bidValueTakerInp").value.trim() !== "") {
            let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (format.test(document.getElementById("bidValueTakerInp").value.trim()) !== true) {
                try {
                    let isUserNameExists = await contextData.contract.userNames(document.getElementById("bidValueTakerInp").value.trim())
                    if (isUserNameExists === "0x0000000000000000000000000000000000000000") {
                        contextData.loading.setShouldLoad(true);
                        let res = await contextData.contract.createAccount(document.getElementById("bidValueTakerInp").value.trim(), document.getElementById("imageDescription").value.trim());
                        await res.wait();
                        alert("Your Account Is Created");
                        contextData.loading.setShouldLoad(false);
                        window.location.reload();
                    } else {
                        alert("Entered Username Already Exists, Please Use Another Username");
                    }
                } catch (error) {
                    console.log(error);
                    contextData.loading.setShouldLoad(false);
                    window.location.reload();
                }
            } else {
                alert("Username Should Not Contain Special Character");
            }

        } else {
            alert("Please Fill All Details");
        }
    }

    return (
        <>
            <div className="uploadImageMain">
                <div className="uploadImageSub">
                    <div className="closeUploadIcon">
                        <h1 className="signUpTextShower">Sign Up</h1>
                        <i onClick={() => {
                            contextData.createAccount.setShouldCreateAccount(false)
                        }} className="fa fa-close" aria-hidden="true"></i>
                    </div>
                    <div className="uploadImageSubPart">
                        <input type="text" placeholder="Username" name="bidValueTakerInp" id="bidValueTakerInp" />
                        <textarea onChange={() => {
                            document.getElementById("imageDescription").style.height = "auto"
                            document.getElementById("imageDescription").style.height = document.getElementById("imageDescription").scrollHeight / 10 + "rem";
                        }} placeholder="About User" name="imageDescription" id="imageDescription" className="aboutUserInp"></textarea>
                        <button className="imageUploadSubmit" onClick={() => createUserAccount()}>Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CreateAccount;