const sendLogin = async(e)=> {
    e.preventDefault();
    const formElement = document.querySelector("form");
    const data = {};
    data.username = document.querySelector("form  [name='username']").value;
    data.password = document.querySelector("form [name='password']").value;
    try {
        const result = fetch("http://localhost:5000/auth/login",{
            method: "POST",
            headers: {
                "content-type":"application/json"
            },
            body:JSON.stringify(data)
        });
    } catch (err){
        console.log(`Error sending credentials:${String(err)}`);
    }
}