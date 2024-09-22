// import multer from "multer";
// import path from "path";
// import Product from "../database/entity/Product";
// import { AppDataSource } from "../database/data-source";

// const upload = multer({
//   limits: { fileSize: 5 * 1024 * 1024 },
//   storage: multer.diskStorage({
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const allowedFileTypes = ["jpg", "jpeg", "png"];
//     if (allowedFileTypes.includes(file.mimetype.split("/")[1])) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   },
// });

// export default upload;
// // utilitar care sa salveze fisiere ii dau fisierele de ep request
