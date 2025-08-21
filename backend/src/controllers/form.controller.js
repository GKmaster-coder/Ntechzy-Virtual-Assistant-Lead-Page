import Form from "../models/form.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const saveForm = asyncHandler(async (req, res) => {
  const { name, phone, email, zip, agree } = req.body;

  if (!name || !phone || !email || !zip || agree === undefined) {
    throw new ApiError(400, "All fields are required");
  }

  const formData = await Form.create({ name, phone, email, zip, agree });

  return res
    .status(201)
    .json(new ApiResponse(201, formData, "Form Submitted Successfully"));
});


const getForms = asyncHandler(async (req, res) => {
    const forms = await Form.find();

    return res
        .status(200)
        .json(new ApiResponse(200, forms, "Form Fetched successfully"));
});

export{
    saveForm,
    getForms
}