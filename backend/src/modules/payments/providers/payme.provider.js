import { PaymentProvider } from './payment-provider.js';

export class PaymePaymentProvider extends PaymentProvider {
  async createPayment(payment, order) {
    // TODO: Payme usually requires base64 encoding of params for checkout URL
    console.warn('PaymeProvider.createPayment is a placeholder');
    return {
      provider_txn_id: 'TODO-PAYME-TXN',
      status: 'pending',
      redirect_url: 'https://checkout.paycom.uz/...',
    };
  }

  async getPaymentStatus(providerTxnId) {
    // TODO: Implement real Payme check status API
    return 'pending';
  }

  async cancelPayment(providerTxnId) {
    // TODO: Implement Payme cancel API
    return true;
  }

  async handleCallback(req, res) {
    // TODO: Implement Payme JSON-RPC webhook logic
    res.status(200).json({ result: { /* ... */ } });
  }
}
