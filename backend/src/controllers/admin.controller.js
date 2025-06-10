import{Song} from "../models/song.model.js";
import{Album} from "../models/album.model.js";

const uploadToCloudinary = async(file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resources_type: "auto",
        }); return result.secure_url
    } catch (error) {
        console.log("Error in UploadCloudinary", error);
        throw new Error("Error when uploading to Cloudinary ");// this throws the new error in the next try and catch function if the upload was failed

    }
}

export const createSong = async (req,res, next) => {
try {
    if(!req.files || !req.file.audioFile || !req.file.imageFile){
        return res.status(400).json({message: "Please upload all the files! "});
    }
    const {title, artist, albumId, duration} = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);
    
      const song = new Song({
        title, 
        artist,
        audioUrl,
        imageUrl,
        duration,
        album: albumId || null,
    });
    await song.save();

    //if the song belongs to an album , update the album's songs array
    if(albumId){
        await Album.findByidAndUpdate(albumId, {
            $push: {songs: song._id},
        });
    }  res.status(201).json(song);
} 
 catch (error) {
    console.log("Error in createSong", error);
    next(error);
}
}

export const deleteSong = async (req, res, next) => {
    try {
        const { id}  = req.params

        const song = await Song.findById(id)

        //if the song belongs to an album, update the album's array
        if(song.albumId){
            await Album.findByidAndUpdate(song.albumId, {
                $pull: { songs: song._id}
            })
        }
     await Song.findByIdAndDelete(id);
     res.status(200).json({message: "Song deleted successfully"});



    } catch (error) {
        console.log("Error in deleteSong");
       next(error) 
    }
}

export const createAlbum = async (req, res, next) => {
  try {
    const {title, artist, releaseYear} = req.body;
    const {imageFile} = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);
    const album = new Album({
        title, 
        artist, 
        imageUrl, 
        releaseYear
    });
    await album.save();
    res.status(201).json(album);
  } catch (error) {
    console.log("Error in createAlbum", error);
    next(error);
  }
}
export const deleteAlbum = async(req, res, next) => {
 try {
    const{id} = req.params;
    await Song.deleteMany({albumId: id});
    await Album.findByIdAndDelete(id);
    res.status(201).json({message: "Album deleted successfully "});
 } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
 }
}
export const checkAdmin = async(req, res, next) => {
   res.status(200).json({admin: true});
}