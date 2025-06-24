import { useState } from "react";
import { Payment } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService } from "@/services/paymentService";

export const usePayments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getAllPayments = async () => {
    if (!user) {
      return [];
    }

    try {
      const payments = await paymentService.getAllPayments();
      return payments;
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  };

  const getPaymentById = async (paymentId: string) => {
    try {
      const payment = await paymentService.getPayment(paymentId);
      return payment;
    } catch (error) {
      console.error("Error fetching payment:", error);
      return undefined;
    }
  };

  const getPaymentsByUser = async (userId: string) => {
    try {
      const payments = await paymentService.getPaymentsByUser(userId);
      return payments;
    } catch (error) {
      console.error("Error fetching user payments:", error);
      return [];
    }
  };

  const createPayment = async (paymentData: Partial<Payment>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a payment",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }

    setIsLoading(true);

    try {
      const newPayment = await paymentService.createPayment(paymentData);
      
      toast({
        title: "Success",
        description: "Payment created successfully"
      });
      
      return newPayment;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePayment = async (paymentId: string, paymentData: Partial<Payment>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update a payment",
        variant: "destructive"
      });
      throw new Error("Not authenticated");
    }

    // Only admins can update payments
    if (user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to update payments",
        variant: "destructive"
      });
      throw new Error("Unauthorized");
    }

    setIsLoading(true);

    try {
      const updatedPayment = await paymentService.updatePayment(paymentId, paymentData);
      
      toast({
        title: "Success",
        description: "Payment updated successfully"
      });
      
      return updatedPayment;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePayment = async (paymentId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete a payment",
        variant: "destructive"
      });
      return false;
    }

    // Only admins can delete payments
    if (user.role !== "admin") {
      toast({
        title: "Error",
        description: "You don't have permission to delete payments",
        variant: "destructive"
      });
      return false;
    }

    try {
      await paymentService.deletePayment(paymentId);
      
      toast({
        title: "Success",
        description: "Payment deleted successfully"
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete payment",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    getAllPayments,
    getPaymentById,
    getPaymentsByUser,
    createPayment,
    updatePayment,
    deletePayment,
    isLoading
  };
}; 