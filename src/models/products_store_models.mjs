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
        p.categoria_ferreteria,
        p.descripcion,
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

export const editProductD = async (id, data) => {
    const query = `
    UPDATE products 
    SET nombre=?, 
    codigo_barras=?,
    categoria_ferreteria=?,
    marca=?,
    precio=?,
    unidad_medida=?,
    stock=?,
    descripcion=?
    WHERE id=?
    `;

    const [result] = await connection.query(query, [
        data.nombre,
        data.codigo_barras,
        data.categoria_ferreteria,
        data.marca,
        data.precio,
        data.unidad_medida,
        data.stock,
        data.descripcion,
        data.id
    ]);

    return (result.affectedRows === 1);

}

export const getProductsCategory = async (category) => {
    const query = `SELECT 
    p.id,
    p.codigo_barras,
    p.nombre,
    p.marca,
    p.precio,
    p.stock,
    p.unidad_medida,
    p.categoria_ferreteria,
    p.descripcion,
    group_concat(ip.url separator ', ') as images
    FROM products as p
    LEFT JOIN images_products as ip 
    on p.id = ip.id_product
    WHERE categoria_ferreteria=?  GROUP BY p.id; 
    `;
    const [products] = await connection.query(query, [category])
    return (products);
}