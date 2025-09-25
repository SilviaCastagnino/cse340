const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id 
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

/* ***************************
 *  Get details items by details id
 * ************************** */
async function getInventoryByDetailsId(details_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory  
            WHERE inv_id = $1`,
            [details_id]
        )
        return data.rows
    } catch (error) {
        console.error("getdetailsbyid error " + error)
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryByDetailsId }

