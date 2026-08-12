import { PaymentProvider } from './payment-provider.js';
import crypto from 'crypto';

export class MockPaymentProvider extends PaymentProvider {
  async createPayment(payment, order) {
    // In mock, we just generate a fake transaction ID and say it's pending.
    const mockTxnId = crypto.randomUUID();
    return {
      provider_txn_id: mockTxnId,
      status: 'pending', // Will be updated to success via Dev API
      redirect_url: `/dev/mock-payment?txn=${mockTxnId}`,
      raw_response: { mock: true, timestamp: new Date().toISOString() }
    };
  }

  async getPaymentStatus(providerTxnId) {
    // Mock always returns pending until Dev API updates the DB.
    return 'pending';
  }

  async cancelPayment(providerTxnId) {
    return true;
  }
}
