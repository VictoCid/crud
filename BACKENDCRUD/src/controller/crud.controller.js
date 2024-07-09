const pool = require('../bd');

const listarColaborador = async(req, res) =>{
    try {
        const resultado = await pool.query("select * from colaborador where id_estado = 1")
        res.json(resultado.rows);
    } catch (error) {
        res.json({error: error.message});
    }
}

const insertarColaborador = async(req, res) =>{
    try {
        const {rut,dv, nombre, apellido, correo, fono, direccion, id_comuna, id_estado, renta_bruta} = req.body;
        const resultado = await pool.query(
            "INSERT INTO colaborador(rut_colaborador, dv_colaborador, nombre, apellido, correo, fono, direccion, id_comuna, id_estado, renta_bruta) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
        [JSON.parse(rut), JSON.parse(dv), nombre, apellido, correo, JSON.parse(fono), direccion, JSON.parse(id_comuna), JSON.parse(id_estado), JSON.parse(renta_bruta) ]
        );
        res.json(resultado.rows[0]);
        res.status(200).send();
    } catch (error) {
        res.json({error: error.message});
    }
}

const eliminarColaborador = async(req, res) =>{
    try {
        const {rut} = req.body;
        const resultado = await pool.query(
            "delete from colaborador where rut_colaborador = $1",
        [rut]
        );
        console.log(resultado)
        res.json('Colaborador eliminado con exito')
    } catch (error) {
        console.log('Se produjo un error al eliminar el colaborador')
        res.json({error: error.message});
    }
}


const buscarColaborador = async(req, res) =>{
    const {rut} = req.params;
    try {
        const resultado = await pool.query(
            "Select * from colaborador where rut_colaborador = $1",
        [rut]
        );
        if (resultado.rows.length === 0){
            return res.status(404).json({
                message:"Colaborador no encontrado"
            })
        }
        res.json(resultado.rows[0])
    } catch (error) {
        res.json({error: error.message});
    }
}

const actualizarColaborador = async(req, res) =>{
    try {
        const {rut,dv, nombre, apellido, correo, fono, direccion, id_comuna, id_estado, renta_bruta} = req.body;
        const resultado = await pool.query(
            "Update colaborador set dv_colaborador = $2, nombre = $3, apellido = $4, correo = $5, fono = $6, direccion = $7, id_comuna = $8, id_estado = $9, renta_bruta = $10 where rut_colaborador = $1",
        [JSON.parse(rut), JSON.parse(dv), nombre, apellido, correo, JSON.parse(fono), direccion, JSON.parse(id_comuna), JSON.parse(id_estado), JSON.parse(renta_bruta)]
        );
        console.log(resultado);
        res.send('Colaborador actualizado con exito')
    } catch (error) {
        console.log('Se produjo un error al actualizar el colaborador')
        res.json({error: error.message});
    }
}





const listarAsignacion = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const resultado = await pool.query(`
            SELECT 
                asignacion.*, 
                clientes.nombre_cliente,
                estado_cliente.desc_estado_cliente 
            FROM asignacion 
            INNER JOIN clientes ON asignacion.id_cliente = clientes.id_cliente
            INNER JOIN estado_cliente ON asignacion.id_estado_asignacion = estado_cliente.id_estado_cliente
            LIMIT $1 OFFSET $2
        `, [limit, offset]);

        res.json(resultado.rows);
    } catch (error) {
        console.error("Error en la consulta SQL:", error.message);
        res.status(500).json({ error: error.message });
    }
};




const insertarAsignacion = async (req, res) => {
    const { rut_colaborador, id_cliente, fecha_inicio, fecha_fin, fecha_real_fin, id_estado_asignacion } = req.body;

    // Validar entrada
    if (!rut_colaborador || !id_cliente || !fecha_inicio || !id_estado_asignacion) {
        return res.status(400).json({ error: 'Por favor, completa todos los campos obligatorios.' });
    }

    try {
        const resultado = await pool.query(
            `INSERT INTO asignacion (id_asignacion, rut_colaborador, id_cliente, fecha_inicio, fecha_fin, fecha_real_fin, id_estado_asignacion)
             VALUES ((SELECT COALESCE(MAX(id_asignacion), 0) + 1 FROM asignacion), $1, $2, $3, $4, $5, $6)`,
            [rut_colaborador, id_cliente, fecha_inicio, fecha_fin || null, fecha_real_fin || null, id_estado_asignacion]
        );
        res.status(201).json({ message: 'Asignación creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const eliminarAsignacion = async (req, res) => {
    const { id_asignacion } = req.body;

    if (!id_asignacion) {
        return res.status(400).json({ error: 'ID de asignación es obligatorio.' });
    }

    try {
        const resultado = await pool.query("DELETE FROM asignacion WHERE id_asignacion = $1 RETURNING *", [id_asignacion]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Asignación no encontrada.' });
        }

        res.json({ message: 'Asignación eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarAsignacion = async (req, res) => {
    const { id } = req.params; // Cambia a params
    const { rut_colaborador, id_cliente, fecha_inicio, fecha_fin, fecha_real_fin, id_estado_asignacion } = req.body;

    if (!id || !rut_colaborador || !id_cliente || !fecha_inicio || !id_estado_asignacion) {
        return res.status(400).json({ error: 'Por favor, completa todos los campos obligatorios.' });
    }

    try {
        const resultado = await pool.query(
            `UPDATE asignacion
             SET rut_colaborador = $2, id_cliente = $3, fecha_inicio = $4, fecha_fin = $5, fecha_real_fin = $6, id_estado_asignacion = $7
             WHERE id_asignacion = $1 RETURNING *`,
            [id, rut_colaborador, id_cliente, fecha_inicio, fecha_fin || null, fecha_real_fin || null, id_estado_asignacion]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Asignación no encontrada.' });
        }

        res.json({ message: 'Asignación actualizada con éxito', asignacion: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const buscarAsignacion = async(req, res) =>{
    const {id} = req.params;
   
    try {
        const resultado = await pool.query(
            "Select id_asignacion, rut_colaborador, id_cliente, to_char(fecha_inicio,'yyyy-MM-dd') as fecha_inicio , to_char(fecha_fin,'yyyy-MM-dd') as fecha_fin, to_char(fecha_real_fin,'yyyy-MM-dd') as fecha_real_fin, id_estado_asignacion from asignacion where id_asignacion = $1",
        [id]
        );
      
        if (resultado.rows.length === 0){
            return res.status(404).json({
                message:"Asignacion no encontrada"
            })
        }
        res.json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    listarColaborador,
    insertarColaborador,
    eliminarColaborador,
    buscarColaborador,
    actualizarColaborador,
    listarAsignacion,
    insertarAsignacion,
    eliminarAsignacion,
    actualizarAsignacion,
    buscarAsignacion
}