
let contenido = document.getElementById("tablaContenido");
let listaPaises = document.getElementById("ulPaises");
let listaRegiones = document.getElementById("ulRegiones");
const dropMenu1 = document.querySelector("#btnPais + .dropdown-menu");
const dropMenu2 = document.querySelector("#btnRegion + .dropdown-menu");
const selectElem = document.querySelector(".form-select");
const btnGuardar = document.getElementById("guardarConsulta");
let city = document.getElementById("city");
let d = document.getElementById("fConsulta");
const apiKey = 'H86T76bLyAop4ElcmbbMozOSzGug6bNb';
let p;
let data;
let f;

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
      data = resp["DailyForecasts"];
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

  d.addEventListener("change", (event)=>{
    const dcSelected = d.valueAsDate;   
    f = dcSelected.toISOString().split('T')[0];     
    console.log('Dia: ' + f);
  })

  dropMenu1.addEventListener("click", (event) => {
    const selectedItem = event.target;  
    const selectedText = selectedItem.textContent;
    Pais(selectedText);    
  })

  dropMenu2.addEventListener("click", (event) => {
    const selectedItem = event.target;  
    const selectedText = selectedItem.textContent.trim();   
    ListaPaises(selectedText);
  })
 
  selectElem.addEventListener('change', (event) =>{
    const selectedOption = event.target.value;   ;
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

function Guardar() {
  console.log("click en Guardar", data);
  window.communication.guardarDatos(data);
}

function Consultar() {
  btnGuardar.disabled = true;
  window.communication.consultarDatos(f);
}

window.communication.devuelveDatos((event, args) =>{
  console.log('Renderer: '+ args); 
  let data = JSON.parse(args)
  for (let i = 0; i < data.length; i++) {
    let dia = data[i];    
    contenido.innerHTML +=
      "<tr>" +
      "<td>" +
      dia["id"] +
      "</td>" +
      "<td>" +
      dia["fecha"] +
      "</td>" +
      "<td>" +
      dia["pronostico"] +
      "</td>" +
      "<td>" +
      dia["temp_min"] +
      " " +
      dia["grados"] +
      "°" +
      "</td>" +
      "<td>" +
      dia["temp_max"] +
      " " +
      dia["grados"] +
      "°" +
      "</td>" +
      "</tr>";
  }
})