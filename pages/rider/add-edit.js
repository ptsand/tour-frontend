import { addRider, getRider, getTeams, updateRider } from "../../fetch-facade.js"
import { displayMsg, eById, encode } from "../../utils.js"

let _id;

export const setupAddEditRider = async match=>{
    if (match?.params?.id) _id = match.params.id
    else _id = null;
    const defaultRider = {
        name: "Bobby Olsen", country: "Denmark", totalTimeMs: 36000000, mountainPoints: 23, sprintPoints: 91
    }
    try {
        const rider = _id ? await getRider(_id) : defaultRider
        const teams = await getTeams()
        for (const prop in rider) {
            // ignore id's and teamName props here 
            if (!(prop.toLowerCase().includes("id") || prop === "teamName")) eById(`${prop}`).value = rider[prop]
        }
        eById("teamId").innerHTML = teamOptions(teams, rider.teamId)
        // console.log(encode(teamOptions(teams, rider.teamId)))
    } catch (err) {
        displayMsg(err.message, "danger")
    }
    eById("title").innerText = _id ? "Edit rider" : "Add rider"
    eById("btn-submit").onclick = addEdit
}

const teamOptions = (teams, riderTeamId)=>{
    let markup = _id ? mapTeams(teams, riderTeamId) : mapTeams(teams)
    return markup
}

const mapTeams = (teams, riderTeamId)=>teams.map(
    t => `<option value="${t.id}"${riderTeamId === t.id ? " selected" : ""}>${encode(t.name)}</option>`).join("")

const addEdit = async ()=>{
    let rider = {}
    // rider attributes must match the id's of the formular elements for this to work
    document.querySelectorAll("#add-edit-form input, #add-edit-form select")
        .forEach(e => rider[e.id] = encode(e.value))
    try {
        const resp = _id ? await updateRider(_id, rider) : await addRider(rider) // create if _id is null
        displayMsg("Rider saved","success")
    } catch (err) {
        displayMsg(err.message, "danger")
    }
}