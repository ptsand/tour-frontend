import "https://unpkg.com/navigo"  //Will create the global Navigo object used below

import {
  renderText, adjustForMissingHash, loadTemplate, renderTemplate, setActiveLink, eById
} from "./utils.js"

import { setupLoginHandlers, logout, updateLoginDependentComponents } from "./pages/login-logout/login-logout.js"
import { setupAddEditRider } from "./pages/rider/add-edit.js"
import { initialize, removeRider } from "./pages/rider/list-delete.js"
import { register } from "./pages/register/register.js"

window.addEventListener("load", async () => {
  const router = new Navigo("/", { hash: true })
  const templateLogin = await loadTemplate("./pages/login-logout/login.html")
  const templateLogout = await loadTemplate("./pages/login-logout/logout.html")
  const templateHome = await loadTemplate("./pages/home/home.html")
  const templateRegister = await loadTemplate("./pages/register/register.html")
  const templateRiderCards = await loadTemplate("./pages/rider/list-delete.html")
  const templateRiderTable = await loadTemplate("./pages/rider/list-delete-table.html")
  const templateAddEditRider = await loadTemplate("./pages/rider/add-edit.html")

  adjustForMissingHash()
  await router
  .hooks({
    before(done, match) {
      setActiveLink("top-nav", match.url)
      done()
    }
  })
  .on("/", ()=>renderTemplate(templateHome, "content"))
  .on("/list-riders", async ()=>{
    // remove delete handlers to avoid multiple delete requests
    if(router.match("/delete-rider")) router.off("/delete-rider")
    renderTemplate(templateRiderCards, "content")
    await initialize()
    router.updatePageLinks()
    router.on("/delete-rider", async match =>{
      await removeRider(match)
      // turn off the handler for removed Rider
      router.off(`/delete-rider?id=${match.params.id}`)
    })
  })
  .on("/add-edit-rider", match=>{
    renderTemplate(templateAddEditRider, "content")
    setupAddEditRider(match)
  })
  .on("/login", () => {
    renderTemplate(templateLogin, "content")
    setupLoginHandlers(router.navigate)
  })
  .on("/logout", () => {
    renderTemplate(templateLogout, "content")
    logout()
  })
  .on("/register",() =>{
    renderTemplate(templateRegister,"content")
    eById("btn-submit").onclick = register
  })
  .notFound(() => renderText("No page for this route found", "content"))
  .resolve()
})

updateLoginDependentComponents()
window.onerror = (e) => alert(e)