import { celebrate, Joi, Segments } from 'celebrate';

export const productosSchema = Joi.object({
  // id: Joi.number().required(),
  cod: Joi.string().required(),
  descripcion: Joi.string().required(),
  // serie: Joi.string().required(),
  // id_clasificacion: Joi.number().required(),
  id_categoria: Joi.number().required(),
  medidas: Joi.string().required(),
  // cantidad: Joi.number().required(),
  // temperatura: Joi.string().required(),
  // id_caballete: Joi.number().required(),
  // obs: Joi.string(),
  // motivo: Joi.string(),
  // id_pvb: Joi.number().required(),
  // cod_empresa: Joi.number().required(),
  // cantidad_entrada: Joi.number(),
  // cantidad_utilizada: Joi.number(),
  // cantidad_inutilizada: Joi.number(),
  // id_proveedor: Joi.number().required(),
  // dimension_pvb: Joi.string(),

});

export const productosValidate = celebrate({
  [Segments.BODY]: productosSchema,
});