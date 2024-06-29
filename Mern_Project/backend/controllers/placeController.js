let path = require("path");
const imageDownloader = require("image-downloader");
const fs = require("fs");
const placeModel = require("../models/placeModel");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { all } = require("../routes/placeRouter");
const uniqid = require("uniqid");
const mime = require("mime-types");

// const photoLinkController = async (req, res) => {
//   const { photoLink } = req.body;
//   const imgName = new Date().getTime() + ".jpg";
//   try {
//     await imageDownloader.image({
//       url: photoLink,
//       dest: path.join(__dirname, "../uploads/", imgName),
//     });

//     return res.status(200).json({ imgName: imgName });
//   } catch (err) {
//     console.log(err);
//   }
// };

// const uploadPhotoController = async (req, res) => {
//   // res.json(req.files);
//   try {
//     const files = req.files;
//     const uploadedPhots = [];

//     for (let i = 0; i < files.length; i++) {
//       const { originalname, path } = req.files[i];
//       let splitExt = originalname.split(".");
//       let ext = splitExt[splitExt.length - 1];
//       let newPath = path + "." + ext;
//       fs.renameSync(path, newPath);
//       newPath = newPath.replace("uploads\\", "");
//       uploadedPhots.push(newPath);
//     }
//     res.status(200).json({ uploadedPhots: uploadedPhots });
//   } catch (err) {
//     console.log(err);
//   }
// };

// Photo Link Controller
const photoLinkController = async (req, res) => {
  const { photoLink } = req.body;
  if (
    !photoLink ||
    (!photoLink.startsWith("http://") && !photoLink.startsWith("https://"))
  ) {
    return res.status(400).json({ msg: "Invalid URL provided" });
  }

  const uniqueFilename = uniqid() + ".jpg";
  const tempDir = path.join(__dirname, "../temp/");
  const imagePath = path.join(tempDir, uniqueFilename);

  // Ensure the temp directory exists
  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating temp directory:", err);
    return res
      .status(500)
      .json({ msg: "Error creating temp directory", error: err });
  }

  try {
    await imageDownloader.image({
      url: photoLink,
      dest: imagePath,
    });

    const url = await uploadImages(
      imagePath,
      uniqueFilename,
      mime.lookup(imagePath)
    );
    console.log(url);
    return res.json({ url });
  } catch (err) {
    console.error("Error downloading image:", err);
    return res.status(500).json({ msg: "Error downloading image", error: err });
  }
};

// Upload Images to S3
async function uploadImages(filePath, originalFileName, mimetype) {
  try {
    const client = new S3Client({
      region: "ap-southeast-2",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
    });

    const data = await client.send(
      new PutObjectCommand({
        Bucket: "kaushik-booking-app",
        Key: originalFileName,
        Body: fs.readFileSync(filePath),
        ACL: "public-read",
        ContentType: mimetype,
      })
    );

    // Clean up local file after upload
    fs.unlinkSync(filePath);

    return `https://kaushik-booking-app.s3.amazonaws.com/${originalFileName}`;
  } catch (err) {
    console.error("Error uploading to S3:", err);
    throw new Error("Error uploading to S3");
  }
}

// Upload Photo Controller
const uploadPhotoController = async (req, res) => {
  try {
    const files = req.files;
    const links = [];

    for (let i = 0; i < files.length; i++) {
      const { originalname, path, mimetype } = req.files[i];
      const singleLink = await uploadImages(path, originalname, mimetype);
      links.push(singleLink);
    }

    return res.status(200).json({ links: links });
  } catch (err) {
    console.error("Error uploading photos:", err);
    return res.status(500).json({ msg: "Error uploading photos", error: err });
  }
};

