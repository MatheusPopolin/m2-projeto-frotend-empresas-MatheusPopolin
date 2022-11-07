import { createUserApi } from "../../scripts/api.js";

function createUsers(){
    const form = document.querySelector("form");
    const elements = [...form.elements];    
    form.addEventListener("submit",async event=>{
        event.preventDefault();
        const body = {};
        elements.forEach(elem=>{
            if(elem.tagName =="INPUT" || elem.tagName == "SELECT"){
                body[elem.name] = elem.value;
            }
        });
        await createUserApi(body);        
    })    
}
createUsers();