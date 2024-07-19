import axios from "axios"

export default defineNuxtPlugin((NuxtApp) => {
    axios.defaults.baseURL = 'https://scan.easyrate.dk'
    //axios.defaults.baseURL = 'https://api.johntest.site'
    axios.defaults.withCredentials = true;

    return {
        provide: { 
            axios: axios
        },
    }
})