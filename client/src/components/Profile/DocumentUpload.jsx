import React from "react";
import { Upload, Trash2, ExternalLink, AlertCircle, FileText } from "lucide-react";

export default function DocumentUpload({
  label,
  documentType,
  document: doc,
  onUpload,
  onDelete,
  onView,  // NEW: Pass view handler from parent
  required
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleViewDocument = async () => {
    if (!doc?.storagePath) {
      setError("Document not available");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Call parent's view handler which will fetch fresh URL
      await onView(documentType);
    } catch (err) {
      console.error("Error viewing document:", err);
      setError("Failed to open document");
    } finally {
      setLoading(false);
    }
  };

  const getFileExtension = (filename) => {
    if (!filename) return "";
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "";
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes("pdf")) return "📄";
    if (mimeType?.includes("word")) return "📝";
    return "📎";
  };



  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">

      
      <div className="flex-1">
        <p className="font-medium text-[14px] text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </p>

        {doc?.filename ? (
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{getFileIcon(doc.mimeType)}</span>
              
              <div className="flex-1">
                <p className="text-[12px] text-gray-600 truncate max-w-xs font-medium">
                  {doc.filename}
                </p>
                
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                    {getFileExtension(doc.filename)}
                  </span>
                  
                  <span className="text-[10px] text-gray-400">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* View Document Button */}
            <button
              onClick={handleViewDocument}
              disabled={loading}
              className="flex items-center space-x-1 text-[12px] text-blue-600 hover:text-blue-800 font-medium"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{loading ? "Opening..." : "View Document"}</span>
            </button>
          </div>
        ) : (
          <p className="text-[12px] text-gray-400 mt-1">
            No document uploaded
          </p>
        )}

        {error && (
          <div className="mt-2 flex items-center space-x-1 text-[11px] text-red-600">
            <AlertCircle className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 ml-4">
        {doc?.filename ? (
          <button
            onClick={() => onDelete(documentType)}
            disabled={loading}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        ) : (
          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-[12px] font-medium">
            Upload
            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={(e) => onUpload(e, documentType)}
            />
          </label>
        )}
      </div>
    </div>
  );
}