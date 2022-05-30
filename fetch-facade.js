const API = "http://localhost:8080/api"

export const loginRequest = async (user) => await fetch(`${API}/auth/login`, makeOptions("post", user)).then(res => handleErrors(res))
export const registerRequest = async (person) => await fetch(`${API}/persons`, makeOptions("post", person)).then(res => handleErrors(res))
export const getPerson = async (username) => await fetch(`${API}/persons/${username}`, makeOptions("get", null, true)).then(res => handleErrors(res))

export const getTeams = async () => await fetch(`${API}/teams`, makeOptions("get")).then(res => handleErrors(res))

export const getRiders = async () => await fetch(`${API}/riders?size=100`, makeOptions("get")).then(res => handleErrors(res))
export const getRider = async (id) => await fetch(`${API}/riders/${id}`, makeOptions("get")).then(res => handleErrors(res))
export const addRider = async (rider) => await fetch(`${API}/riders`, makeOptions("post", rider)).then(res => handleErrors(res))
export const updateRider = async (id, rider) => await fetch(`${API}/riders/${id}`, makeOptions("put", rider)).then(res => handleErrors(res))
export const deleteRider = async (id) => await fetch(`${API}/riders/${id}`, makeOptions("delete")).then(res => handleErrors(res))

export function makeOptions(method, body, addToken) {
    const opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
      }
    }
    if (body) opts.body = JSON.stringify(body) // Add optional body
    if (addToken) {
        let jwt = sessionStorage.getItem("token") // Authentication
        if (jwt) opts.headers.Authorization = `Bearer ${jwt}`
    }
    return opts
}

export async function handleErrors(res) {
    if (!res.ok) {
      const errorResponse = await res.json()
      // there are a number of different responses from sec, Client4xxException, handleMethodArgumentNotValid
      // if time, try to make consistent
      const error = new Error(errorResponse.message)
      throw error
    }
    //console.log(res)
    // this promise fails on HTTP DELETE, if the response body is empty -> no json to parse
    // made backend return "{}" instead of void
    return res.json()
}