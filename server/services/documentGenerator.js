const {Document, Paragraph, TextRun, Packer} = require('docx')
const supabase = require('../config/supabase')

const generateBuffer = async(content)=>{
    const lines = content.split('\n').filter(line=>line.trim());

    const paragraphs = lines.map((line)=>{
        const trimmed = line.trim();

        // if the text is a header (Upper case, make it bold and have a font size of 13)
        if(trimmed === trimmed.toUpperCase() &&
            trimmed.length > 2 &&
            !trimmed.includes("@")&&
            !trimmed.includes("|")){
                return new Paragraph({
                    children: [new TextRun({text: trimmed, bold: true, size: 26})],
                    spacing: {before: 300, after: 100}
                });

            }

               if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
      return new Paragraph({
        children: [
          new TextRun({
            text: trimmed.replace(/^[•-]\s*/, ""), // remove the bullet symbol
            size: 22
          })
        ],
        bullet: { level: 0 },
        spacing: { after: 60 }
      });
    }
    
     return new Paragraph({
      children: [new TextRun({ text: trimmed, size: 22 })],
      spacing: { after: 80 }
    });

    })

    // Build the Word document
  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }]
  });

  // Convert to buffer — a binary representation of the file
  return await Packer.toBuffer(doc);
}


// Takes the buffer, uploads it to Supabase, returns a signed URL
const uploadToSupabase = async (buffer, filePath, contentType) => {
  // Upload the buffer to Supabase storage
  const { error } = await supabase.storage
    .from("documents")
    .upload(filePath, buffer, {
      contentType,
      upsert: true // overwrite if file already exists for this job
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error("Failed to upload generated document");
  }

  // Generate a signed URL valid for 7 days

  const { data: signedData, error: signedError } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, 60 * 60 * 24 * 7);

  if (signedError) {
    console.error("Signed URL error:", signedError);
    throw new Error("Failed to generate document URL");
  }

  return {
    storagePath: filePath,
    url: signedData.signedUrl
  };
};

// ---------------------- MAIN FUNCTION ----------------------
// Called by the controller — generates DOCX and uploads to Supabase
const generateAndUploadDocument = async (content, userId, jobId, docType) => {
  // Build the file path in Supabase storage
  // e.g. users/abc123/generated/cv_jobId123.docx
  const filePath = `users/${userId}/generated/${docType}_${jobId}.docx`;

  // Convert Gemini text to DOCX buffer
  const docxBuffer = await generateBuffer(content);

  // Upload to Supabase and get signed URL
  const result = await uploadToSupabase(
    docxBuffer,
    filePath,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );

  return {
    docxUrl: result.url,
    docxPath: result.storagePath
  };
};

module.exports = { generateAndUploadDocument };