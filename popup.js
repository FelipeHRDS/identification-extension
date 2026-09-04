const grupoUsuario = document.querySelector(".grupoUsuario");
const popup = document.querySelector(".popup");
const botao = document.querySelector(".botao");

function adicionarItem() {
    const novoItem = grupoUsuario.cloneNode(true);

    novoItem.classList.remove("ocultar");

    const lixeira = novoItem.querySelector(".fa-trash");
    const lapis = novoItem.querySelector(".fa-pencil");

    lapis.addEventListener("click", () => {
        const texto = novoItem.querySelector(".switchText");
        const input = document.createElement("input");

        input.value = texto.innerText;
        novoItem.insertBefore(input, texto)
        texto.remove();

        input.addEventListener("blur", () => {
            const novoTexto = document.createElement("span");
            novoTexto.innerText = input.value;
            novoItem.insertBefore(novoTexto, input);
            input.remove();
            novoTexto.classList.add("switchText");
        });
    });


    lixeira.addEventListener("click", (event) => {
        event.target.closest(".grupoUsuario").remove();
    });

    const switchButton = novoItem.querySelector(".switchInput");

    switchButton.addEventListener("change", (e) => {
        const isChecked = e.target.checked;


        const todosOsSwitches = document.querySelectorAll(".switchInput");
        
        if (isChecked) {
            for (let i = 0; i < todosOsSwitches.length; i++){
                if (todosOsSwitches[i] !== e.target){
                    todosOsSwitches[i].checked = false;
                }
            }
        }

        console.log(isChecked);
    });

    popup.insertBefore(novoItem, popup.children[1]);
}

botao.addEventListener("click", adicionarItem);

