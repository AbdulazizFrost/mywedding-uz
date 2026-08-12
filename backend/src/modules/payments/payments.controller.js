import { prisma } from '../../config/database.js';
import { MockPaymentProvider } from './providers/mock.provider.js';
import crypto from 'crypto';

export const createPayment = async (req, res, next) => {
  try {
    const { order_id } = req.body;
    const user_id = req.user.id;

    if (!order_id) {
      return res.status(400).json({ error: 'order_id is required' });
    }

    // 1. Verify order
    const order = await prisma.order.findUnique({
      where: { id: order_id }
    });

    if (!order || order.user_id !== user_id) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not pending' });
    }

    // 2. Check for existing pending payment (Idempotency)
    const existingPayment = await prisma.payment.findFirst({
      where: {
        order_id: order.id,
        status: { in: ['created', 'pending'] }
      },
      orderBy: { created_at: 'desc' }
    });

    if (existingPayment) {
      return res.status(200).json({ payment: existingPayment });
    }

    // 3. Create Payment atomically
    const idempotencyKey = crypto.randomUUID();
    
    // Select provider based on env or logic. For now, hardcode mock.
    const providerStr = process.env.NODE_ENV === 'development' ? 'mock' : 'click'; 

    const payment = await prisma.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          order_id: order.id,
          provider: providerStr,
          amount: order.amount,
          currency: order.currency,
          status: 'created',
          idempotency_key: idempotencyKey,
        }
      });

      await tx.paymentEvent.create({
        data: {
          payment_id: newPayment.id,
          event_type: 'payment.created',
          payload: { order_id: order.id, provider: providerStr }
        }
      });

      return newPayment;
    });

    // 4. Call Provider
    let providerResponse;
    if (providerStr === 'mock') {
      const provider = new MockPaymentProvider();
      providerResponse = await provider.createPayment(payment, order);
    } else {
      // Future placeholder
      providerResponse = { status: 'pending' }; 
    }

    // 5. Update payment with provider txn id and status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        provider_txn_id: providerResponse.provider_txn_id || null,
        status: providerResponse.status || 'pending',
        raw_payload: providerResponse.raw_response || {}
      }
    });

    res.status(201).json({ 
      payment: {
        id: updatedPayment.id,
        status: updatedPayment.status,
        redirect_url: providerResponse.redirect_url,
        provider: updatedPayment.provider
      } 
    });

  } catch (error) {
    next(error);
  }
};

export const getPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { order: true }
    });

    if (!payment || payment.order.user_id !== user_id) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Safe payload
    res.status(200).json({
      payment: {
        id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        provider: payment.provider,
        created_at: payment.created_at,
      }
    });

  } catch (error) {
    next(error);
  }
};
