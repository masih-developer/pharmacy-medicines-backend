const yup = require("yup");

const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const medicineValidationSchema = yup.object({
  name: yup
    .string()
    .min(1, "نام محصول می بایست حداقل 1 کاراکتر باشد.")
    .max(50, "نام محصول می بایست حداکثر 50 کاراکتر باشد."),
  expire: yup
    .string()
    .matches(isoPattern, "تاریخ وارد شده باید به فرمت ISO باشد.") // Custom error message for non-ISO dates
    .required("تاریخ انقضا الزامی است."),
  code: yup.number().typeError("کد کالا می بایست یک مقدار عددی باشد!"),
  quantity: yup.number().typeError("موجودی کالا می بایست یک مقدار عددی باشد!"),
  price: yup
    .number()
    .typeError("قیمت کالا می بایست یک مقدار عددی باشد!")
    .min(0, "قیمت وارد شده معتبر نمی باشد."),
  type: yup
    .string()
    .min(1, "نوع محصول می بایست حداقل 1 کاراکتر باشد.")
    .max(20, "نوع محصول می بایست حداکثر 20 کاراکتر باشد."),
});

module.exports = { medicineValidationSchema };
