import { PaymentProvider } from './payment-provider.js';

export class ClickPaymentProvider extends PaymentProvider {
  async createPayment(payment, order) {
    // TODO: Implement real Click Create Invoice API call here
    // return axios.post('https://api.click.uz/v2/merchant/invoice/create', ...)
    console.warn('ClickProvider.createPayment is a placeholder');
    return {
      provider_txn_id: 'TODO-CLICK-TXN',
      status: 'pending',
      redirect_url: 'https://my.click.uz/services/pay?service_id=...',
    };
  }

  async getPaymentStatus(providerTxnId) {
    // TODO: Implement real Click status check API
    return 'pending';
  }

  async cancelPayment(providerTxnId) {
    // TODO: Implement Click cancel API
    return true;
  }

  async handleCallback(req, res) {
    // TODO: Implement Click webhook validation (sign_string) and processing
    res.status(200).json({ error: 0, error_note: 'Success' });
  }
}
