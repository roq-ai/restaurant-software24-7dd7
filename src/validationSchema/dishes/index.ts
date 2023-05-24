import * as yup from 'yup';
import { orderItemsValidationSchema } from 'validationSchema/order-items';

export const dishesValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  price: yup.number().integer().required(),
  availability: yup.boolean().required(),
  menu_id: yup.string().nullable(),
  order_items: yup.array().of(orderItemsValidationSchema),
});
