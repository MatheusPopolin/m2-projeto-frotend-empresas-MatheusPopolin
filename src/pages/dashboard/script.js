import { getUserInfos , getDepartamentUsers, verifyUser, editUser, getDepartaments, listCompanies, createDepartamentApi, getUsers, editDepartament, deleteDepartament, editInfosUser, deleteUser, getUsersOut, admitUser, dismissUser } from "../../scripts/api.js";
import { openModal } from "../../scripts/modal.js";


function verifyToken(){    
    const token = localStorage.getItem("@KenzieEmpresas:token");
    if(!token){
        window.location.replace("/src/pages/login/index.html");
    }
}
verifyToken();
async function renderPage(){
    const token = localStorage.getItem("@KenzieEmpresas:token");
    const main = document.querySelector("main");
    main.innerHTML = "";
    const admin = await verifyUser(token);
    if(!admin){
        main.append(await createSectionInfos(token),await createSectionDepartamentUsers(token));    
    }
    else{
        main.append(await createSectionDepartaments(token), await createSectionUsers(token));
        await renderOptionsCompanies(token);
        createDepartament(token);
    }
}
renderPage();
function logout(){
    const button = document.getElementById("logout");
    button.addEventListener("click",()=>{
        localStorage.removeItem("@KenzieEmpresas:token");
        verifyToken();
    })
}
logout();


async function createSectionInfos(token){
    const sectionInfos = document.createElement("section");
    sectionInfos.className = "section-infos";
    const userInfos = await getUserInfos(token);
    const {username, email, professional_level, kind_of_work} = userInfos;
    sectionInfos.insertAdjacentHTML("afterbegin",`
        <h2 class="font-4-bold">${username.toUpperCase()}</h2>
        <ul>
            <li class="font-6">${email}</li>
            <li class="font-6">${professional_level}</li>
            <li class="font-6">${kind_of_work}</li>
        </ul>  
    `);
    const editButton = document.createElement("button");
    editButton.classList = "button-edit"
    await buttonEditUser(editButton, token);               
    sectionInfos.appendChild(editButton)
    return sectionInfos;
}
async function buttonEditUser(button, token){
    button.addEventListener("click",()=>{
        const modal = document.createElement("section");
        modal.className = "modal";
        modal.insertAdjacentHTML("afterbegin",`
            <h2 class="font-1-bold">Editar Perfil</h2>
            <form>
                <input class="input font-8" type="text" name="username" placeholder="Seu nome">
                <input class="input font-8" type="email" name="email" placeholder="Seu e-mail">
                <input class="input font-8" type="password" name="password" placeholder="Sua senha"></input>
                <button type="submit" class="button-brand font-8-bold fullwidth">Editar perfil</button>
            </form>        
        `);
        openModal(modal);
        
        const form = document.getElementById("editUser");
        const elements = [...form.elements];
        form.addEventListener("submit",async event=>{
            event.preventDefault();
            const newInfos = {};
            elements.forEach(elem=>{
            if(elem.tagName =="INPUT"){
                newInfos[elem.name] = elem.value;
            }
            });
            await editUser(token,newInfos);
            const backgroundContainer = document.querySelector(".modal-background");
            backgroundContainer.remove();
            await renderPage();           
        });
    });    
}


async function createSectionDepartamentUsers(token){
    const sectionDepUsers = document.createElement("section");
    sectionDepUsers.className = "section-dep-users";
    const departmentInfos = await getDepartamentUsers(token);
    if(departmentInfos){
        const {name, description} = departmentInfos;
    
        const title = document.createElement("h2");
        title.className = "font-3-semibold"
        title.innerText = name + " - " + description;
        
        const departmentList = document.createElement("ul");
        departmentInfos.users.forEach(user=>{
            const {username, professional_level} = user;
            departmentList.insertAdjacentHTML("afterbegin",`
                <li>
                    <h2 class="font-9-bold">${username}</h2>
                    <h3 class="font-9">${professional_level}</h3>
                </li>                        
            `);
        })
        sectionDepUsers.append(title,departmentList);
    }else{
        sectionDepUsers.insertAdjacentHTML("afterbegin",`
            <h2 class="font-1-semibold">Você ainda não foi contratado</h2> 
        `)
    }    
    return sectionDepUsers;
}


