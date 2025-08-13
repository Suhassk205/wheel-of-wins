import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Stepper from '@/components/Stepper';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FormData {
  fullName: string;
  phoneNumber: string;
  fullAddress: string;
  city: string;
  pincode: string;
}

const Form: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    fullAddress: '',
    city: '',
    pincode: ''
  });

  const steps = [
    { id: 1, title: 'Full Name', field: 'fullName', placeholder: 'Enter your full name' },
    { id: 2, title: 'Phone Number', field: 'phoneNumber', placeholder: 'Enter your phone number' },
    { id: 3, title: 'Full Address', field: 'fullAddress', placeholder: 'Enter your full address', isTextarea: true },
    { id: 4, title: 'City', field: 'city', placeholder: 'Enter your city' },
    { id: 5, title: 'Pincode', field: 'pincode', placeholder: 'Enter your pincode' },
    { id: 6, title: 'Review & Submit', field: 'review' }
  ];

  const stepperSteps = steps.map((step, index) => ({
    id: step.id,
    title: step.title,
    isCompleted: index + 1 < currentStep,
    isActive: index + 1 === currentStep
  }));

  const isStepValid = (stepNumber: number): boolean => {
    const step = steps[stepNumber - 1];
    if (step.field === 'review') {
      return Object.values(formData).every(value => value.trim() !== '');
    }
    return formData[step.field as keyof FormData].trim() !== '';
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    sessionStorage.setItem('formData', JSON.stringify(formData));
    navigate('/success');
  };

  const renderStepContent = () => {
    const step = steps[currentStep - 1];
    
    if (step.field === 'review') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">Review Your Information</h2>
          <div className="space-y-4">
            {steps.slice(0, -1).map((reviewStep) => (
              <div key={reviewStep.id} className="flex justify-between items-center p-4 bg-muted/10 rounded-lg">
                <span className="font-medium text-muted-foreground">{reviewStep.title}:</span>
                <span className="text-foreground font-semibold">
                  {formData[reviewStep.field as keyof FormData]}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">{step.title}</h2>
        <div className="space-y-4">
          <Label htmlFor={step.field} className="text-lg font-medium text-foreground">
            {step.title}
          </Label>
          {step.isTextarea ? (
            <Textarea
              id={step.field}
              placeholder={step.placeholder}
              value={formData[step.field as keyof FormData]}
              onChange={(e) => handleInputChange(step.field as keyof FormData, e.target.value)}
              className="min-h-[120px] text-lg"
              aria-label={step.title}
            />
          ) : (
            <Input
              id={step.field}
              type={step.field === 'phoneNumber' ? 'tel' : step.field === 'pincode' ? 'number' : 'text'}
              placeholder={step.placeholder}
              value={formData[step.field as keyof FormData]}
              onChange={(e) => handleInputChange(step.field as keyof FormData, e.target.value)}
              className="text-lg py-6"
              aria-label={step.title}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-gold/20">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-bold text-center text-foreground mb-6">
            Registration Form
          </CardTitle>
          <Stepper steps={stepperSteps} currentStep={currentStep} />
        </CardHeader>
        
        <CardContent className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-8">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1}
              variant="outline"
              size="lg"
              className="px-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep === steps.length ? (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep)}
                size="lg"
                className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                size="lg"
                className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Form;