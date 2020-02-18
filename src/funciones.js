const fs = require('fs');
const { execSync } = require("child_process");

const rootPath = './root/';

var pathPadre = rootPath;
var pathDefault = rootPath;
var pathCopia = { 'typePaste': -1, 'path': '', 'name': '' };
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
function permisosNumericosYTipo(permisosLetras){
    var tipo = 1;
    if(permisosLetras[0] == 'd'){
        tipo = 0;
    }
    var contador = 0;
    var numero = "";
    var permisos = "";
    for(var i=1 ; i< permisosLetras.length;i++){
        if(permisosLetras[i] = 'r' || permisosLetras[i] == 'w' || permisosLetras[i] == 'x'){
            numero += '1';
        }else{
            numero += '0';
        }
        contador++;
        if(contador == 3){
            permisos += parseInt(parseInt(numero),2).toString();
            var contador = 0;
            var numero = "";
        }
    }
    return {'tipo':tipo,'permisos':permisos};

}
//Mostrar contenido del directorio actual
function mostrarContenido (){
    try{
        var directorios = execSync('ls -l', { cwd: pathDefault }).toString().split("\n");
        var lista = [];
        directorios = directorios.slice(1, directorios.length - 1);
        directorios.map(x => {
            var directorio = (x.substring(0,10)+x.substring(14)).split(" ");
            var info = permisosNumericosYTipo(directorio[0].split(''));
            lista.push({
                name: directorio[directorio.length - 1],
                permissions: info.permisos,
                propietario: directorio[1],
                tipo: info.tipo
            });
        });
        return { 'id': 1, 'mensaje': lista };
    }catch(err){
        return { 'id': 0, 'mensaje': err };
    }
    
}

//Cambiar directorio hijo
function ingresarHijo(nombre) {
    path = pathDefault + nombre + '/';
    if (existeArchivo(path)) {
        pathPadre = pathDefault;
        pathDefault = path;
        return { 'id': 1, 'mensaje': `Ingreso satisfactorio al hijo ${pathDefault} con padre ${pathPadre}` };
    } else {
        return { 'id': 0, 'mensaje': `Este directorio ${path} no existe` };
    }
}
//Devolverse una carpeta
function ingresarPadre() {
    if (pathPadre != rootPath) {
        pathDefault = pathPadre
        pathPadre = pathPadre.substring(0, pathPadre.length - 1);
        pathPadre = pathPadre.substring(0, pathPadre.lastIndexOf('/') + 1);
    } else {
        pathDefault = pathPadre
    }
    return { 'id': 1, 'mensaje': `Ingreso satisfactorio al padre ${pathDefault}` };
}

//Crear carpeta
function crearCarpeta(nombre) {
    const totalPath = pathDefault + nombre
    if (existeArchivo(totalPath)) {
        return { 'id': 0, 'mensaje': "Este directorio ya existe" };
    } else {
        fs.mkdirSync(totalPath);
        return { 'id': 1, 'mensaje': `Directorio '${nombre}' creado satisfactoriamente` };
    }
}

//Crear archivo
function crearArchivo(nombre) {
    const totalPath = pathDefault + nombre
    if (existeArchivo(totalPath)) {
        return { 'id': 0, 'mensaje': "Este archivo ya existe" };
    } else {
        fs.openSync(totalPath, 'w+');
        return { 'id': 1, 'mensaje': `Archivo '${nombre}' creado satisfactoriamente` };
    }
}

//Cambiar nombre //Da error si la carpeta tiene algo 
function cambiarNombre(viejoNombre, nuevoNombre) {
    pathViejo = pathDefault + viejoNombre;
    pathNuevo = pathDefault + nuevoNombre;
    if (existeArchivo(pathViejo)) {
        fs.renameSync(pathViejo, pathNuevo);
        return { 'id': 1, 'mensaje': "Se cambio el nombre satisfactoriamente" };
    } else {
        return { 'id': 0, 'mensaje': `El archivo no existe` };
    }
}

//Borrar archivo
function borrarArchivo(nombreArchivo) {
    try{
        path = pathDefault;
        if(existeArchivo(path+nombreArchivo)){
            var comando = "rm -R " + nombreArchivo;
            var resultado = execSync(comando, { cwd: path }).toString()
            return { 'id': 1, 'mensaje': `Se elimino el archivo ${nombreArchivo} correctamente` };
        }else{
            return { 'id': 0, 'mensaje': `No existe el archivo/carpeta ${nombreArchivo}` };
        }
    }catch(err){
        return { 'id': 0, 'mensaje': `Error al borrar el archivo/carpeta ${nombreArchivo}` };
    }
}

//Copiar/Cortar archivo
function copiarArchivo(nombreArchivo,tipoArchivo,cut = false) {
    try{
        path = pathDefault;
        if (existeArchivo(path+nombreArchivo)) {
            if(tipoArchivo == 0){
                nombreArchivo = '/'+nombreArchivo;
            }
            pathCopia = { 'typePaste': 0, 'path': path, 'name': nombreArchivo };
            if(cut){
                pathCopia = { 'typePaste': 1, 'path': path, 'name': nombreArchivo };
                
            }
            console.log(pathCopia.path);
            return { 'id': 1, 'mensaje': `Se copio el directorio ${nombreArchivo} correctamente` };
        }else{
            return { 'id': 0, 'mensaje': `No existe el archivo/carpeta ${nombreArchivo}` };
        }
    }catch(err){
        return { 'id': 0, 'mensaje': `Error al copiar el archivo/carpeta ${nombreArchivo}` };
    }

}

//Pegar archivo // Da error al intentar cortar un directorio con archivos

function pegarArchivo() {
    try{
        if (pathCopia.typePaste != -1) {
            var comando = 'cp -R '+ pathCopia.name + ' ' + pathDefault;
            if(pathCopia.typePaste == 1){
                comando = 'mv '+ pathCopia.name + ' ' + pathDefault;
            }
            var resultado = execSync(comando, { cwd: pathCopia.path }).toString()
            pathCopia = { 'typePaste': -1, 'path': '', 'name': '' };
            return { 'id': 1, 'mensaje': "Finalizo correctamente" };
            
        } else {
            return { 'id': 0, 'mensaje': "No se ha copiado/cortado ningun archivo antes" };
        }
    }catch(err){
        return { 'id': 0, 'mensaje': "Error en la operacion" +err};
    }
    
}
//Cambiar permisos
function cambiarPermisos(nombreArchivo,permisos){
    try{
        var resultado = execSync("chmod -R " + permisos + " " + nombreArchivo, {cwd: pathDefault});
        return { 'id': 1, 'mensaje': `${permisos} son los nuevo permisos del archivo ${nombreArchivo}` };
    }catch(err){
        return { 'id': 0, 'mensaje': "Error en la operacion" +err};
    }
}

//Cambiar propietario
function cambiarPropitario(nombreArchivo,nuevoPropietario){
    try{
        var resultado = execSync("sudo chown " + nuevoPropietario + " " + nombreArchivo, {cwd: pathDefault});
        return { 'id': 1, 'mensaje': `${nuevoPropietario} es el nuevo propietario del archivo ${nombreArchivo}` };
    }catch(err){
        return { 'id': 0, 'mensaje': "Error en la operacion" +err};
    }
}

console.log(mostrarContenido());
console.log(crearCarpeta('Dir1'));
console.log(crearCarpeta('Dir2'));
console.log(ingresarHijo('Dir1'));
console.log(crearArchivo('hola'));
console.log(copiarArchivo('hola',1));
console.log(ingresarPadre());
console.log(ingresarHijo('Dir2'));
console.log(pegarArchivo());