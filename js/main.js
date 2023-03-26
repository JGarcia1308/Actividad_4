// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, ipcRenderer, dialog } = require("electron");
const { resolve } = require("path");
const path = require("path");
const { Sequelize, DataTypes, Op } = require("sequelize");


//#region Base de datos
let credencial = {
  db: "accuweather",
  user: "galileo",
  pass: "ivn2023.",
};

const sequelize = new Sequelize(
  credencial.db,
  credencial.user,
  credencial.pass,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log(err);
  });

const Consulta = sequelize.define(
  "Consultas",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoincrement: true
    },    
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pronostico: {
      type: DataTypes.STRING,
      allowNull: false
    },
    temp_min: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    temp_max: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    grados: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha_consulta: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "Consulta", // We need to choose the model name
    timestamps: false,
  }
);

//#endregion
let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 820,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
   //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("guardarDatos", function (event, arreglo) {

  arreglo.forEach(dia => {   
     GuardarRegistro(dia);
  })
});

function GuardarRegistro(args) {
  Consulta.create({    
    fecha: args.Date,
    pronostico: args.Day.IconPhrase,
    temp_min: args.Temperature.Minimum.Value,
    temp_max: args.Temperature.Maximum.Value,
    grados: args.Temperature.Minimum.Unit
  })
 .then(res => {
  console.log(res)
  dialog.showMessageBox({
    type: 'info',
    title: 'Operacion Exitosa',
    message: 'Registro Grabado Exitosamente',
    buttons: ['OK']
  })
 }).catch((error) => {
  console.log(error)
  dialog.showMessageBox({
    type: 'error',
    title: 'Operacion Fallida',
    message: 'Error al Almacenar Registro',
    detail: error,
    buttons: ['OK']
  })
 });       
}

ipcMain.on("consultarDatos", function (event, args){
  Consulta.findAll({
    like:{
      fecha_consulta: args     
    }
  })
  .then(res =>{    
    mainWindow.webContents.send('devuelveDatos', JSON.stringify(res));     
  })
  .catch(error =>{
    console.log(error)
    dialog.showMessageBox({
    type: 'error',
    title: 'Operacion Fallida',
    message: 'Error al Almacenar Registro', 
    detail: error,
    buttons: ['OK']
  })
  })
});