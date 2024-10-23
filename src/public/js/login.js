const inputEmail=document.getElementById("email")
const inputPass=document.getElementById("password")
const btnSubmit=document.getElementById("btnSubmit")

btnSubmit.addEventListener("click", async(e)=>{
    e.preventDefault()

    let email=inputEmail.value 
    let password=inputPass.value 
    if(!email || !password){
        alert("Complete datos...!!!")
        return 
    }
    console.log(email, password)
    const body={email, password}

    let respuesta=await fetch("/api/sessions/login", {
        method:"post", 
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    })
    if(respuesta.status>=400){
        let {error}=await respuesta.json()
        alert(error)
        return 
    }else{
        let datos=await respuesta.json()
        console.log(datos)
        alert(datos.payload)
    }
})