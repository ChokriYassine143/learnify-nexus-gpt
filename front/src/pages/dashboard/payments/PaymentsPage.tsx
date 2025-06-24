import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService } from "@/services/paymentService";
import { Payment } from "@/types";

const SUBSCRIPTION_PLANS = [
  {
    id: "basic",
    title: "Basic Plan",
    description: "Limited access to courses",
    price: 9.99,
    features: [
      "Access to 5 courses",
      "Basic resources",
      "Community forum access"
    ]
  },
  {
    id: "premium",
    title: "Premium Plan",
    description: "Full access to courses",
    price: 19.99,
    features: [
      "Unlimited course access",
      "Premium resources",
      "Priority forum access",
      "Personalized support"
    ],
    popular: true
  },
  {
    id: "enterprise",
    title: "Enterprise Plan",
    description: "For groups and companies",
    price: 49.99,
    features: [
      "Access for 5 users",
      "Custom content",
      "Analytics reports",
      "24/7 support"
    ]
  }
];

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPayments = async () => {
      if (user) {
        try {
          const userPayments = await paymentService.getPaymentsByUser(user.id);
          setPayments(userPayments);
        } catch (error) {
          console.error("Error fetching payments:", error);
          toast({
            title: "Error",
            description: "Failed to fetch payment history",
            variant: "destructive"
          });
        }
      }
    };

    fetchPayments();
  }, [user, toast]);

  const handleSubscribe = async (planId: string) => {
    if (!user) return;

    setIsProcessing(true);
    try {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) throw new Error("Invalid plan selected");

      const payment: Partial<Payment> = {
        userId: user.id,
        courseId: "subscription", // Special ID for subscriptions
        amount: plan.price,
        currency: "EUR",
        status: "pending",
        paymentMethod: "creditCard"
      };

      // Create payment record
      const newPayment = await paymentService.createPayment(payment);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update payment status to completed
      await paymentService.updatePayment(newPayment.id, { status: "completed" });

      // Update user's subscription status
      // In a real app, this would be handled by the backend
      user.subscription = planId;

      toast({
        title: "Subscription successful!",
        description: `You are now subscribed to the ${plan.title}`,
      });

      // Refresh payments list
      const updatedPayments = await paymentService.getPaymentsByUser(user.id);
      setPayments(updatedPayments);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payment & Subscriptions</h1>
          <p className="text-gray-600 mt-2">Manage your payments and subscriptions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{plan.title}</CardTitle>
                  {plan.popular && (
                    <div className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">€{plan.price} / month</div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Subscribe"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">
                        {payment.courseId === "subscription" ? "Subscription" : "Course Payment"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(payment.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">€{payment.amount}</div>
                      <div className={`text-sm ${
                        payment.status === "completed" ? "text-green-500" :
                        payment.status === "failed" ? "text-red-500" :
                        payment.status === "refunded" ? "text-yellow-500" :
                        "text-gray-500"
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">
                No payment history available
              </p>
            )}
          </CardContent>
        </Card>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default PaymentsPage;
