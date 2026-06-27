const pokemonLocal = [
  { nombre: "bulbasaur", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", tipos: ["grass", "poison"] },
  { nombre: "charmander", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png", tipos: ["fire"] },
  { nombre: "squirtle", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png", tipos: ["water"] },
  { nombre: "pikachu", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", tipos: ["electric"] },
  { nombre: "jigglypuff", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png", tipos: ["normal", "fairy"] },
  { nombre: "gengar", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", tipos: ["ghost", "poison"] }
];

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

const contenedor = document.getElementById("resultado");
const buscador = document.getElementById("buscador");
const boton = document.getElementById("btn-buscar");
const botonCargarMas = document.getElementById("cargar-mas");

botonCargarMas.addEventListener("click", cargarMas);

let pokedex = [];
let offset = 0;


function crearTarjeta(pokemon) {
  const { nombre, imagen, tipos } = pokemon;
  // Logro 03
  const [principal] = tipos;

  const img = imagen ?? "https://via.placeholder.com/96?text=?";
  
  // Logro 01
  const badges = tipos.map(function (tipo) {
  const color = coloresTipo[tipo] || "bg-slate-200 text-slate-700";

  return `
    <span class="text-xs px-2 py-1 rounded-full ${color}">
      ${tipo}
    </span>
  `;
}).join("");

  const articulo = document.createElement("article");
  articulo.className = "bg-white rounded-xl shadow p-4 text-center";
  articulo.innerHTML = `
    <img src="${img}" alt="${nombre}" class="w-24 h-24 mx-auto">
    <h2 class="capitalize font-bold text-slate-800 mt-2">${nombre}</h2>
    
    <!-- LOGRO 03 -->
    <p class="text-xs text-slate-500 mt-1">
    Tipo principal: ${principal}</p> 

    <div class="flex gap-1 justify-center mt-2 flex-wrap">${badges}</div>
  `;
  return articulo;
}



function render(lista) {
  contenedor.innerHTML = "";                 // 1. limpia lo anterior
  lista.forEach(function (pokemon) {
    const tarjeta = crearTarjeta(pokemon);   // 2. crea el nodo
    contenedor.appendChild(tarjeta);         // 3. lo inserta en el DOM
  });
}

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

async function obtenerPokemon(idONombre) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idONombre}`);
  return response.json();
}

async function buscarPokemon(nombre) {
  const data = await obtenerPokemon(nombre.toLowerCase());
  return adaptarPokemon(data);
}

function mostrarResultado(pokemon) {
  const tarjeta = crearTarjeta(pokemon);

  // STATS
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

  // BOTÓN CAPTURAR
  const botonCapturar = document.createElement("button");
  botonCapturar.textContent = "⚡ Capturar";
  botonCapturar.className =
    "mt-2 w-full bg-yellow-400 font-semibold rounded-lg py-1 hover:bg-yellow-500";

  botonCapturar.addEventListener("click", function () {
    capturar(pokemon);
  });

  tarjeta.appendChild(botonCapturar);

  // MOSTRAR EN PANTALLA
  contenedor.innerHTML = "";
  contenedor.appendChild(tarjeta);
}


async function mostrarBusqueda(nombre) {
  const pokemon = await buscarPokemon(nombre);
  mostrarResultado(pokemon);
}

function capturar(pokemon) {
  if (!pokedex.some(p => p.nombre === pokemon.nombre)) {
    pokedex.push(pokemon);
  }

  render(pokedex);
}


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

// Estado de carga
contenedor.innerHTML = `
  <div class="col-span-full flex justify-center items-center py-10 text-slate-500">
    <svg class="animate-spin h-8 w-8 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
    <span class="ml-3">Cargando…</span>
  </div>
`;

async function cargarPokedex() {
  const nombres = [
    "bulbasaur",
    "charmander",
    "squirtle",
    "pikachu",
    "jigglypuff",
    "gengar"
  ];

  const datos = await Promise.all(
    nombres.map(obtenerPokemon)
  );

  pokedex = datos.map(adaptarPokemon);

  render(pokedex);
}




boton.addEventListener("click", () => {
  const nombre = buscador.value.trim();

  if (nombre !== "") {
    mostrarBusqueda(nombre); 
  }
});

// ENTER = buscar también
buscador.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    boton.click();
  }
});

cargarPokedex();