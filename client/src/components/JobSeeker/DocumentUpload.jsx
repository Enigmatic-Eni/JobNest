import React from "react";
import { Upload, Trash2, ExternalLink, AlertCircle } from "lucide-react";

export default function DocumentUpload({
  label,
  documentType,
  document: doc,
  onUpload,
  onDelete,
  required
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleViewDocument = () => {
    if (!doc?.url) {
      setError("Document URL not available");
      return;
    }

    window.open(doc.url, "_blank", "noopener,noreferrer");
  };

  const getFileExtension = (filename) => {
    if (!filename) return "";
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "";
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
      <div className="flex-1">
        <p className="font-medium text-[14px] text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </p>

        {doc?.filename ? (
          <div className="mt-1 space-y-1">
            <div className="flex items-center space-x-2">
              <p className="text-[12px] text-gray-600 truncate max-w-xs">
                {doc.filename}
              </p>

              <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                {getFileExtension(doc.filename)}
              </span>
            </div>

            <p className="text-[10px] text-gray-400">
              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
            </p>
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
    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-[12px] font-medium"
  >
    Delete
  </button>
) : (
  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer">
    Upload
    <input
      type="file"
      hidden
      onChange={(e) => onUpload(e, documentType)}
    />
  </label>
)}

      </div>
    </div>
  );
}
