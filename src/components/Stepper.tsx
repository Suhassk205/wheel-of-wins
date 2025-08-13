import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8 px-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* Step indicator */}
          <div className="relative">
            <motion.div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                ${step.isCompleted 
                  ? 'bg-primary text-primary-foreground' 
                  : step.isActive 
                    ? 'bg-gold text-background ring-2 ring-gold-glow'
                    : 'bg-muted text-muted-foreground'
                }
              `}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {step.isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                step.id
              )}
            </motion.div>
            {step.isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gold-glow opacity-30"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>

          {/* Step title */}
          <div className="ml-3 hidden sm:block">
            <h3 className={`text-sm font-medium ${
              step.isActive ? 'text-gold' : step.isCompleted ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {step.title}
            </h3>
          </div>

          {/* Connecting line */}
          {index < steps.length - 1 && (
            <div className="flex-1 mx-4 h-0.5 bg-border relative">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ 
                  width: step.isCompleted ? '100%' : '0%' 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;