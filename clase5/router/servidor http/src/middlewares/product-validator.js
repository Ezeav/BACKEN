export const productValidator = (req, res, next) => {
  const { name, price, description, stock } = req.body;

  // Validar que todos los campos existan y no sean vacíos
  if (!name || name.trim() === "") {
    return res.status(400).json({
      error: "El campo 'name' es obligatorio y no puede estar vacío",
    });
  }

  if (price === undefined || price === null || price === "") {
    return res.status(400).json({
      error: "El campo 'price' es obligatorio",
    });
  }

  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({
      error: "El campo 'price' debe ser un número mayor o igual a 0",
    });
  }

  if (!description || description.trim() === "") {
    return res.status(400).json({
      error: "El campo 'description' es obligatorio y no puede estar vacío",
    });
  }

  if (stock === undefined || stock === null || stock === "") {
    return res.status(400).json({
      error: "El campo 'stock' es obligatorio",
    });
  }

  if (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
    return res.status(400).json({
      error: "El campo 'stock' debe ser un número entero mayor o igual a 0",
    });
  }

  return next();
};
