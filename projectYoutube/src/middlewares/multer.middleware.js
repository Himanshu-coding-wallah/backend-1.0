import multer from "multer"
// the file parameter have access to file uploaded in the form, express dont have this access
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
// original name is not a good practice because user might upload multiple filles of same name

export const upload = multer({ storage})
