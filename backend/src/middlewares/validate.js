/**
 * validate(schema) => middleware que valida req.body/query/params con Zod
 * schema: { body?, query?, params? }
 */
module.exports = function validate(schema) {
  return (req, res, next) => {
    try {
      if (schema?.body) req.body = schema.body.parse(req.body);
      if (schema?.query) req.query = schema.query.parse(req.query);
      if (schema?.params) req.params = schema.params.parse(req.params);
      next();
    } catch (e) {
      res.status(422).json({ errors: e.errors || [{ message: 'Invalid data' }] });
    }
  };
};
