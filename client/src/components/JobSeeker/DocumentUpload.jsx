import React from "react";
import { Upload, Eye, Trash2 } from "lucide-react";


export default function DocumentUpload({ label, documentType, document, onUpload, onDelete, required }) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
      <div className="flex-1">
        <p className="font-medium text-[14px] text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </p>
        {document?.filename && (
          <p className="text-[12px] text-gray-500 mt-1">
            {document.filename}
            <span className="ml-2 text-[10px] text-gray-400">
              {new Date(document.uploadedAt).toLocaleDateString()}
            </span>
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {document?.url ? (
          <>
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-[12px]"
            >
              <Eye className="w-3 h-3" />
              <span>View</span>
            </a>
            <button
              onClick={() => onDelete(documentType)}
              className="flex items-center space-x-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all text-[12px]"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </>
        ) : (
          <label className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-all text-[12px]">
            <Upload className="w-3 h-3" />
            <span>Upload</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => onUpload(e, documentType)}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}