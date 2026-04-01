const pdfParse = require("pdf-parse");
const mammoth = require('mammoth')
const supabase = require('../config/supabase')

const extractTextFromCV = async(storagePath, mimeType)=>{
    try{
        // download file buffer from supabase
        const{data, error} = await supabase.storage
        .from('documents')
        .download(storagePath);

        if(error){
            console.error("Supabase download error: ", error)
            throw new Error("Failed to download CV from storage");
        }
        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        if(mimeType === "application/pdf"){
            const parsed = await pdfParse(buffer);
            return parsed.text;
        }
        if( mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"){
        const result = mammoth.extractRawText({buffer})
        return result.value;
      }
      throw new Error("File type not supported");

    }catch(error){
        console.error("Cv extraction failed ", error.message);
        throw new Error("Failed to extract text from CV")
        
    }
}

module.exports= {extractTextFromCV};

