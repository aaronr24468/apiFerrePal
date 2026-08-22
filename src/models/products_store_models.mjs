import { connection } from "../services/mysqlConnection.mjs";

export const getAllProducts = async () => {
    const query = `Select
        p.id,
        p.codigo_barras,
        p.nombre,
        p.marca,
        p.precio,
        p.stock,
        p.unidad_medida,
        group_concat(i.url separator ', ') as images
        from products AS p LEFT JOIN images_products as i on p.id = i.id_product GROUP BY p.id`;
    const [data] = await connection.query(query)
    return (data)
}

export const insert_New_Product = async (data) => {
    const query = `INSERT INTO products(
    codigo_barras,
    sku,
    nombre,
    descripcion,
    categoria,
    categoria_ferreteria,
    marca,
    precio,
    costo,
    stock,
    stock_minimo,
    unidad_medida
    )
    values(?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    const [info] = await connection.query(query, [
        data.codigo_barras,
        data.sku,
        data.nombre,
        data.descripcion,
        data.categoria,
        data.categoria_ferreteria,
        data.marca,
        data.precio,
        data.costo,
        data.stock,
        data.stock_minimo,
        data.unidad_medida
    ])

    return (info)
}

export const upload_Image_product = async (data) => {
    const query = `INSERT INTO images_products(id_product, url)values(?,?)`;
    const [info] = await connection.query(query, [data.id, data.url]);
    return (info.affectedRows > 0)
}