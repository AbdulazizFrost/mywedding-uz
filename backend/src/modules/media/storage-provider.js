export class StorageProvider {
  /**
   * Upload a file and return its storage key.
   * @param {Object} file - The file object from Multer
   * @returns {Promise<String>} The storage key (stable path)
   */
  async upload(file) {
    throw new Error('Not implemented');
  }

  /**
   * Deletes a file by its storage key.
   * @param {String} storageKey - The storage key returned by upload()
   * @returns {Promise<Boolean>}
   */
  async delete(storageKey) {
    throw new Error('Not implemented');
  }

  /**
   * Generates a public URL for a given storage key.
   * @param {String} storageKey 
   * @returns {String}
   */
  getPublicUrl(storageKey) {
    throw new Error('Not implemented');
  }
}