async function createSectionDepartaments(token){
    const sectionDepartaments = document.createElement("section");
    sectionDepartaments.className = "section-departaments";
    sectionDepartaments.insertAdjacentHTML("afterbegin",`
        <div>
            <h2 class="font-4-bold">Departamentos</h2>
            <select class="select-companies-small font-7" id="companies">
                <option value="">Selecionar empresa</option>
            </select>
            <button class="button-brand font-8-bold" id="create">Criar</button>
        </div>
    `)   

    const departaments = await getDepartaments(token);
    const departamentList = document.createElement("ul");
    departamentList.id = "departaments"
    renderDepartaments(departamentList,departaments, token);
    sectionDepartaments.appendChild(departamentList);
    return sectionDepartaments;
}
async function renderOptionsCompanies(token){
    const companiesList = document.getElementById("companies")
    const companies = await listCompanies();
    companies.forEach(company=>{
        const companyOption = document.createElement("option");
        companyOption.innerText = company.name;
        companyOption.value = company.uuid;
        companiesList.append(companyOption);
    })
    companiesList.addEventListener("change",async event=>{
        const uuid = event.target.value;     
        const departaments = await getDepartaments(token, uuid);
        const departamentList = document.getElementById("departaments");
        await renderDepartaments(departamentList, departaments, token);
    })
}
async function renderDepartaments(ul, departaments, token){
    ul.innerHTML = "";
    departaments.forEach(departament=>{
        const {name, description, uuid} = departament;
        const companyName = departament.companies.name
        const departamentCard = document.createElement("li");
        departamentCard.className = "departament-card"
        departamentCard.insertAdjacentHTML("afterbegin",`
                <h2 class="font-7-semibold">${name}</h2>
                <h3 class="font-8">${description}</h3>
                <h3 class="font-8">${companyName}</h3>
                <div>
                    <button class="button-view" id="view"></button>
                    <button class="button-edit" id="edit"></button>
                    <button class="button-delete" id="delete"></button>
                </div>
        `);
        const buttons = departamentCard.querySelectorAll("button");
        buttons.forEach(async button=>{
            if(button.id==="view"){
                await buttonViewDepartament(button, token, departament);
            } else if(button.id==="edit"){
                await buttonEditDepartament(button, uuid, token, description);
            } else{
                await buttonDeleteDepartament(button, uuid, token, name);
            }
        })        
        ul.appendChild(departamentCard);        
    });    
}
function createDepartament(token){
    const button = document.getElementById("create");
    button.addEventListener("click", async ()=>{
        const modal = document.createElement("section");
        modal.className = "modal";
        modal.insertAdjacentHTML("afterbegin",`
            <h2 class="font-1-bold">Criar departamento</h2>
            <form>
                <input class="input font-8" type="text" name="name" placeholder="Nome do departamento" required>
                <input class="input font-8" type="text" name="description" placeholder="Descrição" required>
                <select class="select-default font-7" name="company_uuid" required>
                    <option value="">Selecionar empresa</option>
                </select>
                <button type="submit" class="button-brand font-8-bold fullwidth">Criar departamento</button>
            </form>        
        `);
        const companiesList = modal.querySelector("select");
        const companies = await listCompanies();
        companies.forEach(company=>{
            const companyOption = document.createElement("option");
            companyOption.innerText = company.name;
            companyOption.value = company.uuid;
            companiesList.append(companyOption);
        });
        const form =  modal.querySelector("form");
        const elements = [...form.elements];
        form.addEventListener("submit", async event=>{
            event.preventDefault();
            const body = {};
            elements.forEach(elem=>{
                if(elem.tagName =="INPUT" || elem.tagName == "SELECT"){
                    body[elem.name] = elem.value;
                }
            });
            await createDepartamentApi(token, body);
            const backgroundContainer = document.querySelector(".modal-background");
            backgroundContainer.remove();
            await renderPage();    
        })
        openModal(modal);            
    })    
}
async function buttonViewDepartament(button, token, departament){
    const {name, description, uuid} = departament
    const companyName = departament.companies.name;
    button.addEventListener("click",async ()=>{
        const modal = document.createElement("section");
        modal.className = "modal";
        modal.insertAdjacentHTML("afterbegin",`
            <h2>${name}</h2>
            <div>
                <div>
                    <h3>${description}</h3>
                    <p>${companyName}</p>
                </div>
                <form>
                <select name="user_uuid" class="select-default font-7" required>
                    <option value="">Selecionar usuário</option>
                </select>
                <button type="submit" class="button-sucess font-8-bold">Contratar</button> 
                </form>
            </div>            
            <ul></ul>                  
        `);
        const select = modal.querySelector("select");
        const usersOut = await getUsersOut(token);
        usersOut.forEach(user=>{
            select.insertAdjacentHTML("afterbegin",`
                <option value="${user.uuid}">${user.username}</option>
            `)
        });

        const form = modal.querySelector("form");
        const elements = [...form.elements];
        form.addEventListener("submit",async event=>{
            event.preventDefault();
            const infos = {};
            elements.forEach(elem=>{
            if(elem.tagName =="SELECT"){
                infos[elem.name] = elem.value;
            }
            });
            infos.department_uuid = uuid;
            await admitUser(token, infos);
            const backgroundContainer = document.querySelector(".modal-background");
            backgroundContainer.remove();
            await renderPage();
        });

        const usersAdmitedList = modal.querySelector("ul");
        const users = await getUsers(token);
        const usersAdmited = users.filter(user=>user.department_uuid===uuid);
        usersAdmited.forEach(user=>{
            const {username, professional_level, uuid} = user;
            const userAdmitedCard = document.createElement("li")
            userAdmitedCard.insertAdjacentHTML("afterbegin",`
                <h3>${username}</h3>
                <h4>${professional_level}</h4>
                <h4>${companyName}</h4>
            `)
            const buttonDismiss = document.createElement("button");
            buttonDismiss.className = "button-alert font-8-bold"
            buttonDismiss.innerText = "Desligar"
            buttonDismiss.addEventListener("click",async ()=>{
                await dismissUser(token,uuid);
                const backgroundContainer = document.querySelector(".modal-background");
                backgroundContainer.remove();
                await renderPage();
            })
            userAdmitedCard.appendChild(buttonDismiss);
            usersAdmitedList.appendChild(userAdmitedCard)
        })
        openModal(modal);      
    });
}

