const funciones = {};
const fs = require('fs');
const path = require('path');
const { execSync } = require("child_process");


funciones.rootPath = path.join(__dirname+'/root/');
funciones.pathPadre = funciones.rootPath;
funciones.pathDefault = funciones.rootPath;
funciones.pathCopia = { 'typePaste': -1, 'path': '', 'name': '' };
funciones.consulta = {'id':-1,'mensaje':'None'};
//Existe un archivo
function existeArchivo(path) {
    try {
        fs.statSync(path);
        return true;
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        }
    }
}
//Permisos numericos
function tipoPermisos(permisos){
    arrayPermisos = permisos.split("");
    if(arrayPermisos[0] == 'd'){
        return 0;
    }
    return 1;
}
function permisosJson(permisos){
    arrayPermisos = permisos.split("");
    var permisosDict = {
        user:{
            read:false,
            write:false,
            execution:false
        },
        group:{
            read:false,
            write:false,
            execution:false
        },
        others:{
            read:false,
            write:false,
            execution:false
        }
    };
    if(arrayPermisos[1]=='r'){
        permisosDict.user.read = true;
    }
    if(arrayPermisos[2]=='w'){
        permisosDict.user.write = true;
    }
    if(arrayPermisos[3]=='x'){
        permisosDict.user.execution = true;
    }
    if(arrayPermisos[4]=='r'){
        permisosDict.group.read = true;
    }
    if(arrayPermisos[5]=='w'){
        permisosDict.group.write = true;
    }
    if(arrayPermisos[6]=='x'){
        permisosDict.group.execution = true;
    }
    if(arrayPermisos[7]=='r'){
        permisosDict.others.read = true;
    }
    if(arrayPermisos[8]=='w'){
        permisosDict.others.write = true;
    }
    if(arrayPermisos[9]=='x'){
        permisosDict.others.execution = true;
    }
    console.log(permisosDict)
    return permisosDict ;
}

function permisoBinarioAOctal(permisoBinario){
    arrayBinario = permisoBinario.split("");
    permisosOctal = "";
    var user = arrayBinario.slice(0,3).join("");
    console.log(user);
    var grupo = arrayBinario.slice(3,6).join("");
    console.log(grupo);
    var others = arrayBinario.slice(6,9).join("");
    console.log(others);
    permisosOctal += parseInt(parseInt(user),2).toString();
    permisosOctal += parseInt(parseInt(grupo),2).toString();
    permisosOctal += parseInt(parseInt(others),2).toString();
    return permisosOctal
}
//Mostrar contenido del directorio actual
function mostrarContenido (){
    try{
        var permisos = execSync("ls -l | awk '{print $1}'", { cwd: funciones.pathDefault }).toString().split("\n");
        var propietarios = execSync("ls -l | awk '{print $3}'", { cwd: funciones.pathDefault }).toString().split("\n");
        var nombres = execSync("ls | sed ''", { cwd: funciones.pathDefault }).toString().split("\n");
        permisos = permisos.slice(1,permisos.length-1);
        propietarios = propietarios.slice(1,propietarios.length-1);
        nombres = nombres.slice(0,nombres.length-1);
        var lista = [];
        for(var i = 0; i< permisos.length;i++){
            lista.push({
                name: nombres[i],
                permissions: funciones.permisosJson(permisos[i]),
                propietario: propietarios[i],
                tipo: funciones.tipoPermisos(permisos[i])
            });
        }
        var response ={ 'general_id': 1, 'directorio': lista , 'consulta': funciones.consulta};
        funciones.consulta = {'id':-1,'mensaje':'None'};
        return response;
        
    }catch(err){
        var response ={ 'general_id': 0, 'directorio': err , 'consulta': 'Error General'};
        funciones.consulta = {'id':-1,'mensaje':'None'};
        return response;
    }
    
}

