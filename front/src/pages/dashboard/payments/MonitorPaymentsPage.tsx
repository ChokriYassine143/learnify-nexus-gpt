import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { paymentService } from "@/services/paymentService";
import { useEffect, useState } from "react";
import { Payment, User, Course } from "@/types";
import { useToast } from "@/hooks/use-toast";

const MonitorPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allPayments, allUsers, allCourses] = await Promise.all([
          paymentService.getAllPayments(),
          // TODO: Replace with userService when available
          Promise.resolve([]),
          // TODO: Replace with courseService when available
          Promise.resolve([])
        ]);
        
        setPayments(allPayments);
        setUsers(allUsers);
        setCourses(allCourses);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch payment data",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [toast]);

  const totalPayments = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + (typeof p.amount === 'number' && !isNaN(p.amount) ? p.amount : 0), 0);

  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || userId;
  const getCourseTitle = (courseId: string) => courses.find(c => c.id === courseId)?.title || courseId;

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Surveillance des Paiements</h1>
          <p className="text-gray-600 mt-2">Suivez les paiements et abonnements des utilisateurs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total des Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPayments.toLocaleString()} €</div>
              <p className="text-xs text-muted-foreground mt-1">Paiements complétés</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nombre de Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Toutes transactions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paiements en Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payments.filter(p => p.status === "pending").length}</div>
              <p className="text-xs text-muted-foreground mt-1">En attente de validation</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Historique des Transactions</CardTitle>
            <CardDescription>Liste de tous les paiements</CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Aucun paiement trouvé.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-left">ID</th>
                      <th className="p-2 text-left">Utilisateur</th>
                      <th className="p-2 text-left">Cours</th>
                      <th className="p-2 text-left">Montant</th>
                      <th className="p-2 text-left">Statut</th>
                      <th className="p-2 text-left">Méthode</th>
                      <th className="p-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id} className="border-b">
                        <td className="p-2">{payment.id}</td>
                        <td className="p-2">{getUserName(payment.userId)}</td>
                        <td className="p-2">{getCourseTitle(payment.courseId)}</td>
                        <td className="p-2">{payment.amount} {payment.currency}</td>
                        <td className="p-2">{payment.status}</td>
                        <td className="p-2">{payment.paymentMethod}</td>
                        <td className="p-2">{new Date(payment.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardLayout>
      <Footer />
    </>
  );
};

export default MonitorPaymentsPage;
