import { prisma } from '../../config/database.js';
import { createInvitationForPaidOrder } from '../invitations/invitation.service.js';

export const simulatePaymentSuccess = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.params; // payment id
    const user_id = req.user.id;

    // 1. Verify payment and ownership
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { order: true }
    });

    if (!payment || payment.order.user_id !== user_id) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'pending' && payment.status !== 'created') {
      return res.status(400).json({ error: 'Payment is already processed' });
    }

    if (payment.order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not pending' });
    }

    // 2. Atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // a. Update Payment
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'success' }
      });

      // b. Payment Event
      await tx.paymentEvent.create({
        data: {
          payment_id: payment.id,
          event_type: 'payment.success',
          payload: { mock: true, timestamp: new Date().toISOString() }
        }
      });

      // c. Update Order
      const updatedOrder = await tx.order.update({
        where: { id: payment.order_id },
        data: { status: 'paid' }
      });

      // d. Create Invitation
      const invitation = await createInvitationForPaidOrder(payment.order_id, tx);

      return { payment: updatedPayment, order: updatedOrder, invitation };
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
