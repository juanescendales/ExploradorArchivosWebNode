const fs = require('fs');
const { execSync } = require("child_process");

const rootPath = './root/';

var pathPadre = rootPath;
var pathDefault = rootPath;
var pathCopia = { 'typePaste': -1, 'path': '', 'name': '' };
var consulta = {'id':-1,'mensaje':'None'};
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
        if(permisosLetras[i] == 'r' || permisosLetras[i] == 'w' || permisosLetras[i] == 'x'){
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
            var directorio = x.split(" ");
            var info = permisosNumericosYTipo(directorio[0].split(''));
            lista.push({
                name: directorio[directorio.length - 1],
                permissions: info.permisos,
                propietario: directorio[2],
                tipo: info.tipo
            });
        });
        var response ={ 'general_id': 1, 'directorio': lista , 'consulta': consulta};
        consulta = {'id':-1,'mensaje':'None'};
        return response;
    }catch(err){
        var response ={ 'general_id': 0, 'directorio': err , 'consulta': 'Error General'};
        consulta = {'id':-1,'mensaje':'None'};
        return response;
    }
    
}

//Cambiar directorio hijo
function ingresarHijo(nombre) {
    path = pathDefault + nombre + '/';
    if (existeArchivo(path)) {
        pathPadre = pathDefault;
        pathDefault = path;
        consulta = { 'id': 1, 'mensaje': `Ingreso satisfactorio al hijo ${pathDefault} con padre ${pathPadre}` };
    } else {
        consulta = { 'id': 0, 'mensaje': `Este directorio ${path} no existe` };
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
    consulta = { 'id': 1, 'mensaje': `Ingreso satisfactorio al padre ${pathDefault}` };
}

//Crear carpeta
function crearCarpeta(nombre) {
    const totalPath = pathDefault + nombre
    if (existeArchivo(totalPath)) {
        consulta = { 'id': 0, 'mensaje': "Este directorio ya existe" };
    } else {
        fs.mkdirSync(totalPath);
        consulta = { 'id': 1, 'mensaje': `Directorio '${nombre}' creado satisfactoriamente` };
    }
}

//Crear archivo
function crearArchivo(nombre) {
    const totalPath = pathDefault + nombre
    if (existeArchivo(totalPath)) {
        consulta = { 'id': 0, 'mensaje': "Este archivo ya existe" };
    } else {
        fs.openSync(totalPath, 'w+');
        consulta = { 'id': 1, 'mensaje': `Archivo '${nombre}' creado satisfactoriamente` };
    }
}

//Cambiar nombre //Da error si la carpeta tiene algo 
function cambiarNombre(viejoNombre, nuevoNombre) {
    pathViejo = pathDefault + viejoNombre;
    pathNuevo = pathDefault + nuevoNombre;
    if (existeArchivo(pathViejo)) {
        fs.renameSync(pathViejo, pathNuevo);
        consulta = { 'id': 1, 'mensaje': "Se cambio el nombre satisfactoriamente" };
    } else {
        consulta = { 'id': 0, 'mensaje': `El archivo no existe` };
    }
}

//Borrar archivo
function borrarArchivo(nombreArchivo) {
    try{
        path = pathDefault;
        if(existeArchivo(path+nombreArchivo)){
            var comando = "rm -R " + nombreArchivo;
            var resultado = execSync(comando, { cwd: path }).toString()
            consulta = { 'id': 1, 'mensaje': `Se elimino el archivo ${nombreArchivo} correctamente` };
        }else{
            consulta = { 'id': 0, 'mensaje': `No existe el archivo/carpeta ${nombreArchivo}` };
        }
    }catch(err){
        consulta = { 'id': 0, 'mensaje': `Error al borrar el archivo/carpeta ${nombreArchivo}` };
    }
}

//Copiar/Cortar archivo
function copiarArchivo(nombreArchivo,cut = false) {
    try{
        path = pathDefault;
        if (existeArchivo(path+nombreArchivo)) {
            pathCopia = { 'typePaste': 0, 'path': path, 'name': nombreArchivo };
            if(cut){
                pathCopia = { 'typePaste': 1, 'path': path, 'name': nombreArchivo };
                
            }
            consulta = { 'id': 1, 'mensaje': `Se copio el directorio ${nombreArchivo} correctamente` };
        }else{
            consulta = { 'id': 0, 'mensaje': `No existe el archivo/carpeta ${nombreArchivo}` };
        }
    }catch(err){
        consulta = { 'id': 0, 'mensaje': `Error al copiar el archivo/carpeta ${nombreArchivo}` };
    }

}

//Pegar archivo // Da error al intentar cortar a un directorio con archivos

function pegarArchivo() {
    try{
        if (pathCopia.typePaste != -1) {
            var path = pathCopia.path+"/"+pathCopia.name;
            var comando = 'cp -R '+ path + ' ' + pathDefault;
            if(pathCopia.typePaste == 1){
                comando = 'mv '+ path+ ' ' + pathDefault;
            }
            var resultado = execSync(comando, { cwd: './'}).toString()
            pathCopia = { 'typePaste': -1, 'path': '', 'name': '' };
            consulta = { 'id': 1, 'mensaje': "Finalizo correctamente" };  
        } else {
            consulta = { 'id': 0, 'mensaje': "No se ha copiado/cortado ningun archivo antes" };
        }
    }catch(err){
        consulta = { 'id': 0, 'mensaje': "Error en la operacion" +err};
    }
    
}
//Cambiar permisos
function cambiarPermisos(nombreArchivo,permisos){
    try{
        var comando = 'chmod -R '+ permisos + ' ' + nombreArchivo;
        console.log(comando);
        var resultado = execSync(comando, {cwd:pathDefault});
        console.log(resultado.toString());
        consulta = { 'id': 1, 'mensaje': `${permisos} son los nuevo permisos del archivo ${nombreArchivo}` };
    }catch(err){
        consulta = { 'id': 0, 'mensaje': "Error en la operacion" +err};
    }
}

//Cambiar propietario
function cambiarPropitario(nombreArchivo,nuevoPropietario){
    try{
        if(existeUsuario(nuevoPropietario)){
            var resultado = execSync("sudo chown " + nuevoPropietario + " " + nombreArchivo, {cwd: pathDefault});
            consulta = { 'id': 1, 'mensaje': `${nuevoPropietario} es el nuevo propietario del archivo ${nombreArchivo}` };
        }else{
            consulta = { 'id': 0, 'mensaje': "El usuario no existe"};
        }
        
    }catch(err){
        consulta = { 'id': 0, 'mensaje': "Error en la operacion" +err};
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


