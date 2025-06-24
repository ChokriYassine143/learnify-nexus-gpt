import { Payment } from '@/types';
import api from './api';

class PaymentService {
  async getAllPayments(): Promise<Payment[]> {
    const { data } = await api.get<Payment[]>('/payments');
    return data;
  }

  async getPayment(paymentId: string): Promise<Payment> {
    const { data } = await api.get<Payment>(`/payments/${paymentId}`);
    return data;
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    const { data } = await api.get<Payment[]>(`/users/${userId}/payments`);
    return data;
  }

  async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    const { data } = await api.post<Payment>('/payments', paymentData);
    return data;
  }

  async updatePayment(paymentId: string, paymentData: Partial<Payment>): Promise<Payment> {
    const { data } = await api.put<Payment>(`/payments/${paymentId}`, paymentData);
    return data;
  }

  async deletePayment(paymentId: string): Promise<void> {
    await api.delete(`/payments/${paymentId}`);
  }
}

export const paymentService = new PaymentService(); 