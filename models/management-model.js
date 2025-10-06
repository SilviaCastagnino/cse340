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

async function addInventory(make_name, model_name, year, description, img, thumbnail, price, miles, color, classification) {
    try {
        const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(sql, [make_name, model_name, year, description, img, thumbnail, price, miles, color, classification])
    } catch (error) {
        return error.message
    }
}

module.exports = { addController, checkExistingEmail, addInventory }