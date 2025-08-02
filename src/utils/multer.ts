import multer from "multer"

export const storageUserPhoto = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets/uploads/photos')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.mimetype.split('/')[1]

    const filename = `photo-${uniqueSuffix}.${extension}`

    cb(null, filename)
  }
})


export const storageGroupPhoto = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets/uploads/groups')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.mimetype.split('/')[1]

    const filename = `photo-${uniqueSuffix}.${extension}`

    cb(null, filename)
  }
})

export const storageGroupPaidPhoto = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "photo") {
      cb(null, 'public/assets/uploads/groups')
    } else {
      cb(null, 'public/assets/uploads/group_assets')
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.mimetype.split('/')[1]

    const filename = `${file.fieldname}-${uniqueSuffix}.${extension}`

    cb(null, filename)
  }
})

export const storagePhotoAttach = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets/uploads/attach_messages')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.mimetype.split('/')[1]

    const filename = `photo-${uniqueSuffix}.${extension}`

    cb(null, filename)
  }
})

export const storagePhotoProof = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets/uploads/approval')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.mimetype.split('/')[1]

    const filename = `approval-${uniqueSuffix}.${extension}`

    cb(null, filename)
  }
})