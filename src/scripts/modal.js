function openModal(modal){
    const body = document.querySelector("body")
    const backgroundContainer = document.createElement("section");
    const closeModalButton = document.createElement("button");

    backgroundContainer.classList.add("modal-background");
    closeModalButton.classList.add("button-close");

    closeModalButton.innerText = "X";

    backgroundContainer.addEventListener("click", (event)=> {
        const {className} = event.target;
        if(className === "modal-background" || className==="button-close"){
            backgroundContainer.remove();
        }
    })

    modal.appendChild(closeModalButton);
    backgroundContainer.appendChild(modal);
    body.appendChild(backgroundContainer);
}

export {openModal};