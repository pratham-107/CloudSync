export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + "m ago";
  if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + "h ago";
  if (diffInSeconds < 2592000) return Math.floor(diffInSeconds / 86400) + "d ago";
  return formatDate(dateString);
}

export function getFileTypeCategory(mimeType, filename = "") {
  if (!mimeType) {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
    if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "video";
    if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "audio";
    if (ext === "pdf") return "pdf";
    if (["doc", "docx", "txt", "rtf", "md"].includes(ext)) return "document";
    if (["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
    return "file";
  }

  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType === "text/plain" ||
    mimeType === "text/markdown"
  ) return "document";
  if (mimeType.includes("sheet") || mimeType.includes("excel") || mimeType === "text/csv") return "spreadsheet";
  if (mimeType.includes("zip") || mimeType.includes("compressed") || mimeType.includes("tar")) return "archive";
  return "file";
}

export function isImage(mimeType) {
  return mimeType ? mimeType.startsWith("image/") : false;
}

export function isVideo(mimeType) {
  return mimeType ? mimeType.startsWith("video/") : false;
}

export function isAudio(mimeType) {
  return mimeType ? mimeType.startsWith("audio/") : false;
}

export function isPdf(mimeType) {
  return mimeType === "application/pdf";
}

export async function downloadFile(url, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = blobUrl;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download error:", error);
    window.open(url, "_blank");
  }
}