//Cambiar directorio hijo
function ingresarHijo(nombre) {
    var path = funciones.pathDefault + nombre + '/';
    if (existeArchivo(path)) {
        funciones.pathPadre = funciones.pathDefault;
        funciones.pathDefault = path;
        funciones.consulta = { 'id': 1, 'mensaje': `Ingreso satisfactorio al hijo ${funciones.pathDefault} con padre ${funciones.pathPadre}` };
    } else {
        funciones.consulta = { 'id': 0, 'mensaje': `Este directorio ${path} no existe` };
    }
}
//Devolverse una carpeta
function ingresarPadre() {
    if (funciones.pathPadre != funciones.rootPath) {
        funciones.pathDefault = funciones.pathPadre
        funciones.pathPadre = funciones.pathPadre.substring(0, funciones.pathPadre.length - 1);
        funciones.pathPadre = funciones.pathPadre.substring(0, funciones.pathPadre.lastIndexOf('/') + 1);
    } else {
        funciones.pathDefault = funciones.pathPadre
    }
    funciones.consulta = { 'id': 1, 'mensaje': `Ingreso satisfactorio al padre ${funciones.pathDefault}` };
}

//Crear carpeta
function crearCarpeta(nombre) {
    const totalPath = funciones.pathDefault + nombre
    if (existeArchivo(totalPath)) {
        funciones.consulta = { 'id': 0, 'mensaje': "Este directorio ya existe" };
    } else {
        fs.mkdirSync(totalPath);
        funciones.consulta = { 'id': 1, 'mensaje': `Directorio '${nombre}' creado satisfactoriamente` };
    }
}

//Crear archivo
function crearArchivo(nombre) {
    const totalPath = funciones.pathDefault + nombre
    if (existeArchivo(totalPath)) {
        funciones.consulta = { 'id': 0, 'mensaje': "Este archivo ya existe" };
    } else {
        fs.openSync(totalPath, 'w+');
        funciones.consulta = { 'id': 1, 'mensaje': `Archivo '${nombre}' creado satisfactoriamente` };
    }
}

//Cambiar nombre //Da error si la carpeta tiene algo 
function cambiarNombre(viejoNombre, nuevoNombre) {
    var pathViejo = funciones.pathDefault + viejoNombre;
    var pathNuevo = funciones.pathDefault + nuevoNombre;
    if (existeArchivo(pathViejo)) {
        fs.renameSync(pathViejo, pathNuevo);
        funciones.consulta = { 'id': 1, 'mensaje': "Se cambio el nombre satisfactoriamente" };
    } else {
        funciones.consulta = { 'id': 0, 'mensaje': `El archivo no existe` };
    }
}

//Borrar archivo
function borrarArchivo(nombreArchivo) {
    try{
        var path = funciones.pathDefault;
        if(existeArchivo(path+nombreArchivo)){
            var comando = "rm -R " + nombreArchivo;
            var resultado = execSync(comando, { cwd: path }).toString()
            funciones.consulta = { 'id': 1, 'mensaje': `Se elimino el archivo ${nombreArchivo} correctamente` };
        }else{
            funciones.consulta = { 'id': 0, 'mensaje': `No existe el archivo/carpeta ${nombreArchivo}` };
        }
    }catch(err){
        funciones.consulta = { 'id': 0, 'mensaje': `Error al borrar el archivo/carpeta ${nombreArchivo}` };
    }
}

//Copiar/Cortar archivo
function copiarArchivo(nombreArchivo,cut = false) {
    try{
        var path = funciones.pathDefault;
        if (existeArchivo(path+nombreArchivo)) {
            funciones.pathCopia = { 'typePaste': 0, 'path': path, 'name': nombreArchivo };
            if(cut){
                funciones.pathCopia = { 'typePaste': 1, 'path': path, 'name': nombreArchivo };
                
            }
            funciones.consulta = { 'id': 1, 'mensaje': `Se copio el directorio ${nombreArchivo} correctamente` };
        }else{
            funciones.consulta = { 'id': 0, 'mensaje': `No existe el archivo/carpeta ${nombreArchivo}` };
        }
    }catch(err){
        funciones.consulta = { 'id': 0, 'mensaje': `Error al copiar el archivo/carpeta ${nombreArchivo}` };
    }

}

