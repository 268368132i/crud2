import { apiUrl } from "./settings";

const modelName = "auditories";

export async function getAuditories(){
    const auds = await setTimeout(async ()=>{
        const data = await fetch(apiUrl + "/" + modelName);
        if (data.status!==200) throw new Error("Can't get data");
        const json = await data.json();
        console.log("lib get auds", json);
        return json;
    },2000);
    console.log("lib got results", typeof auds);
    return auds;
}

export async function getAuditories2() {
    try {
        const result = await new Promise(async (resolve, reject) => {
            setTimeout(async() => {
                try {
                    const data = await fetch(apiUrl + "/" + modelName);
                    if (data.status !== 200) throw new Error("Server returned error");
                    const json = await data.json();
                    resolve(json);
                } catch (err) {
                    reject(err);
                }
            },1000);
        });
        return result;
    } catch (err) {
        return null;
    }
}

export async function getAuditory(id) {
    try {
        const result = await new Promise(async (resolve, reject) => {
            setTimeout(async() => {
                try {
                    const data = await fetch(apiUrl + "/" + modelName + "/" + id);
                    if (data.status !== 200) throw new Error("Server returned error");
                    const json = await data.json();
                    resolve(json);
                } catch (err) {
                    reject(err);
                }
            },1000);
        });
        return result;
    } catch (err) {
        return null;
    }
}

export function getAndSetAuditories(setData, setError, setPending){
    console.log("Starting load");
    setPending(true);

    getAuditories2()
    .then(data => {
         console.log("Done fetching" ,data);
         setData(data);
         setPending(false);
        })
        .catch ((err) => {
            setError(err);
            setPending(false);
        });
}


export function getAndSetAuditory(id, setData, setError, setPending){
    console.log("Starting load");
    setPending(true);

    getAuditory(id)
    .then(data => {
         console.log("Done fetching" ,data);
         setData.setName(data.name);
         setData.setSize(data.size);
         setData.setBuilding(data.building);
         setPending(false);
        })
        .catch ((err) => {
            setError(err);
            setPending(false);
        });
}

export function updateAuditory(auditory, setPending, setError, successCallback=()=>{}) {
    setError(null);
    const runFetch = async ()=>{
        try {
            const res = await new Promise((resolve, reject) => {
                setPending(true);
                setTimeout(async () => {
                    try {
                        const id = auditory._id;
                        delete auditory._id; 
                        const ret = await fetch(apiUrl + "/" + modelName + "/" + id, {
                            method: "PATCH",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify(auditory),
                        });
                        if (ret.status !== 201) throw new Error("Server returned error");
                        setPending(false);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                }, 1000)
            });
            successCallback();
        } catch (err) {
            setError(err);
            setPending(false);
        }
    }
    runFetch();
}

export function deleteAuditory(id, setPending=()=>{}, setError=()=>{}) {
    setError(null);
    const runFetch = async () => {
        try {
            const res = await new Promise((resolve, reject) => {
                setPending(true);
                setTimeout(async () => {
                    try {
                        const data = await fetch(apiUrl + "/" + modelName + "/" + id,{
                            method: "DELETE",
                        });
                        if (data.status !== 200) throw new Error("Server returned an error");
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                }, 1000);
            });
        } catch (err) {
            setPending(false);
            setError(err);
        }
    }
    runFetch();

}

export function createAuditory(data, setPending, setError) {
    console.log("Creating aud");
    const runFetch = async () => {
        const res = await new Promise((resolve, reject) => {
        try {
                setPending(true);
                setTimeout(async () => {
                    try {
                        const ret = await fetch(apiUrl + "/" + modelName, {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify(data),
                        });
                        if (ret.status !== 201) throw new Error("Server returned an error");
                        setPending(false);
                        
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                }, 1000);
            } catch (err) {
                setPending(false);
                setError(err);
            }
        });
    }
    runFetch();
}

