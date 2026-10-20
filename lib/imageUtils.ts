/**
 * Tiện ích xử lý ảnh: Kiểm tra định dạng, dung lượng, nén & resize bằng Canvas
 */

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGE_DIMENSION = 1280; // cạnh dài tối đa 1280px
export const COMPRESSION_QUALITY = 0.8; // chất lượng nén JPEG/WEBP

export interface ProcessedImageResult {
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Định dạng "${file.name}" không hợp lệ. Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP.`,
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Ảnh "${file.name}" quá lớn (${(file.size / (1024 * 1024)).toFixed(1)}MB). Giới hạn tối đa là 10MB/ảnh.`,
    };
  }
  return { valid: true };
}

/**
 * Đọc file ảnh và nén/resize qua Canvas ở trình duyệt
 */
export async function resizeAndCompressImage(file: File): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Tính toán tỉ lệ để cạnh dài nhất không vượt quá MAX_IMAGE_DIMENSION
        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
            width = MAX_IMAGE_DIMENSION;
          } else {
            width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
            height = MAX_IMAGE_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Không thể khởi tạo Canvas 2D context"));
          return;
        }

        // Vẽ ảnh lên canvas với làm mịn
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Xuất ra định dạng nén JPEG hoặc WEBP (nếu gốc là PNG có nền trong suốt có thể giữ PNG hoặc nén WEBP)
        const outputMime = file.type === "image/png" ? "image/webp" : "image/jpeg";

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Lỗi chuyển đổi Canvas sang Blob"));
              return;
            }
            resolve({
              blob,
              width,
              height,
              originalSize: file.size,
              compressedSize: blob.size,
            });
          },
          outputMime,
          COMPRESSION_QUALITY
        );
      };

      img.onerror = () => reject(new Error(`Không thể giải mã dữ liệu ảnh ${file.name}`));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error(`Lỗi khi đọc file ${file.name}`));
    reader.readAsDataURL(file);
  });
}
