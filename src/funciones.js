const funciones = {};
const fs = require('fs');
const { execSync } = require("child_process");


funciones.rootPath = './root/';
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
        var directorios = execSync('ls -l', { cwd: funciones.pathDefault }).toString().split("\n");
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
    path = funciones.pathDefault + nombre + '/';
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
    pathViejo = funciones.pathDefault + viejoNombre;
    pathNuevo = funciones.pathDefault + nuevoNombre;
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
        path = funciones.pathDefault;
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
        path = funciones.pathDefault;
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
            var path = funciones.pathCopia.path+"/"+funciones.pathCopia.name;
            var comando = 'cp -R '+ path + ' ' + funciones.pathDefault;
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
        var comando = 'chmod -R '+ permisos + ' ' + nombreArchivo;
        console.log(comando);
        var resultado = execSync(comando, {cwd:funciones.pathDefault});
        console.log(resultado.toString());
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
funciones.permisosNumericosYTipo = permisosNumericosYTipo;
funciones.mostrarContenido =  mostrarContenido;
funciones.ingresarHijo = ingresarHijo;
funciones.ingresarPadre = ingresarPadre;
funciones.crearCarpeta = crearCarpeta;
funciones.cambiarNombre = cambiarNombre;
funciones.borrarArchivo = borrarArchivo;
funciones.copiarArchivo = copiarArchivo;
funciones.pegarArchivo = pegarArchivo;
funciones.cambiarPermisos = cambiarPermisos;
funciones.cambiarPropitario = cambiarPropitario;
funciones.existeUsuario = existeUsuario;

module.exports = funciones;