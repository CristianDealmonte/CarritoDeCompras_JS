// Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector('#lista-cursos');

let articulosCarrito = [];


cargarEfentListeners();
function cargarEfentListeners() {
    //Cuando agregar un curso presionando "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCurso)

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Extrae info de local storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem('carrito')) || [];
        carritoHTML();
    })

    // Vaciar carrito BTN
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito  = []; // Resetear el array

        limpiarHTML(); // Eliminar todo el HTML
    }); 
}




// Funciones
function agregarCurso(e) {
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;

        leerDatosCurso(cursoSeleccionado);
    }
}

// Elimina un curso del carrito
function eliminarCurso(e) {
    if(e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        // Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);

        carritoHTML(); // ITerara sobre el carrito y cargar su HTML
    }
}

// Leer contenido y extraer la info del curso
function leerDatosCurso(curso) {
    // Crear objeto con el curso seleccionado
    const infoCurso = {
        id: curso.querySelector('a').getAttribute('data-id'),
        img: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        cantidad: 1,
    }

    // Revisar si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id) 

    if(existe) {
        // Actualizar la cantidad
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // Retorna objeto actualizado
            } else {
                return curso; // Retorna demas objetos
            }
        });
            // Agregar elemento al carrito
            articulosCarrito = [...cursos]; 
    } else { 
        // Agregar elemento al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    console.log(articulosCarrito);

    // Mostrar carrito al usuario
    carritoHTML();
}

// Mostrar carrito de compras
function carritoHTML() {
    // Limpiar carrito previo (HTML)
    limpiarHTML();

    // Recorre el carrito y crea el HTML
    articulosCarrito.forEach( curso => {
        const { img, titulo, precio, cantidad, id} = curso;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${img}" alt="imagen curso" width="100">
            </td>
            <td> ${titulo} </td>
            <td> ${precio} </td>
            <td> ${cantidad} </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
        `;

        // Mostrar carrito al usuario
        contenedorCarrito.appendChild(row);
    });

    // add cart to localstorage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}


// Elimina los curos de tbody
function limpiarHTML() {
    // Elimina el primer hijo mientras exista uno
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}