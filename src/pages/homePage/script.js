import { listCompanies, listSectors } from "../../scripts/api.js";     

function renderSectors(sectors){ 
    const sectorsList = document.getElementById("sectors");
    sectors.forEach(sector=>{
        const sectorOption = document.createElement("option");
        sectorOption.innerText = sector.description;
        sectorsList.appendChild(sectorOption);
    })
    sectorsList.addEventListener("change",async event=>{
        const sector = event.target.value;        
        renderCompanies(await listCompanies(sector));
    })
}
renderSectors(await listSectors());

function renderCompanies(companies){
    const companiesList = document.getElementById("companies");
    companiesList.innerHTML = "";
    companies.forEach(company=>{
        const {name, opening_hours} = company;
        const {description} = company.sectors
        const companyCard = document.createElement("li");
        companyCard.classList.add("company-card")
        companyCard.insertAdjacentHTML("afterbegin",`
            <h2>${name}</h2>
            <h3>${opening_hours}</h3>
            <h3>${description}</h3>        
        `);      
        companiesList.appendChild(companyCard);
    })
}
renderCompanies(await listCompanies())




