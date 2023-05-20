

import axios from 'axios'

import { api_base_url } from '../environment'
import { getUserAuthToken } from '../auth/firebase_auth'

async function api_ping() {
    try {
        var res = await axios.get(api_base_url, 
            { 
                headers: {"Authorization" : await getUserAuthToken()}
            }
        )
        return res.data.msg;
    } catch (err) {
        console.log(err)
        return null;
    }
}

async function api_auth_test() {
    try {
        var res = await axios.get(api_base_url + "auth-test", 
            { 
                headers: {"Authorization" : await getUserAuthToken()}
            }
        )
        return res.data.msg;
    } catch (err) {
        console.log(err)
        return null;
    }
}

export { api_ping, api_auth_test }
