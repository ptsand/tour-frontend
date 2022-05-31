import { deleteRider, getRiders } from "../../fetch-facade.js"
import { eById } from "../../utils.js"
import { updateLoginDependentComponents } from "../login-logout/login-logout.js";

let _riders;

export const initialize = async (router) => {
    // remove delete handlers to avoid multiple delete requests
    if(router.match("/delete-rider")) router.off("/delete-rider")
    try {
        // check if there's a query in the search field
        const q = (eById("rider-query").value === "") ? null : eById("rider-query").value
        _riders = await getRiders(q)
        renderRiders(riderCards)
        handleSort(true) // sort descending on first click
        updateLoginDependentComponents()
    } catch (err) {
        console.log(err.message)
    }
    router.updatePageLinks()
    router.on("/delete-rider", async match =>{
      await removeRider(match)
      // turn off the handler for removed rider
      router.off(`/delete-rider?id=${match.params.id}`)
    })
}
    

const handleSort = desc=>{
    eById("btn-sort").onclick = ()=>{
        eById("btn-sort").innerText = desc ? "Ascending" : "Descending"
        desc = !desc // toggle
        _riders.sort((a, b)=> (a.totalTimeMs - b.totalTimeMs)*(desc ? 1 : -1))
        renderRiders(riderCards)
        updateLoginDependentComponents()
    }
}

export const renderRiders = callback=>
    eById("riders").innerHTML = callback(_riders)

export const removeRider = async match=>{
    if (match?.params?.id) {
        const id = match.params.id
        try {
            await deleteRider(id)
            eById(`rider-${id}`).remove()
        } catch(err) {
            console.log(err.message)
        }
    }
}

const riderCards = riders=>
    riders.map(r=>`
            <div id="rider-${r.id}" class="card text-center">
            <div class="card-header">Total time: ${r.totalTimeMs} ms</div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${r.name}</h5>
                <p class="card-text">${r.teamName}</p>
                <div>Mountain points: ${r.mountainPoints}</div>
                <p class="card-text">Sprint points: ${r.sprintPoints}</p>
                <p class="card-text">${r.country}</p>
                <div class="edit-delete mt-auto">
                <a href="/add-edit-rider?id=${r.id}" class="btn btn-primary btn-sm" data-navigo>Edit</a>
                <a href="/delete-rider?id=${r.id}" class="btn btn-danger btn-sm" data-navigo data-navigo-options="updateBrowserURL:false">Delete</a>
                </div>
            </div>
            </div>
            `).join("")
