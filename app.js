// ===============================
// 📦 POKÉDEX LOCAL
// ===============================
const pokemonLocal = [
  { nombre: "bulbasaur", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", tipos: ["grass", "poison"] },
  { nombre: "charmander", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png", tipos: ["fire"] },
  { nombre: "squirtle", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png", tipos: ["water"] },
  { nombre: "pikachu", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", tipos: ["electric"] },
  { nombre: "jigglypuff", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png", tipos: ["normal", "fairy"] },
  { nombre: "gengar", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", tipos: ["ghost", "poison"] }
];

// ===============================
// 🎨 COLORES POR TIPO
// ===============================
const coloresTipo = {
  fire: "bg-red-200 text-red-800",
  water: "bg-blue-200 text-blue-800",
  grass: "bg-green-200 text-green-800",
  electric: "bg-yellow-200 text-yellow-800",
  poison: "bg-purple-200 text-purple-800",
  ghost: "bg-indigo-200 text-indigo-800",
  normal: "bg-gray-200 text-gray-800",
  fairy: "bg-pink-200 text-pink-800"
};

// ===============================
// 🎯 ELEMENTOS DOM
// ===============================
const contenedor = document.getElementById("resultado");
const buscador = document.getElementById("buscador");
const boton = document.getElementById("btn-buscar");
const botonCargarMas = document.getElementById("cargar-mas");
const spinner = document.getElementById("spinner");
const mensaje = document.getElementById("mensaje");

const pokebolaBtn = document.getElementById("pokebola-btn");
const inventario = document.getElementById("inventario");
const listaInventario = document.getElementById("lista-inventario");
const contador = document.getElementById("contador-capturados");


const musica = document.getElementById("musica");
const volumen = document.getElementById("volumen");

// 🎵 INICIAR MÚSICA SOLO CON INTERACCIÓN
window.addEventListener("click", iniciarMusica, { once: true });
window.addEventListener("keydown", iniciarMusica, { once: true });

function iniciarMusica() {
  musica.volume = volumen.value || 0.5;

  musica.play().catch(err => {
    console.log("No se pudo reproducir audio:", err);
  });
}


// ===============================
// 🧠 ESTADOS
// ===============================
let pokedex = [];
let capturados = [];
let offset = 0;

// ===============================
// 🧩 NUEVO: PANEL STATS INVENTARIO
// ===============================
const panelInv = document.getElementById("panel-inventario-contenido");

// ===============================
// 🃏 CREAR TARJETA POKÉMON
// ===============================
function crearTarjeta(pokemon) {
  const { nombre, imagen, tipos } = pokemon;

  const [principal] = tipos;

  const img = imagen ?? "https://via.placeholder.com/96?text=?";

  const badges = tipos.map(function (tipo) {
    const color = coloresTipo[tipo] || "bg-slate-200 text-slate-700";

    return `
      <span class="text-xs px-2 py-1 rounded-full ${color}">
        ${tipo}
      </span>
    `;
  }).join("");

  const articulo = document.createElement("article");
  articulo.className = "pokemon-card bg-white rounded-xl shadow p-4 text-center";

  articulo.innerHTML = `
    <img src="${img}" alt="${nombre}" class="w-24 h-24 mx-auto">
    <h2 class="capitalize font-bold text-slate-800 mt-2">${nombre}</h2>

    <p class="text-xs text-slate-500 mt-1">
      Tipo principal: ${principal}
    </p>

    <div class="flex gap-1 justify-center mt-2 flex-wrap">
      ${badges}
    </div>
  `;

  return articulo;
}

// ===============================
// 🖥️ RENDER POKÉDEX
// ===============================
function render(lista) {
  contenedor.innerHTML = "";

  lista.forEach(function (pokemon) {
    contenedor.appendChild(crearTarjeta(pokemon));
  });
}

// ===============================
// 🔄 ADAPTAR DATOS API
// ===============================
function adaptarPokemon(data) {
  return {
    nombre: data.name,
    imagen: data.sprites?.front_default ?? "https://via.placeholder.com/96?text=?",
    tipos: data.types.map(t => t.type.name),
    stats: data.stats.map(function (s) {
      return {
        nombre: s.stat.name,
        valor: s.base_stat
      };
    })
  };
}

// ===============================
// 🌐 FETCH POKÉMON
// ===============================
async function obtenerPokemon(idONombre) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idONombre}`);

  if (!response.ok) {
    throw new Error(`No se encontró "${idONombre}"`);
  }

  return response.json();
}

// ===============================
// 🔎 BUSCAR POKÉMON
// ===============================
async function buscarPokemon(nombre) {
  const data = await obtenerPokemon(nombre.toLowerCase());
  return adaptarPokemon(data);
}

// ===============================
// 📊 MOSTRAR RESULTADO BUSQUEDA
// ===============================
function mostrarResultado(pokemon) {
  const tarjeta = crearTarjeta(pokemon);

  const stats = document.createElement("div");
  stats.className = "mt-2 text-left";

  if (pokemon.stats) {
    stats.innerHTML = pokemon.stats.map(s => `
      <div class="flex justify-between text-xs">
        <span>${s.nombre}</span>
        <span>${s.valor}</span>
      </div>
    `).join("");
  }

  tarjeta.appendChild(stats);

  const botonCapturar = document.createElement("button");
  botonCapturar.textContent = "⚡ Capturar";
  botonCapturar.className =
    "mt-2 w-full bg-yellow-400 font-semibold rounded-lg py-1 hover:bg-yellow-500";

  botonCapturar.addEventListener("click", function () {
    capturar(pokemon);
  });

  tarjeta.appendChild(botonCapturar);

  contenedor.innerHTML = "";
  contenedor.appendChild(tarjeta);
}

// ===============================
// 🔍 MOSTRAR BÚSQUEDA
// ===============================
async function mostrarBusqueda(nombre) {
  spinner.classList.remove("hidden");
  mensaje.classList.add("hidden");

  try {
    const pokemon = await buscarPokemon(nombre);
    mostrarResultado(pokemon);
  } catch (error) {
    mensaje.textContent = error.message;
    mensaje.classList.remove("hidden");
  } finally {
    spinner.classList.add("hidden");
  }
}

// ===============================
// 🎒 CAPTURAR POKÉMON
// ===============================
function capturar(pokemon) {

  if (!capturados.some(p => p.nombre === pokemon.nombre)) {
    capturados.push(pokemon);
  }

  // 🔊 sonido de captura
  const sonido = new Audio("snd/catch.mp3");
  sonido.volume = 0.3; // 👈 aquí bajas el volumen (0 a 1)
  sonido.play();

  render(pokedex);
  actualizarInventario();
}
// ===============================
// 🎒 INVENTARIO 
// ===============================
function actualizarInventario() {

  listaInventario.innerHTML = "";

  capturados.forEach(p => {

    const item = document.createElement("div");
    item.className = "flex justify-between items-center border p-2 rounded";

    const left = document.createElement("div");
    left.className = "flex items-center gap-2";

    left.innerHTML = `
      <img src="${p.imagen}" class="w-10 h-10">
      <span class="capitalize text-sm">${p.nombre}</span>
    `;

    // ⭐ BOTÓN STATS 
    const btn = document.createElement("button");
    btn.textContent = "Stats";
    btn.className = "bg-blue-500 text-white text-xs px-2 py-1 rounded";

    btn.addEventListener("click", function () {
      mostrarStatsInventario(p);
    });

    item.appendChild(left);
    item.appendChild(btn);

    listaInventario.appendChild(item);
  });

  contador.textContent = capturados.length;

  if (capturados.length > 0) {
    contador.classList.remove("hidden");
  } else {
    contador.classList.add("hidden");
  }
}

// ===============================
// 📊 PANEL DERECHO INVENTARIO
// ===============================
function mostrarStatsInventario(pokemon) {

  // 🎨 tipos con colores
  const tiposHTML = pokemon.tipos.map(tipo => {
    const color = coloresTipo[tipo] || "bg-slate-200 text-slate-700";

    return `
      <span class="text-xs px-2 py-1 rounded-full ${color}">
        ${tipo}
      </span>
    `;
  }).join("");

  // 📊 stats
  const statsHTML = pokemon.stats.map(s => `
  <div class="flex justify-between text-xs">
    <span class="font-bold">${s.nombre}</span>
    <span>${s.valor}</span>
  </div>
`).join("");

  panelInv.innerHTML = `
    <img src="${pokemon.imagen}" class="w-20 h-20 mx-auto mb-2">

    <h4 class="text-center font-bold capitalize mb-2">
      ${pokemon.nombre}
    </h4>

    <!-- 🧬 TIPOS -->
    <div class="flex justify-center gap-1 mb-2 flex-wrap">
      ${tiposHTML}
    </div>

    <!-- 📊 STATS -->
    <div class="space-y-1">
      ${statsHTML}
    </div>
  `;
}

// ===============================
// 📥 CARGAR MÁS POKÉMON
// ===============================
async function cargarMas() {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=12&offset=${offset}`
  );

  const data = await res.json();

  const detalles = await Promise.all(
    data.results.map(p => fetch(p.url).then(r => r.json()))
  );

  const nuevos = detalles.map(adaptarPokemon);

  nuevos.forEach(p => {
    if (!pokedex.some(x => x.nombre === p.nombre)) {
      pokedex.push(p);
    }
  });

  offset += 12;

  render(pokedex);
}

// ===============================
// 🚀 INICIALIZAR
// ===============================
async function cargarPokedex() {

  const nombres = [
    "bulbasaur",
    "charmander",
    "squirtle",
    "pikachu",
    "jigglypuff",
    "gengar"
  ];

  const datos = await Promise.all(nombres.map(obtenerPokemon));

  pokedex = datos.map(adaptarPokemon);

  render(pokedex);
}

// ===============================
// 🔘 EVENTOS
// ===============================
boton.addEventListener("click", () => {
  const nombre = buscador.value.trim();

  if (nombre !== "") {
    mostrarBusqueda(nombre);
  }
});

buscador.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    boton.click();
  }
});

botonCargarMas.addEventListener("click", cargarMas);

pokebolaBtn.addEventListener("click", () => {
  inventario.classList.toggle("hidden");
});

cargarPokedex();


// volumen inicial
musica.volume = 0.5;

// cambiar volumen en tiempo real
volumen.addEventListener("input", function () {
  musica.volume = this.value;
});