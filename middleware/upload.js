const cloudinary  = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
});

// Helper — create a Cloudinary-backed multer storage for a given folder
function makeStorage(folder, allowPDF = false) {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder:          `nimsa-se/${folder}`,
      allowed_formats: allowPDF
        ? ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf']
        : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      resource_type:   'auto',
      transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });
}

// File filter
const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif|webp/i;
  const ext  = file.originalname.split('.').pop().toLowerCase();
  const mime = file.mimetype;

  if (imageTypes.test(ext) && imageTypes.test(mime)) return cb(null, true);
  if ((ext === 'pdf' || mime === 'application/pdf') && file.fieldname === 'pdfFile') return cb(null, true);
  cb(new Error('Only image files (jpg, png, webp) or PDF files are allowed'));
};

const limits      = { fileSize:  5 * 1024 * 1024 }; // 5MB for images
const limitsLarge = { fileSize: 20 * 1024 * 1024 }; // 20MB for PDFs/bulletins

module.exports = {
  cloudinary, // export so admin routes can delete files

  uploadExec:     multer({ storage: makeStorage('executives'),       fileFilter, limits }),
  uploadEvent:    multer({ storage: makeStorage('events'),           fileFilter, limits }),
  uploadBulletin: multer({ storage: makeStorage('bulletins', true),  fileFilter, limits: limitsLarge }),
  uploadNews:     multer({ storage: makeStorage('news'),             fileFilter, limits }),
  uploadGallery:  multer({ storage: makeStorage('gallery'),          fileFilter, limits }),
};
