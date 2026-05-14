const {
  Document,
  Paragraph,
  TextRun,
  Packer,
  AlignmentType,
  BorderStyle,
  ExternalHyperlink
} = require("docx");
const supabase = require("../config/supabase");

// ---------------------- HELPERS ----------------------

// Check if a string is a URL
const isUrl = (text) => {
  return (
    text.startsWith("http://") ||
    text.startsWith("https://") ||
    text.startsWith("www.")
  );
};

// Create a clickable hyperlink TextRun
const createHyperlink = (url, displayText) => {
  const fullUrl = url.startsWith("www.") ? `https://${url}` : url;
  return new ExternalHyperlink({
    link: fullUrl,
    children: [
      new TextRun({
        text: displayText || url,
        style: "Hyperlink",
        size: 20,
        color: "0066cc",
        underline: { type: "single" }
      })
    ]
  });
};

// Parse the contact line — split by | and make URLs/emails clickable
// e.g. "john@email.com | +234 814 639 7327 | https://linkedin.com | https://portfolio.com"
const parseContactLine = (line) => {
  const parts = line.split("|").map((p) => p.trim());
  const runs = [];

  parts.forEach((part, index) => {
    if (isUrl(part)) {
      runs.push(createHyperlink(part, part));
    } else if (part.includes("@")) {
      // Email — mailto link
      runs.push(
        new ExternalHyperlink({
          link: `mailto:${part}`,
          children: [
            new TextRun({
              text: part,
              style: "Hyperlink",
              size: 20,
              color: "0066cc",
              underline: { type: "single" }
            })
          ]
        })
      );
    } else {
      runs.push(new TextRun({ text: part, size: 20, color: "444444" }));
    }

    // Separator between parts
    if (index < parts.length - 1) {
      runs.push(new TextRun({ text: " | ", size: 20, color: "888888" }));
    }
  });

  return runs;
};

// Parse a line that may contain a URL mixed with text
// e.g. "GitHub: https://github.com/user or some text https://example.com"
const parseMixedLine = (line) => {
  const urlRegex = /(https?:\/\/\S+|www\.\S+)/g;
  const parts = line.split(urlRegex);
  const runs = [];

  parts.forEach((part) => {
    if (isUrl(part)) {
      runs.push(createHyperlink(part, part));
    } else if (part.trim()) {
      runs.push(new TextRun({ text: part, size: 21, color: "333333" }));
    }
  });

  return runs;
};

// ---------------------- GENERATE DOCX BUFFER ----------------------
const generateDocxBuffer = async (content) => {
  const lines = content.split("\n").filter((line) => line.trim());
  const paragraphs = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // First line — candidate name, large and centered
    if (index === 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: trimmed, bold: true, size: 36, color: "1a1a1a" })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 }
        })
      );
      return;
    }

    // Contact line — contains | and @ or URLs
    if (trimmed.includes("|") && (trimmed.includes("@") || isUrl(trimmed))) {
      paragraphs.push(
        new Paragraph({
          children: parseContactLine(trimmed),
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        })
      );
      return;
    }

    // Section headers — ALL CAPS lines
    if (
      trimmed === trimmed.toUpperCase() &&
      trimmed.length > 2 &&
      !trimmed.includes("@") &&
      !trimmed.includes("|") &&
      !trimmed.match(/^\d/)
    ) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: trimmed, bold: true, size: 24, color: "1a1a1a" })
          ],
          spacing: { before: 300, after: 100 },
          border: {
            bottom: {
              color: "cccccc",
              space: 4,
              style: BorderStyle.SINGLE,
              size: 6
            }
          }
        })
      );
      return;
    }

    // Bullet points
    if (trimmed.startsWith("-") || trimmed.startsWith("•")) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed.replace(/^[-•]\s*/, ""),
              size: 21,
              color: "333333"
            })
          ],
          bullet: { level: 0 },
          spacing: { after: 60 }
        })
      );
      return;
    }

    // Job title / company lines — contain — or –
    if (trimmed.includes("—") || trimmed.includes("–")) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: trimmed, bold: true, size: 22, color: "222222" })
          ],
          spacing: { before: 120, after: 60 }
        })
      );
      return;
    }

    // Standalone URL lines — full line is just a URL
    if (isUrl(trimmed) && !trimmed.includes(" ")) {
      paragraphs.push(
        new Paragraph({
          children: [createHyperlink(trimmed, trimmed)],
          spacing: { after: 60 }
        })
      );
      return;
    }

    // Lines that contain URLs mixed with text
    if (trimmed.includes("http") || trimmed.includes("www.")) {
      paragraphs.push(
        new Paragraph({
          children: parseMixedLine(trimmed),
          spacing: { after: 80 }
        })
      );
      return;
    }

    // Regular text
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: trimmed, size: 21, color: "333333" })],
        spacing: { after: 80 }
      })
    );
  });

  const doc = new Document({
    styles: {
      characterStyles: [
        {
          id: "Hyperlink",
          name: "Hyperlink",
          run: {
            color: "0066cc",
            underline: { type: "single" }
          }
        }
      ]
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 }
          }
        },
        children: paragraphs
      }
    ]
  });

  return await Packer.toBuffer(doc);
};

// ---------------------- UPLOAD TO SUPABASE ----------------------
const uploadToSupabase = async (buffer, filePath, contentType) => {
  const { error } = await supabase.storage
    .from("documents")
    .upload(filePath, buffer, {
      contentType,
      upsert: true
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error("Failed to upload generated document");
  }

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
const generateAndUploadDocument = async (
  content,
  userId,
  jobId,
  docType,
  userName = "document"
) => {
  // Clean username for use in filename
  const cleanName = userName
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  // e.g. users/abc123/generated/motunrayo_sanni_cv_jobId123.docx
  const filePath = `users/${userId}/generated/${cleanName}_${docType}_${jobId}.docx`;

  const docxBuffer = await generateDocxBuffer(content);

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