//Pegar archivo // Da error al intentar cortar a un directorio con archivos

function pegarArchivo() {
    try{
        if (funciones.pathCopia.typePaste != -1) {
            var path = funciones.pathCopia.path+funciones.pathCopia.name;
            var direccionNormalizada = funciones.pathDefault.split("/").map(function(item){
                return "'"+item+"'"
            }).join("/");
            var comando = 'cp -R '+ path + ' ' + direccionNormalizada;
            if(funciones.pathCopia.typePaste == 1){
                comando = 'mv '+ path+ ' ' + funciones.pathDefault;
            }
            var resultado = execSync(comando, { cwd: './'}).toString()
            funciones.pathCopia = { 'typePaste': -1, 'path': '', 'name': '' };
            funciones.consulta = { 'id': 1, 'mensaje': "Finalizo correctamente" };  
        } else {
            funciones.consulta = { 'id': 0, 'mensaje': "No se ha copiado/cortado ningun archivo antes" };
        }
    }catch(err){
        funciones.consulta = { 'id': 0, 'mensaje': "Error en la operacion" +err};
    }
    
}
//Cambiar permisos
function cambiarPermisos(nombreArchivo,permisos){
    try{
        var permisosOctales = funciones.permisoBinarioAOctal(permisos);
        console.log(permisosOctales);
        var comando = 'chmod -R '+ permisosOctales + ' ' + nombreArchivo;
        console.log(comando);
        var resultado = execSync(comando, {cwd:funciones.pathDefault});
        funciones.consulta = { 'id': 1, 'mensaje': `${permisos} son los nuevo permisos del archivo ${nombreArchivo}` };
    }catch(err){
        funciones.consulta = { 'id': 0, 'mensaje': "Error en la operacion" +err};
    }
}

//Cambiar propietario
function cambiarPropitario(nombreArchivo,nuevoPropietario){
    try{
        if(existeUsuario(nuevoPropietario)){
            var resultado = execSync("sudo chown " + nuevoPropietario + " " + nombreArchivo, {cwd: funciones.pathDefault});
            funciones.consulta = { 'id': 1, 'mensaje': `${nuevoPropietario} es el nuevo propietario del archivo ${nombreArchivo}` };
        }else{
            funciones.consulta = { 'id': 0, 'mensaje': "El usuario no existe"};
        }
        
    }catch(err){
        funciones.consulta = { 'id': 0, 'mensaje': "Error en la operacion" +err};
    }
}

//Existe usuario
function existeUsuario(user){
    try{
        execSync(`getent passwd | grep ${user}`, {cwd: './'})
        return true;
    }catch(err){
        return false;
    }
}

//Incluyendo Metodos

funciones.existeArchivo = existeArchivo;
funciones.tipoPermisos =tipoPermisos;
funciones.permisosJson = permisosJson;
funciones.permisoBinarioAOctal = permisoBinarioAOctal;
funciones.mostrarContenido =  mostrarContenido;
funciones.ingresarHijo = ingresarHijo;
funciones.ingresarPadre = ingresarPadre;
funciones.crearCarpeta = crearCarpeta;
funciones.crearArchivo = crearArchivo;
funciones.cambiarNombre = cambiarNombre;
funciones.borrarArchivo = borrarArchivo;
funciones.copiarArchivo = copiarArchivo;
funciones.pegarArchivo = pegarArchivo;
funciones.cambiarPermisos = cambiarPermisos;
funciones.cambiarPropitario = cambiarPropitario;
funciones.existeUsuario = existeUsuario;

module.exports = funciones;
