const baseUrl = "http://localhost:6278/";

async function listSectors(){
    const response = await fetch(baseUrl + "sectors",{
        method: "GET"
    });
    return await response.json();
}

async function listCompanies(sector){
    if(sector && sector!="Selecionar setor"){
        const response = await fetch(baseUrl + "companies/" + sector,{
            method: "GET"
        });
        return await response.json()
    } else{
        const response = await fetch(baseUrl + "companies",{
            method: "GET"
        });
        return await response.json()
    }
    
}

async function createUserApi(user){
    try{
        const response = await fetch(baseUrl + "auth/register",{
            method: "POST",
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)        
        });
        if(response.ok){
            window.location.replace("/src/pages/login/index.html");
        } else{
            console.log((await response.json()).error[0]);
        }
    } catch(err){
        console.log(err);
    }
}

async function login(user){
    try{
        const response = await fetch(baseUrl + "auth/login",{
            method: "POST",
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)        
        });
        if(response.ok){
            const token = await response.json();
            localStorage.setItem("@KenzieEmpresas:token", token.token);
            window.location.replace("/src/pages/dashboard/index.html")
        } else{
            console.log((await response.json()).error);
        }     
    } catch(err){
        console.log(err);
    }
}

async function verifyUser(token){ 
    const response = await fetch(baseUrl + "auth/validate_user",{
        method: "GET",
        headers:{
            "Authorization": `Bearer ${token}`
        }
    });
    return (await response.json()).is_admin;
}

async function getUserInfos(token){
    try{
        const response = await fetch(baseUrl + "users/profile",{
            method: "GET",
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        if(response.ok){
            const userInfos = await response.json();
            return userInfos;
        } else{
            console.log((await response.json()).error);
        }
    } catch(err){
        console.log(err)
    }    
}

async function getDepartamentUsers(token){
    try{
        const response = await fetch(baseUrl + "users/departments/coworkers",{
            method: "GET",
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        if(response.ok){
            const departmentInfos = await response.json();
            return departmentInfos[0];
        } else{
            console.log(await response.json());
        }
    } catch(err){
        console.log(err);
    }    
}

async function editUser(token, newInfos){
    try{
        const response = await fetch(baseUrl + "users",{
            method: "PATCH",
            headers:{
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newInfos) 
        });
        if(response.ok){
            console.log("Usuario editado");
        } else{
            console.log(await response.json());
        }
    } catch(err){
        console.log(err);
    }    
}

async function getDepartaments(token, uuid){
    if(uuid){
        const response = await fetch(baseUrl + `departments/${uuid}`,{
            method: "GET",
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
            const departments = await response.json();
            return departments;
    } else{
        const response = await fetch(baseUrl + "departments",{
            method: "GET",
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
            const departments = await response.json();
            return departments;
    }       
}

async function createDepartamentApi(token, departament){
    try{
        const response = await fetch(baseUrl + "departments",{
            method: "POST",
            headers:{
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(departament)        
        });
        if(response.ok){
            console.log("Departamento criado")
        } else{
            console.log((await response.json()).error);
        }
    } catch(err){
        console.log(err);
    }
}

async function getUsers(token){
    const response = await fetch(baseUrl + "users",{
        method: "GET",
        headers:{
            "Authorization": `Bearer ${token}`
        }
    });
        const users = await response.json();
        return users;
}

async function editDepartament(token, uuid, newInfo){
    try{
        const response = await fetch(baseUrl + `departments/${uuid}`,{
            method: "PATCH",
            headers:{
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newInfo)
        });
        if(response.ok){
            console.log("Departamento editado")
        } else{
            console.log((await response.json()).error);
        }
    } catch(err){
        console.log(err);
    }
}

async function deleteDepartament(token, uuid){
    try{
        const response = await fetch(baseUrl + `departments/${uuid}`,{
            method: "DELETE",
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        if(response.ok){
            console.log("Departamento deletado")
        } else{
            console.log((await response.json()).error);
        }
    } catch(err){
        console.log(err);
    }
}

async function editInfosUser(token, uuid, newInfos){
    try{
        const response = await fetch(baseUrl + `admin/update_user/${uuid}`,{
            method: "PATCH",
            headers:{
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newInfos)
        });
        if(response.ok){
            console.log("Usuario editado")
        } else{
            console.log((await response.json()).error);
        }
    } catch(err){
        console.log(err);
    }
}

async function deleteUser(token, uuid){
    try{
        const response = await fetch(baseUrl + `admin/delete_user/${uuid}`,{
            method: "DELETE",
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        if(response.ok){
            console.log("Usuário deletado")
        } else{
            console.log((await response.json()).error);
        }
    } catch(err){
        console.log(err);
    }
}

async function getUsersOut(token){
    const response = await fetch(baseUrl + "admin/out_of_work",{
        method: "GET",
        headers:{
            "Authorization": `Bearer ${token}`
        }
    });
        const usersOut = await response.json();
        return usersOut;
}

async function admitUser(token, infos){
    try{
        const response = await fetch(baseUrl + "departments/hire",{
            method: "PATCH",
            headers:{
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(infos)
        });
        if(response.ok){
            console.log("Usuario contratado");
        } else{
            console.log((await response.json()).error);
        }
    } catch(err){
        console.log(err);
    }
}

async function dismissUser(token, uuid){
    try{
        const response = await fetch(baseUrl + `departments/dismiss/${uuid}`,{
            method: "PATCH",
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        if(response.ok){
            console.log("Usuario demitido");
        } else{
            console.log((await response.json()).error);
        }
    } catch(err){
        console.log(err);
    }
}


export {listSectors, 
    listCompanies, 
    createUserApi, 
    login, 
    verifyUser, 
    getUserInfos, 
    getDepartamentUsers, 
    editUser,
    getDepartaments,
    createDepartamentApi,
    getUsers,
    editDepartament,
    deleteDepartament,
    editInfosUser,
    deleteUser,
    getUsersOut,
    admitUser,
    dismissUser}