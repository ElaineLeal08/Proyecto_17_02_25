let eventos = [];
let arr = [];

const nombreEvento = document.querySelector("#nombreEvento");
const fechaEvento = document.querySelector("#fechaEvento");
const botonAgregar = document.querySelector("#agregar");
const listaEventos = document.querySelector("#listaEventos");

const json = cargar();//se crea la constante para que pueda funcionar y cargar la informacion que almanecene el localstorage y se crea la funcion try para ejecutar esta orden

try {
    arr = JSON.parse(json);
} catch (error) {
    arr= []
}
eventos = arr? [...arr] : [];//Llena el arreglo que esta vacio

mostrarEventos();//se debe agregar este mostrareventos para que nos muestre los eventos almacenados

document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();//esto hace que el espacio del formulario vuelva a quedar vacio al hacer default
    agregarEvento();//Aqui agrega el evento que asignemos

});

function agregarEvento() {
    if (nombreEvento.value === "" || fechaEvento.value === "") {
        return;//esta primera funcion con el if lo estamos condicionando para que no me agregue eventos vacios
    }

    if (diferenciaFecha(fechaEvento.value) < 0) {
        return;//este if lo que hace es revisar que la fecha no se anterior a la actual para que no permita ingresar fechas antiguas
    }

    const nuevoEvento = {
        id: (Math.random() * 100).toString(36).slice(3),//esta linea genera un numero aleatorio de 3 digitos para darle el id al evento
        nombre: nombreEvento.value,
        fecha: fechaEvento.value,
    };

    eventos.unshift(nuevoEvento);

    guardar(JSON.stringify(eventos));//aqui se llama el evento para que guarde aqui en el local storage

    nombreEvento.value = "";//para que retorne vacio la casilla nombre evento

    mostrarEventos();
}

//La funcion dieferenciaFecha hace la conversion de la fecha para que de el resultado en días
function diferenciaFecha(destino) {
    let fechaDestino = new Date(destino);
    let fechaActual = new Date();
    let diferencia = fechaDestino.getTime() - fechaActual.getTime();
    let dias = Math.ceil(diferencia / (1000 * 3600 * 24));
    return dias;
}

function mostrarEventos() {
    const eventosHTML = eventos.map((evento) => {
        return `
            <div class="evento">
             <div class="dias">
              <span class="diasFaltantes">${diferenciaFecha(evento.fecha)}</span>
              <span class="texto">días para</span>
             </div>

                <div class="nombreEvento">${evento.nombre}</div>
                <div class="fechaEvento">${evento.fecha}</div>
                <div class="acciones">
                    <button data-id="${evento.id}" class="eliminar">Eliminar</button>
                </div>
            </div>
        `;
    });
    listaEventos.innerHTML = eventosHTML.join("");
    document.querySelectorAll('.eliminar').forEach(button => {
        button.addEventListener("click", e => {
            const id = button.getAttribute('data-id');
            eventos = eventos.filter(evento => evento.id !== id);

            guardar(JSON.stringify(eventos));
            
            mostrarEventos();
        });
    });
}

function guardar(datos){
    localStorage.setItem("lista", datos);//el localstorage guarda la informacion en el navegador
}

function cargar() {
    return localStorage.getItem("lista")

}