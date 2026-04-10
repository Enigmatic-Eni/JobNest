const pdf = require("pdf-parse");
// const pdf = typeof pdfParse === "function" ? pdfParse : pdfParse.default;
const mammoth = require('mammoth');
const supabase = require('../config/supabase');



console.log("pdf-parse type:", typeof pdf);
console.log("pdf-parse default type:", typeof pdf.default);

const extractTextFromCV = async (storagePath, mimeType) => {
  try {
    // Download file buffer from supabase
    const { data, error } = await supabase.storage
      .from('documents')
      .download(storagePath);

    if (error || !data) {
      console.error("Supabase download error:", error);
      throw new Error("Failed to download CV from storage");
    }

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let cvText = '';

    if (mimeType === "application/pdf") {
      const parsed = await pdf(buffer);
      cvText = parsed.text || '';
    } 
    else if (mimeType.includes('word') || mimeType.includes('officedocument.wordprocessingml')) {
      const result = await mammoth.extractRawText({ buffer });
      cvText = result.value || '';
    } 
    else {
      throw new Error("Unsupported file type: " + mimeType);
    }

    // ✅ ALWAYS RETURN STRING (THE FIX!)
    cvText = cvText || '';
    console.log("📄 Extracted CV text length:", cvText.length);

    if (cvText.trim().length < 50) {
      throw new Error("CV too short. Please upload a CV with selectable text (not scanned image).");
    }

    return cvText;
  } catch (error) {
    console.error("CV extraction failed:", error.message);
    throw error;
  }
};

module.exports = { extractTextFromCV };