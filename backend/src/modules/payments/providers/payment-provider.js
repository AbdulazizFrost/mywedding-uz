export class PaymentProvider {
  /**
   * Creates a payment request on the provider's side.
   * @param {Object} payment - The Payment record from DB
   * @param {Object} order - The Order record from DB
   * @returns {Promise<Object>} The provider's response containing payment URL, txn ID, etc.
   */
  async createPayment(payment, order) {
    throw new Error('Not implemented');
  }

  /**
   * Fetches the current payment status from the provider.
   * @param {String} providerTxnId - The transaction ID on the provider's side
   * @returns {Promise<String>} The normalized status: 'pending', 'success', 'failed', 'cancelled'
   */
  async getPaymentStatus(providerTxnId) {
    throw new Error('Not implemented');
  }

  /**
   * Cancels the payment on the provider's side.
   * @param {String} providerTxnId
   * @returns {Promise<Boolean>}
   */
  async cancelPayment(providerTxnId) {
    throw new Error('Not implemented');
  }

  /**
   * Handles incoming webhooks/callbacks from the provider.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async handleCallback(req, res) {
    throw new Error('Not implemented');
  }
}
