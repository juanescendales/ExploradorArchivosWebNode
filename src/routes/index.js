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

router.post('/ingresarCarpeta',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.ingresarHijo(name);
    res.redirect('/');
});

router.post('/createFile',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.crearArchivo(name);
    res.redirect('/');
});

router.post('/createDir',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.crearCarpeta(name);
    res.redirect('/');
});

router.post('/rename',async (req,res)=>{
    const {name} = req.body;
    const {newName} = req.body;
    console.log(name +"/-/"+newName);
    const respuesta =  funciones.cambiarNombre(name,newName);
    res.redirect('/');
});

router.post('/delete',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.borrarArchivo(name,newName);
    res.redirect('/');
});

router.post('/copy',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.copiarArchivo(name);
    res.redirect('/');
});

router.post('/cut',async (req,res)=>{
    const {name} = req.body;
    console.log(name);
    const respuesta =  funciones.copiarArchivo(name,true);
    res.redirect('/');
});

router.post('/paste',async (req,res)=>{
    const respuesta =  funciones.pegarArchivo();
    res.redirect('/');
});

router.post('/chmod',async (req,res)=>{
    const {name} = req.body;
    const {permissions} = req.body;
    console.log(name +"/-/"+permissions);
    const respuesta =  funciones.cambiarPermisos(name,permissions);
    res.redirect('/');
});

router.post('/chown',async (req,res)=>{
    const {name} = req.body;
    const {newOwner} = req.body;
    console.log(name +"/-/"+newOwner);
    const respuesta =  funciones.cambiarPropitario(name,newOwner);
    res.redirect('/');
});

module.exports = router;