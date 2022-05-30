import { registerRequest } from "../../fetch-facade.js";
import { displayMsg } from "../../utils.js";

export const register = async ()=>{
    const user = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        email: document.getElementById("email").value
    }
    try {
        await registerRequest(user)
        displayMsg("User Created succesfully!","success")
    } catch (err) {
        displayMsg(err.message, "danger")
    }
}
