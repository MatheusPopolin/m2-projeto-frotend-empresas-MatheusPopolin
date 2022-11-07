import { login, verifyUser } from "../../scripts/api.js";

function loginUser(){
    const form = document.querySelector("form");
    const elements = [...form.elements];    
    form.addEventListener("submit",async event=>{
        event.preventDefault();
        const body = {};
        elements.forEach(elem=>{
            if(elem.tagName =="INPUT"){
                body[elem.name] = elem.value;
            }
        });
        await login(body);        
    })    
}
loginUser();



