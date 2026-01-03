import { count, error } from 'console';
import Document from '../models/Document.js';
import {extractTextFromPDF} from '../utils/pdfParser.js';
import {chunkText} from '../utils/textChunker.js';
import fs from 'fs/promises';
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import mongoose from 'mongoose';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import path from "path";
import os from "os";
import axios from "axios";
import {getCloudinary} from "../config/cloudinary.js";


//@route POST /api/documents/upload
//@desc Upload and process a document
//@access Private
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "PDF required" });
    }

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: "Title required" });
    }

    // 1️⃣ Upload PDF to Cloudinary (RAW is fine for storage)
    const result = await uploadToCloudinary(req.file.buffer, "documents");

    // 2️⃣ Save minimal document first (fast response)
    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
      fileSize: req.file.size,
      status: "processing"
    });

    // 3️⃣ Background processing (DO NOT await)
    processPDF(document._id, result.secure_url)
      .catch(err => console.error("PDF processing failed:", err));

    res.status(200).json({
      success: true,
      data: document,
      message: "Uploaded. Processing started."
    });

  } catch (err) {
    next(err);
  }
};



//helper function to process pdf
const processPDF = async (documentId, fileUrl) => {
  const tempPath = path.join(os.tmpdir(), `${documentId}.pdf`);

  try {
    // 1️⃣ Download PDF from Cloudinary
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer"
    });

    await fs.writeFile(tempPath, response.data);

    // 2️⃣ Extract text (FILE PATH, not buffer)
    const { text } = await extractTextFromPDF(tempPath);

    // 3️⃣ Chunk text
    const chunks = chunkText(text, 500, 50);

    // 4️⃣ Update document
    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks,
      status: "ready"
    });

  } catch (err) {
    console.error("processPDF error:", err);

    await Document.findByIdAndUpdate(documentId, {
      status: "failed"
    });

  } finally {
    // 5️⃣ Cleanup temp file (important)
    await fs.unlink(tempPath).catch(() => {});
  }
};


//@desc Get all documents for a user
//@route GET /api/documents
//@access Private
export const getDocuments= async (req, res, next)=>{
    try{
        const documents=await Document.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
            {
                $lookup: {
                    from: 'flashcards',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'flashcards'
                }
            },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'quizzes'
            }
            },
            {
                $addFields:{
                    flashcardCount: { $size: '$flashcards' },
                    quizCount: { $size: '$quizzes' }
                }
            },
            {
                $project: {
                    extractedText: 0,
                    chunks: 0,
                    flashcardSets: 0,
                    quizzes: 0
                }
            },
            { $sort:{uploadDate:-1}}
        ]);
        res.status(200).json({
            success:true,
            count: documents.length,
            data: documents
        });
    }
    catch(error){
        next (error);
    }

}

//@desc Get a single document with chunks
//@route GET /api/documents/:id
//@access Private
export const getDocument= async (req, res, next)=>{
   try{ const document=await Document.findOne({
        _id: req.params.id,
        userId: req.user._id});
        if (!document) {
    return res.status(404).json({
        success: false,
        error: 'Document not found',
        statusCode: 404
    });
}

// Get counts of associated flashcards and quizzes
const flashcardCount = await Flashcard.countDocuments({ documentId: document._id, userId: req.user._id });
const quizCount = await Quiz.countDocuments({ documentId: document._id, userId: req.user._id });

// Update last accessed
document.lastAccessed = Date.now();
await document.save();

// Combine document data with counts
const documentData = document.toObject();
documentData.flashcardCount = flashcardCount;
documentData.quizCount = quizCount;

res.status(200).json({
    success: true,
    data: documentData
});}
 catch (error) {
    next(error);
}
}

//@desc Delete a document
//@route DELETE /api/documents/:id
//@access Private
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    const cloudinary = getCloudinary();

    // 🔥 delete from Cloudinary
    await cloudinary.uploader.destroy(document.cloudinaryId, {
      resource_type: "raw"
    });

    await document.deleteOne();

    res.status(200).json({ success: true, message: "Deleted successfully" });

  } catch (err) {
    next(err);
  }
};

