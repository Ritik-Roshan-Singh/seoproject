const encodedString=btoa('ritikroshansingh06@gmail.com:300a0acbcc1fe677')



const baseUrl = 'https://api.dataforseo.com/'
export const apiRequest = async (value) => {
    const { path, method = "POST", data } = value
    const response = await fetch(baseUrl+path, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
            Authorization:`Basic ${encodedString}` 
        },
    })
    const responseData = await response.json();
    return responseData

}



    export function isValidURL(url) {
        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?|localhost)([\/?].*)?$/;
        return urlPattern.test(url);
    }