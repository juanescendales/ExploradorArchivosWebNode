const fs = require('fs');
var pathPadre = './';
var pathDefault = './';
var pathCopia = {'type': -1, 'path': '','nombre':''};
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

//Mostrar contenido del directorio actual
function mostrarContenido() {
    if (existeArchivo(pathDefault)) {
        var dir = fs.opendirSync(pathDefault);
        directorios = [];
        directorio = dir.readSync();
        while (directorio != null) {
            directorios.push(directorio);
            directorio = dir.readSync();
        }

        return { 'id': 1, 'mensaje': directorios };

    } else {
        return { 'id': 0, 'mensaje': "Este directorio no existe" };
    }
}

//Cambiar directorio hijo
function ingresarHijo(nombre) {
    path = pathDefault + nombre + '/';
    if (existeArchivo(path)) {
        pathPadre = pathDefault;
        pathDefault = path;
        return { 'id': 1, 'mensaje': `Ingreso satisfactorio al hijo ${pathDefault} con padre ${pathPadre}`};
    } else {
        return { 'id': 0, 'mensaje': `Este directorio ${path} no existe` };
    }
}
//Devolverse una carpeta
function ingresarPadre() {
    if (pathPadre != './') {
        pathDefault = pathPadre
        pathPadre = pathPadre.substring(0,pathPadre.length-1);
        pathPadre = pathPadre.substring(0, pathPadre.lastIndexOf('/')+1);
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

//Cambiar nombre
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
    path = pathDefault + nombreArchivo;
    response = mostrarContenido();
    if (response.id == 1) {
        directorios = response.mensaje;
        var dirent = null;
        for (const directorio in directorios) {
            
            if (directorios[directorio].name == nombreArchivo) {
                dirent = directorios[directorio];
            }
        }
        if (dirent != null) {
            if (dirent.isDirectory()) {
                if (existeArchivo(path)) {
                    fs.rmdirSync(path,{ recursive: true });
                    return { 'id': 1, 'mensaje': `Se elimino el directorio ${nombreArchivo} correctamente` };
                }
            } else {
                if (existeArchivo(path)) {
                    fs.unlinkSync(path);
                    return { 'id': 1, 'mensaje': `Se elimino el archivo ${nombreArchivo} correctamente` };
                }
            }
        }
    }
    return { 'id': 0, 'mensaje': `Error al borrar el archivo/carpeta ${nombreArchivo}` };
}

//Copiar/Cortar archivo
function copiarArchivo(nombreArchivo){
    path = pathDefault + nombreArchivo;
    response = mostrarContenido();
    if (response.id == 1) {
        directorios = response.mensaje;
        var dirent = null;
        for (const directorio in directorios) {
            if (directorios[directorio].name == nombreArchivo) {
                dirent = directorios[directorio];
            }
        }
        if (dirent != null) {
            if (dirent.isDirectory()) {
                if (existeArchivo(path)) {
                    pathCopia = {'type': 0, 'path': path,'nombre':nombreArchivo}; //Directorio
                    return { 'id': 1, 'mensaje': `Se copio el directorio ${nombreArchivo} correctamente` };
                }
            } else {
                if (existeArchivo(path)) {
                    pathCopia = {'type': 1, 'path': path,'nombre':nombreArchivo}; //Archivo
                    return { 'id': 1, 'mensaje': `Se copio el archivo ${nombreArchivo} correctamente` };
                }
            }
        }
    }
    return { 'id': 0, 'mensaje': `Error al copiar el archivo/carpeta ${nombreArchivo}` };
}

//Pegar archivo

function pegarArchivo(cut = false){
    if(pathCopia.type != -1){
        fs.copyFileSync(pathCopia.path,pathDefault+pathCopia.nombre);
        if(cut){
            if(pathCopia.type == 0){
                fs.rmdirSync(pathCopia.path);
            }else{
                fs.unlinkSync(pathCopia.path);
            }
            pathCopia.type = {'type': -1, 'path': ''};
            return { 'id': 1, 'mensaje': 'Se corto el archivo correctamente ' };
        }
        pathCopia.type = {'type': -1, 'path': ''};
        return { 'id': 1, 'mensaje': "Se pego el archivo correctamente" };
    }else{
        return { 'id': 0, 'mensaje': "No se ha copiado/cortado ningun archivo" };
    }
}

console.log(mostrarContenido());
console.log(crearCarpeta('root'));
console.log(ingresarHijo('root'));
console.log(crearArchivo('hola'));
console.log(mostrarContenido());
console.log(cambiarNombre('hola','chao'));
console.log(ingresarPadre());
console.log(crearCarpeta('Pablo'));
console.log(ingresarHijo('Pablo'));
console.log(crearCarpeta('Corazon'));
console.log(ingresarHijo('Corazon'));
console.log(crearArchivo('Sangre'));
//console.log(ingresarPadre());
//console.log(borrarArchivo('Corazon'));
console.log(borrarArchivo('Sangre'));
console.log(ingresarPadre());
console.log(ingresarPadre());
console.log(ingresarPadre());
console.log(ingresarPadre());
console.log(ingresarPadre());
console.log(ingresarHijo('root'));
console.log(copiarArchivo('chao'));
console.log(ingresarPadre());
console.log(ingresarPadre());
console.log(ingresarPadre());
console.log(ingresarHijo('Pablo'));
console.log(ingresarHijo('Corazon'));
console.log(pegarArchivo(true));
console.log(ingresarPadre());
console.log(copiarArchivo('Corazon'));
console.log(ingresarPadre());
console.log(pegarArchivo());

