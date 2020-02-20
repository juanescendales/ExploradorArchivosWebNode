const express = require('express');
const fs = require('fs');
const { execSync } = require("child_process");

const router = express.Router();

const funciones = require('../funciones');

router.get('/',async (req,res)=>{
    const contenido = funciones.mostrarContenido();
    console.log(contenido);
    res.render('index',{contenido});
});

router.post('/accessChild',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.ingresarHijo(name);
    res.json({'response':'success'});
});

router.post('/accessParent',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.ingresarPadre();
    res.json({'response':'success'});
});

router.post('/createFile',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.crearArchivo(name);
    res.json({'response':'success'});
});

router.post('/createDir',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.crearCarpeta(name);
    res.json({'response':'success'});
});

router.post('/rename',async (req,res)=>{
    const {name} = req.body;
    const {newName} = req.body;
    console.log(name +"/-/"+newName);
    const respuesta =  funciones.cambiarNombre(name,newName);
    res.json({'response':'success'});
});

router.post('/delete',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.borrarArchivo(name,newName);
    res.json({'response':'success'});
});

router.post('/copy',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.copiarArchivo(name);
    res.json({'response':'success'});
});

router.post('/cut',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.copiarArchivo(name,true);
    res.json({'response':'success'});
});

router.post('/paste',async (req,res)=>{
    const respuesta =  funciones.pegarArchivo();
    res.json({'response':'success'});
});

router.post('/chmod',async (req,res)=>{
    const {name} = req.body;
    const {permissions} = req.body;
    console.log(name +"/-/"+permissions);
    const respuesta =  funciones.cambiarPermisos(name,permissions);
    res.json({'response':'success'});
});

router.post('/chown',async (req,res)=>{
    const {name} = req.body;
    const {newOwner} = req.body;
    console.log(name +"/-/"+newOwner);
    const respuesta =  funciones.cambiarPropitario(name,newOwner);
    res.json({'response':'success'});
});

module.exports = router;