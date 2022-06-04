import { apiUrl } from "./settings";

const modelName = "items";

export function reducer(state, action) {
    try {
        let newState;
        switch (action.action) {
            case "SET":
                console.log("Old set: ", state);
                console.log(`Setting ${action.element} to ${action.value}`);
                newState = {...state};
                newState[action.element] = action.value;
                state[action.element] = action.value;
                return newState;
            case "PENDING":
                console.log("Updating PENDING state");
                newState = { ...state, pending: action.value }
                return newState;
            case "ERROR":
                console.log("Updating PENDING state");
                newState = { ...state, _error: action.value }
                return newState;
            default :
                return state;
        }
    } catch (err) {
        const newState = {...state, error : {}};
        newState.error[action.element] = err;
        return newState;
    }
}

export function pendingStateToReducer(dispatcher){
    return function(pending){
        dispatcher({action: "PENDING", value : pending});
    }
}

export function errorStateToReducer(dispatcher){
    return function(error){
        dispatcher({action: "ERROR", value : error});
    }
}

export function dataStateToReducer(dispatcher){
    return function(data){
        dispatcher({action: "SET", element: "data", value : data});
    }
}


export async function getItems() {
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

export async function getItem(id) {
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

export function getAndSetItems(setData, setError, setPending){
    console.log("Starting load");
    setPending(true);

    getItems()
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


export function getAndSetItem(id, setData, setError, setPending){
    console.log("Starting load");
    setPending(true);

    getItem(id)
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

export function updateItem(item, setPending, setError) {
    setError(null);
    const runFetch = async ()=>{
        try {
            const res = await new Promise((resolve, reject) => {
                setPending(true);
                setTimeout(async () => {
                    try {
                        const ret = await fetch(apiUrl + "/" + modelName + "/" + item.id, {
                            method: "PATCH",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify(item),
                        });
                        if (ret.status !== 200) throw new Error("Server returned error");
                        setPending(false);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                }, 1000)
            });
        } catch (err) {
            setError(err);
            setPending(false);
        }
    }
    runFetch();
}

export function createItem(data, setPending, setError, successCallback=null) {
    setError(false);
    console.log("Creating item");
    const runFetch = async () => {
        try {
            const res = await new Promise((resolve, reject) => {
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
            });
            if (typeof successCallback === "function") {
                successCallback();
            }
            } catch (err) {
                setPending(false);
                setError(err);
            }
    }
    runFetch();
}

