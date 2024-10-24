const inputFirstName=document.getElementById("primerNombre")
const inputLastName=document.getElementById("apellido")
const inputEmail=document.getElementById("email")
const inputAge=document.getElementById("edad")
const inputPassword=document.getElementById("password")
const btnSubmit=document.getElementById("btnSubmit")
const divMensajes=document.getElementById("mensajes")

btnSubmit.addEventListener("click", async(e)=>{
    e.preventDefault()
    let first_name=inputFirstName.value 
    let last_name=inputLastName.value 
    let email=inputEmail.value 
    let age=inputAge.value 
    let password=inputPassword.value 
    if(!first_name || !last_name || !email || !age || !password){
        alert("Complete los datos")
        return 
    }
    // validaciones x cuenta del alumno... 
    let body={
        first_name, last_name, email, age, password
    }

    let respuesta=await fetch("/api/sessions/registro", {
        method:"post", 
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(body)
    })
    let datos=await respuesta.json()
    console.log(datos)
    alert(datos.payload)
    if(respuesta.status>=400){
        divMensajes.textContent=datos.error
        setTimeout(() => {
            divMensajes.textContent=""
        }, 3000);
    }else{
        window.location.href=`/login?mensaje=Registro exitoso para ${datos.usuario.email}`
    }
})