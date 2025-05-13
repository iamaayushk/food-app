import * as Yup from "yup";
const validationSchema = Yup.object().shape({
    fullName:Yup.string()
    .required("Name is required"),
    
    
    phoneNumber:Yup.string()
    .required("Phone number is required").matches(/^[0-9]+$/,"Phone number must be a digit")
    .min(10,"Number must be atleast 10 digits"),
})
export default validationSchema;