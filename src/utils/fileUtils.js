export const fileUtils = {
    convertToBase64: (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
  
    formatFileSize: (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
  
    getFileExtension: (filename) => {
      return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    },
  
    isImageFile: (file) => {
      return file.type.startsWith('image/');
    },
  
    isPdfFile: (file) => {
      return file.type === 'application/pdf';
    },
  
    validateFile: (file, maxSize = 5 * 1024 * 1024) => { // 5MB default
      const errors = [];
      
      if (file.size > maxSize) {
        errors.push(`File size must be less than ${fileUtils.formatFileSize(maxSize)}`);
      }
  
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        errors.push('File type not supported');
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  };