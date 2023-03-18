/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

let contenido = document.getElementById("tablaContenido");
let listaPaises = document.getElementById("ulPaises");
let listaRegiones = document.getElementById("ulRegiones");
const dropMenu1 = document.querySelector("#btnPais + .dropdown-menu");
const dropMenu2 = document.querySelector("#btnRegion + .dropdown-menu");
const selectElem = document.querySelector(".form-select");
let city = document.getElementById("city");
const apiKey = 'H86T76bLyAop4ElcmbbMozOSzGug6bNb';
const ciudad = 'Guatemala,GT';
let p;

function Consulta(n, p) {
  //Se realiza la consulta a la API
  contenido.innerHTML = "";
  let req;

  if (p == 1) {
    req = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/`+n+`?apikey=${apiKey}&language=es-es&details=true&metric=true`; 
  }else if(p == 5){
    req = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/`+n+`?apikey=${apiKey}&language=es-gt&details=true&metric=true`;    
  } //else {
  //   req = `http://dataservice.accuweather.com/forecasts/v1/daily/10day/`+n+`?apikey=${apiKey}&language=es-gt&details=true&metric=true`;
  // }
  
console.log(req)
  fetch(req)
    //Se recibe la promesa de respuesta
    //La respuesta se convierte en JSON para su manipulación
    .then((res) => res.json())
    .then((resp) => {
      let data = resp["DailyForecasts"];
      let c = 0;
      for (let i = 0; i < data.length; i++) {
        let dia = data[i];
        c += 1;
        contenido.innerHTML +=
          "<tr>" +
          "<td>" +
          c +
          "</td>" +
          "<td>" +
          dia["Date"] +
          "</td>" +
          "<td>" +
          dia["Day"]["IconPhrase"] +
          "</td>" +
          "<td>" +
          dia["Temperature"]["Minimum"]["Value"] +
          " " +
          dia["Temperature"]["Minimum"]["Unit"] +
          "°" +
          "</td>" +
          "<td>" +
          dia["Temperature"]["Maximum"]["Value"] +
          " " +
          dia["Temperature"]["Maximum"]["Unit"] +
          "°" +
          "</td>" +
          "</tr>";
      }
    })
    .catch((err) => {
      console.log(err);
      alert(err);
    });
}

function Regiones() {
  fetch(`http://dataservice.accuweather.com/locations/v1/regions?apikey=${apiKey}`)
  .then((res) => res.json())
    .then((resp) => {
      let data = resp;
      for (let i = 0; i < data.length; i++) {
        listaRegiones.innerHTML +=
          '<li><a class="dropdown-item" href="#">' +
          data[i]["ID"] +
          "</a></li>";        
      }
    });
}

function ListaPaises(r) {
  fetch(
    `http://dataservice.accuweather.com/locations/v1/countries/`+r+`?apikey=${apiKey}`
  )
    .then((res) => res.json())
    .then((resp) => {
      let data = resp;
      for (let i = 0; i < data.length; i++) {
        listaPaises.innerHTML +=
          '<li><a class="dropdown-item" href="#">' +
          data[i]["EnglishName"] +
          "</a></li>";        
      }
    });
}

Regiones();


  dropMenu1.addEventListener("click", (event) => {
    const selectedItem = event.target;
  
    const selectedText = selectedItem.textContent.trim();
    Pais(selectedText);    
  })

  dropMenu2.addEventListener("click", (event) => {
    const selectedItem = event.target;
  
    const selectedText = selectedItem.textContent.trim();   
    ListaPaises(selectedText);
  })
 
  selectElem.addEventListener('change', (event) =>{
    const selectedOption = event.target.value;
    console.log(selectedOption);
    Consulta(p, selectedOption);
  })

function Pais(pa) {
  fetch(
    `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=` +pa
  )
    .then((res) => res.json())
    .then((resp) => {
      let data = resp;      
      console.log(data);
      for (let i = 0; i < data.length; i++) {
       if ( pa == data[i]["EnglishName"]) {
        p = data[i]["Key"];
       }        
      }
     city.innerHTML = pa;
      console.log("p: " + p)
    });
}
