
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface CourseEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  onEnrollSuccess?: () => void;
}

const CourseEnrollmentModal: React.FC<CourseEnrollmentModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  coursePrice,
  onEnrollSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("creditCard");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleEnroll = async () => {
    setIsProcessing(true);
    
    try {
      // In a real application, this would connect to a payment gateway
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Inscription réussie !",
        description: `Vous êtes maintenant inscrit au cours : ${courseTitle}`,
      });
      
      if (onEnrollSuccess) {
        onEnrollSuccess();
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: "Une erreur s'est produite lors du traitement de votre paiement.",
        variant: "destructive"
      });
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>S'inscrire au cours</DialogTitle>
          <DialogDescription>
            {courseTitle} - {coursePrice.toLocaleString('fr-FR')} €
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="mb-3 font-medium">Sélectionnez une méthode de paiement</h3>
          
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={setPaymentMethod}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 border p-4 rounded-md">
              <RadioGroupItem value="creditCard" id="creditCard" />
              <Label htmlFor="creditCard" className="flex flex-1 justify-between">
                <span>Carte de crédit</span>
                <div className="flex gap-1">
                  <div className="w-8 h-5 bg-blue-600 rounded"></div>
                  <div className="w-8 h-5 bg-green-600 rounded"></div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border p-4 rounded-md">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex flex-1 justify-between">
                <span>PayPal</span>
                <div className="w-8 h-5 bg-blue-400 rounded"></div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border p-4 rounded-md">
              <RadioGroupItem value="bankTransfer" id="bankTransfer" />
              <Label htmlFor="bankTransfer">Virement bancaire</Label>
            </div>
          </RadioGroup>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between mb-2">
              <span>Prix du cours</span>
              <span>{coursePrice.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between mb-2 font-medium">
              <span>Total</span>
              <span>{coursePrice.toLocaleString('fr-FR')} €</span>
            </div>
            <p className="text-xs mt-2 text-gray-500">
              En procédant au paiement, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Annuler
          </Button>
          <Button onClick={handleEnroll} disabled={isProcessing} className="min-w-[150px]">
            {isProcessing ? "Traitement..." : "Procéder au paiement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEnrollmentModal;