async function buttonEditDepartament(button, id, token, description){
    button.addEventListener("click",()=>{
        const modal = document.createElement("section");
        modal.className = "modal";
        modal.insertAdjacentHTML("afterbegin",`
            <h2 class="font-1-bold">Editar Departamento</h2>
            <form>
                <input class="input font-8" type="text" name="description" placeholder="${description}">
                <button type="submit" class="button-brand font-8-bold fullwidth">Salvar alterações</button>
            </form>        
        `);
        openModal(modal);
        
        const form = modal.querySelector("form");
        const elements = [...form.elements];
        form.addEventListener("submit",async event=>{
            event.preventDefault();
            const newInfo = {};
            elements.forEach(elem=>{
            if(elem.tagName =="INPUT"){
                newInfo[elem.name] = elem.value;
            }
            });
            await editDepartament(token,id,newInfo);
            const backgroundContainer = document.querySelector(".modal-background");
            backgroundContainer.remove();
            await renderPage();  
        });
    });
}
async function buttonDeleteDepartament(button, id, token, name){
    button.addEventListener("click",()=>{
        const modal = document.createElement("section");
        modal.className = "modal";
        modal.insertAdjacentHTML("afterbegin",`
            <h2 class="font-5">Realmente deseja deletar o Departamento ${name} e demitir seus funcionários</h2>
            <button type="submit" class="button-sucess font-8-bold">Confirmar</button>     
        `);
        openModal(modal);
        
        const button = modal.querySelector("button");
        button.addEventListener("click",async ()=>{
            await deleteDepartament(token,id);
            const backgroundContainer = document.querySelector(".modal-background");
            backgroundContainer.remove();
            await renderPage(); 
        })                     
    });
}



