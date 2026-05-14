const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const supabase = require("../config/supabase");
const { PDFDocument } = require("pdf-lib");

// ---------------------- EXTRACT LINKS FROM PDF ----------------------
// pdf-parse only extracts text — it strips hyperlinks
// pdf-lib reads the annotation layer where links are stored separately
const extractLinksFromPDF = async (buffer) => {
  try {
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const links = [];

    const pages = pdfDoc.getPages();

    for (const page of pages) {
      try {
        // Get the raw page dictionary
        const pageNode = page.node;
        const annotsRef = pageNode.get(pageNode.doc.context.obj("Annots"));

        if (!annotsRef) continue;

        const annots = pageNode.doc.context.lookup(annotsRef);
        if (!annots || !annots.asArray) continue;

        for (const annotRef of annots.asArray()) {
          try {
            const annot = pageNode.doc.context.lookup(annotRef);
            if (!annot) continue;

            const action = annot.get(pageNode.doc.context.obj("A"));
            if (!action) continue;

            const uri = action.get(pageNode.doc.context.obj("URI"));
            if (!uri) continue;

            const url = uri.decodeText ? uri.decodeText() : uri.asString?.();
            if (url && url.startsWith("http")) {
              links.push(url);
            }
          } catch {
            // skip bad annotation
          }
        }
      } catch {
        // skip bad page
      }
    }

    return [...new Set(links)]; // remove duplicates
  } catch (error) {
    console.error("PDF link extraction failed:", error.message);
    return [];
  }
};

// ---------------------- EXTRACT LINKS FROM DOCX ----------------------
// mammoth can intercept hyperlink elements during conversion
const extractLinksFromDocx = async (buffer) => {
  try {
    const links = [];

    await mammoth.convertToHtml(
      { buffer },
      {
        transformDocument: (element) => {
          if (element.type === "hyperlink" && element.href) {
            links.push(element.href);
          }
          return element;
        }
      }
    );

    return [...new Set(links)];
  } catch (error) {
    console.error("DOCX link extraction failed:", error.message);
    return [];
  }
};

// ---------------------- MAIN EXPORT ----------------------
const extractTextFromCV = async (storagePath, mimeType) => {
  try {
    const { data, error } = await supabase.storage
      .from("documents")
      .download(storagePath);

    if (error || !data) {
      throw new Error("Failed to download CV from storage");
    }

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let cvText = "";
    let links = [];

    if (mimeType === "application/pdf") {
      const parsed = await pdf(buffer);
      cvText = parsed.text || "";
      links = await extractLinksFromPDF(buffer);
    } else if (
      mimeType.includes("word") ||
      mimeType.includes("officedocument.wordprocessingml")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      cvText = result.value || "";
      links = await extractLinksFromDocx(buffer);
    } else {
      throw new Error("Unsupported file type: " + mimeType);
    }

    cvText = cvText || "";

    console.log("📄 Extracted CV text length:", cvText.length);
    console.log("🔗 Extracted links:", links);

    if (cvText.trim().length < 50) {
      throw new Error(
        "CV too short. Please upload a CV with selectable text (not a scanned image)."
      );
    }

    // Return both text and links
    return { cvText, links };
  } catch (error) {
    console.error("CV extraction failed:", error.message);
    throw error;
  }
};

module.exports = { extractTextFromCV };