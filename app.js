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

render(pokemonLocal);   // ¡píntalo!

//  Logro 02
const nuevo = {
  nombre: "mew",
  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
  tipos: ["psychic"]
};
const ampliada = [...pokemonLocal, nuevo];
render(ampliada);

const buscador = document.getElementById("buscador");

buscador.addEventListener("input", function () {
  const texto = buscador.value.toLowerCase();
  const filtrados = ampliada.filter(p => p.nombre.includes(texto));
  render(filtrados);   // ← el MISMO render, con datos distintos
});