const createPlaceController = async (req, res) => {
  const {
    checkIn,
    checkOut,
    maxGuest,
    address,
    title,
    perks,
    photoLink,
    photos,
    extra,
    des,
    price,
  } = req.body;

  if (!title) {
    return res.status(400).json({ msg: "title required" });
  }
  if (!address) {
    return res.status(400).json({ msg: "address required" });
  }
  if (!des) {
    return res.status(400).json({ msg: "description required" });
  }
  if (!checkIn) {
    return res.status(400).json({ msg: "checkIn required" });
  }
  if (!checkOut) {
    return res.status(400).json({ msg: "checkOut required" });
  }
  if (!maxGuest) {
    return res.status(400).json({ msg: "maxGuest required" });
  }
  if (!price) {
    return res.status(400).json({ msg: "price required" });
  }
  if (photos.length === 0) {
    return res
      .status(400)
      .json({ msg: "upload photos either by link or uploading " });
  }

  try {
    const createPlace = placeModel.create({
      checkIn,
      checkOut,
      maxGuest,
      address,
      title,
      perks,
      photoLink,
      photos,
      extra,
      des,
      price,
      userId: req.userId,
    });

    return res
      .status(200)
      .json({ msg: "Place created", createPlace: createPlace });
  } catch (err) {
    console.log(err);
  }
};

const getPlaceController = async (req, res) => {
  let { id } = req.query;
  console.log(id);
  try {
    let allPlaces;
    if (id) {
      allPlaces = await placeModel
        .find({ userId: id })
        .sort({ createdAt: -1 })
        .populate("userId", ["_id"]);
    } else {
      allPlaces = await placeModel.find().sort({ createdAt: -1 });
    }

    if (allPlaces.length > 0) {
      return res.status(200).json({ allPlaces: allPlaces });
    } else {
      return res.status(404).json({ msg: "No places found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getSinglePlaceController = async (req, res) => {
  const { id } = req.params;
  try {
    const singlePlace = await placeModel
      .findById({ _id: id })
      .populate("userId", ["name", "email", "phone", "photo"]);

    if (singlePlace) {
      return res.status(200).json({ singlePlace: singlePlace });
    } else {
      return res.status(400).json({ msg: " place not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const deletePlaceController = async (req, res) => {
  const { id } = req.params;

  try {
    const allPlaces = await placeModel.findByIdAndDelete({ _id: id });

    if (allPlaces) {
      return res.status(200).json({ msg: "place deleted" });
    } else {
      return res.status(400).json({ msg: "no places found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const updatePlaceController = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return;
  }
  const {
    checkIn,
    checkOut,
    maxGuest,
    address,
    title,
    perks,
    photoLink,
    photos,
    extra,
    des,
    price,
  } = req.body;

  if (!title) {
    return res.status(400).json({ msg: "title required" });
  }
  if (!address) {
    return res.status(400).json({ msg: "address required" });
  }
  if (!des) {
    return res.status(400).json({ msg: "description required" });
  }
  if (!checkIn) {
    return res.status(400).json({ msg: "checkIn required" });
  }
  if (!checkOut) {
    return res.status(400).json({ msg: "checkOut required" });
  }
  if (!maxGuest) {
    return res.status(400).json({ msg: "maxGuest required" });
  }
  if (!price) {
    return res.status(400).json({ msg: "price required" });
  }
  if (photos.length === 0) {
    return res
      .status(400)
      .json({ msg: "upload photos either by link or uploading " });
  }

  try {
    const allPlaces = await placeModel.findById({ _id: id });

    if (allPlaces) {
      allPlaces.set({
        checkIn,
        checkOut,
        maxGuest,
        address,
        title,
        perks,
        photoLink,
        photos,
        extra,
        des,
        price,
      });
      await allPlaces.save();
      return res
        .status(200)
        .json({ msg: "place updated", allPlaces: allPlaces });
    } else {
      return res.status(400).json({ msg: "no places found" });
    }
  } catch (err) {
    console.log(err);
  }
};

//search place

const searchPlaceController = async (req, res) => {
  const { keyword } = req.params;
  try {
    const searchData = await placeModel.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { address: { $regex: keyword, $options: "i" } },
        // { price: { $regex: keyword, $options: "i" } },
        { des: { $regex: keyword, $options: "i" } },
        { extra: { $regex: keyword, $options: "i" } },
        // { country: { $regex: keyword, $options: "i" } },
      ],
    });

    if (searchData) {
      return res.status(200).json({ searchData: searchData });
    } else {
      return res.status(400).json({ message: " place not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  photoLinkController,
  uploadPhotoController,
  createPlaceController,
  getPlaceController,
  getSinglePlaceController,
  deletePlaceController,
  updatePlaceController,
  searchPlaceController,
};
