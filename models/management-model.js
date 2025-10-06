const pool = require("../database/")

/* ***********
*   Register new controller
* ********* */
async function addController(classification_name) {
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}

async function checkExistingEmail(classification_name) {
    try {
        const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
        const email = await pool.query(sql, [classification_name])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

module.exports = { addController, checkExistingEmail }