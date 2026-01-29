// Clase Tarea
class Tarea {
  constructor(nombre) {
    this.nombre = nombre.trim();
    this.completada = false;
    this.id = Date.now() + Math.random(); // ID único simple
  }

  toggleCompletada() {
    this.completada = !this.completada;
  }

  editar(nuevoNombre) {
    if (nuevoNombre.trim()) {
      this.nombre = nuevoNombre.trim();
    }
  }
}

// Clase Gestor
class GestorDeTareas {
  constructor() {
    this.tareas = [];
    this.cargarTareas(); // Intenta cargar desde localStorage
  }

  agregarTarea(nombre) {
    if (!nombre.trim()) {
      alert("La tarea no puede estar vacía");
      return;
    }

    const nuevaTarea = new Tarea(nombre);
    this.tareas.push(nuevaTarea);
    this.guardarTareas();
    this.render();
  }

  eliminarTarea(id) {
    this.tareas = this.tareas.filter(t => t.id !== id);
    this.guardarTareas();
    this.render();
  }

  editarTarea(id, nuevoNombre) {
    const tarea = this.tareas.find(t => t.id === id);
    if (tarea) {
      tarea.editar(nuevoNombre);
      this.guardarTareas();
      this.render();
    }
  }

  toggleTarea(id) {
    const tarea = this.tareas.find(t => t.id === id);
    if (tarea) {
      tarea.toggleCompletada();
      this.guardarTareas();
      this.render();
    }
  }

  render() {
    const lista = document.getElementById("lista-tareas");
    lista.innerHTML = ""; // Limpiar

    this.tareas.forEach(tarea => {
      const li = document.createElement("li");
      li.className = "tarea-item";
      li.dataset.id = tarea.id;

      li.innerHTML = `
        <span class="tarea-texto ${tarea.completada ? 'completada' : ''}">
          ${tarea.nombre}
        </span>
        <div class="botones">
          <button class="btn-toggle">${tarea.completada ? '↺' : '✓'}</button>
          <button class="btn-editar">Editar</button>
          <button class="btn-eliminar">Eliminar</button>
        </div>
      `;

      // Eventos delegados (mejor práctica)
      li.querySelector(".btn-toggle").addEventListener("click", () => 
        this.toggleTarea(tarea.id)
      );

      li.querySelector(".btn-editar").addEventListener("click", () => {
        const nuevoNombre = prompt("Editar tarea:", tarea.nombre);
        if (nuevoNombre !== null) {
          this.editarTarea(tarea.id, nuevoNombre);
        }
      });

      li.querySelector(".btn-eliminar").addEventListener("click", () => 
        this.eliminarTarea(tarea.id)
      );

      lista.appendChild(li);
    });
  }

  // LocalStorage (desafío adicional – da muchos puntos)
  guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(this.tareas));
  }

  cargarTareas() {
    const datos = localStorage.getItem("tareas");
    if (datos) {
      const tareasGuardadas = JSON.parse(datos);
      this.tareas = tareasGuardadas.map(t => {
        const tarea = new Tarea(t.nombre);
        tarea.completada = t.completada;
        tarea.id = t.id;
        return tarea;
      });
      this.render();
    }
  }
}

// --------------------- Inicio de la aplicación ---------------------
const gestor = new GestorDeTareas();

document.getElementById("agregar-tarea").addEventListener("click", () => {
  const input = document.getElementById("nueva-tarea");
  const texto = input.value;

  gestor.agregarTarea(texto);
  input.value = "";           // Limpiar input
  input.focus();              // Volver a enfocar
});

// Permitir agregar con Enter
document.getElementById("nueva-tarea").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("agregar-tarea").click();
  }
});