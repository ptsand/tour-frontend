import { deleteRider, getRiders } from "../../fetch-facade.js"
import { eById } from "../../utils.js"

let _entities;

export const initialize = async () =>{
    _entities = await getRiders()
    renderEntities(riderCards)
    handleSort(true) // sort descending on first click
}

const handleSort = desc=>{
    eById("btn-sort").onclick = ()=>{
        eById("btn-sort").innerText = desc ? "Ascending" : "Descending"
        desc = !desc // toggle
        _entities.sort((a, b)=> (a.totalTimeMs - b.totalTimeMs)*(desc ? 1 : -1))
        console.log(_entities)
        renderEntities(riderCards)
    }
}

export const renderEntities = callback=>
    eById("entities").innerHTML = callback(_entities)

export const removeRider = async match=>{
    if (match?.params?.id) {
        let id = match.params.id
        try {
            await deleteRider(id)
            eById(`rider-${id}`).remove()
            console.log("after-remove")
        } catch(err) {
            console.log(err.message)
        }
    }
}

const riderCards = (entities)=>
    entities.map(e=>`
            <div id="rider-${e.id}" class="card">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-uppercase">${e.name}</h5>
                <p class="card-text">${e.teamName}</p>
                <p class="card-text">Total time: ${e.totalTimeMs} ms</p>
                <div class="d-flex justify-content-between mt-auto">
                <a href="/add-edit-rider?id=${e.id}" class="btn btn-primary" data-navigo>Edit</a>
                <a href="/delete-rider?id=${e.id}" class="btn btn-danger" data-navigo data-navigo-options="updateBrowserURL:false">Delete</a>
                </div>
            </div>
            </div>
            `).join("")

const riderTable = entities=>
    entities.map(e=>`<tr><th scope="row">${e.id}</th><td>${e.name}</td><td>${e.teamName}</td>
        <td>${e.teamLetter}</td></tr>`).join("")