async function createSectionUsers(token){
    const sectionUsers = document.createElement("section");
    sectionUsers.className = "section-users";
    sectionUsers.insertAdjacentHTML("afterbegin",`
        <h2 class="font-4-bold">Usuários cadastrados</h2>        
    `);

    const users = await getUsers(token);
    const userList = document.createElement("ul");
    users.forEach(user=>{
        if(!user.is_admin){
            const {username, professional_level, uuid} = user;
            const userCard = document.createElement("li");
            userCard.className = "user-card";
            userCard.insertAdjacentHTML("afterbegin",`
                <h2 class="font-7-semibold">${username}</h2>
                <h3 class="font-8">${professional_level}</h3>
                <div>
                    <button class="button-edit" id="edit"></button>
                    <button class="button-delete" id="delete"></button>
                </div>            
            `)
            const buttons = userCard.querySelectorAll("button");
            buttons.forEach(button=>{
                if(button.id==="edit"){
                    buttonAdminEditUser(button, token, uuid);
                } else{
                    buttonDeleteUser(button, token, uuid, username);
                }
            })
            userList.appendChild(userCard);
        }
    })
    sectionUsers.appendChild(userList);
    return sectionUsers;
}
async function buttonAdminEditUser(button,token,uuid){
    button.addEventListener("click",()=>{
        const modal = document.createElement("section");
        modal.className = "modal";
        modal.insertAdjacentHTML("afterbegin",`
            <h2 class="font-1-bold">Editar Usuário</h2>
            <form>
                <select class="select-default font-7" name="kind_of_work" required>
                    <option value="">Selecionar modalidade de trabalho </option>
                    <option value="home office">Home Office</option>
                    <option value="presencial">Presencial</option>
                    <option value="hibrido">Hibrido</option>
                </select>
                <select class="select-default font-7" name="professional_level" required>
                    <option value="">Selecionar nível profissional</option>
                    <option value="estágio">Estágio</option>
                    <option value="júnior">Júnior</option>
                    <option value="pleno">Pleno</option>
                    <option value="sênior">Sênior</option>
                </select>
                <button type="submit" class="button-brand font-8-bold fullwidth">Editar</button>
            </form>        
        `);
        openModal(modal);
        
        const form = modal.querySelector("form");
        const elements = [...form.elements];
        form.addEventListener("submit",async event=>{
            event.preventDefault();
            const newInfos = {};
            elements.forEach(elem=>{
            if(elem.tagName =="SELECT"){
                newInfos[elem.name] = elem.value;
            }
            });
            await editInfosUser(token,uuid,newInfos);
            const backgroundContainer = document.querySelector(".modal-background");
            backgroundContainer.remove();
            await renderPage();  
        });
    });
}
async function buttonDeleteUser(button,token, uuid, username){
    button.addEventListener("click",()=>{
        const modal = document.createElement("section");
        modal.className = "modal";
        modal.insertAdjacentHTML("afterbegin",`
            <h2 class="font-5">Realmente deseja remover o usuário ${username}?</h2>
            <button type="submit" class="button-sucess font-8-bold">Deletar</button>     
        `);
        openModal(modal);
        
        const button = modal.querySelector("button");
        button.addEventListener("click",async ()=>{
            await deleteUser(token,uuid);
            const backgroundContainer = document.querySelector(".modal-background");
            backgroundContainer.remove();
            await renderPage(); 
        })                     
    });
}

