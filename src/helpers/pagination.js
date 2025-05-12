/**
 * Toma las cantidad de filas en la bd para calcular
 * Recibe el page de req.query.page (parametro entregado para saber la página que se desea desplegar)
 * Recibe el tipo de orden y el nombre por el atributo que se desea ordenar.
 */
const paginateQuery = (totalRows, page) => {
    let objQuery = {
    };
    let limit;
    let offset;
    if (totalRows <= 10) {
        limit = 10;
        offset = 0;
    } else {
        offset = parseInt(page) * 10;
        limit = offset + 10;
    }
    objQuery = { ...objQuery, limit: limit, offset: offset }
    return objQuery
}

module.exports = paginateQuery;