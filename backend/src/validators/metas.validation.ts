import { celebrate, Joi, Segments } from 'celebrate';

export const metasSchema = Joi.object({
  id_grupo: Joi.number().required(),
  id_plus: Joi.number().required(),
  motivo: Joi.string().required(),
  bono_produccion: Joi.number().required(),
  specialUserBonuses: Joi.array().items(
    Joi.object({
      userId: Joi.number().required(),
      bonus: Joi.number().required(),
    })
  ).optional(),
});

export const metasValidate = celebrate({
  [Segments.BODY]: metasSchema,
});