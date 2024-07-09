const {Router} = require('express');
const { listarColaborador, insertarColaborador, eliminarColaborador, buscarColaborador, actualizarColaborador, listarAsignacion, insertarAsignacion, eliminarAsignacion, actualizarAsignacion, buscarAsignacion } = require('../controller/crud.controller');
 listarColaborador, insertarColaborador, eliminarColaborador, buscarColaborador, actualizarColaborador, listarAsignacion, insertarAsignacion, eliminarAsignacion, actualizarAsignacion, buscarAsignacion
 
 const router = Router();
 

//CRUD de colaborador

 router.get('/datos', listarColaborador);
 router.post('/datos', insertarColaborador);
 router.delete('/datos', eliminarColaborador);
 router.put('/datos', actualizarColaborador)
 router.get('/datos/:rut', buscarColaborador)


// CRUD de asignaciones
router.get('/asignacion', listarAsignacion);
router.post('/asignacion', insertarAsignacion);
router.delete('/asignacion', eliminarAsignacion);
router.put('/asignacion/:id', actualizarAsignacion); // :id
router.get('/asignacion/:id', buscarAsignacion);

module.exports = router;
