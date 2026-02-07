import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { CredentialsStep } from './steps/CredentialsStep';
import { BankAccountStep } from './steps/BankAccountStep';
import { CheckoutStep } from './steps/CheckoutStep';
import type { SignupFormData, AccountType } from '@/types';

const initialFormData: SignupFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  accountType: 'adult' as AccountType,
  dateOfBirth: '',
  phone: '',
  mothersFirstName: '',
  country: 'Ghana',
  region: '',
  bankInfo: {
    hasExistingAccount: true,
    selectedBank: undefined,
    ghanaCardNumber: '',
    ghanaCardExpiry: '',
    occupation: '',
    sourceOfIncome: '',
  },
  subscriptionPlan: 'yearly',
  paymentMethod: 'mobile_money',
};

export function SignupWizard() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (data: Partial<SignupFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.accountType,
        {
          date_of_birth: formData.dateOfBirth || null,
          phone: formData.phone || null,
          mothers_first_name: formData.mothersFirstName || null,
        }
      );

      if (error) {
        toast({
          title: 'Signup Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account Created!',
          description: 'Please check your email to verify your account.',
        });
        navigate('/auth?mode=login');
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step, index) => (
          <div key={step} className="flex items-center">
            <div 
              className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                currentStep >= step 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step}
            </div>
            {index < 2 && (
              <div 
                className={`h-1 w-16 md:w-24 mx-2 transition-colors ${
                  currentStep > step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-sm text-muted-foreground mb-6 px-4">
        <span className={currentStep === 1 ? 'text-primary font-medium' : ''}>Credentials</span>
        <span className={currentStep === 2 ? 'text-primary font-medium' : ''}>Bank Account</span>
        <span className={currentStep === 3 ? 'text-primary font-medium' : ''}>Checkout</span>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <CredentialsStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onNext={handleNext} 
        />
      )}
      {currentStep === 2 && (
        <BankAccountStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onNext={handleNext} 
          onBack={handleBack}
        />
      )}
      {currentStep === 3 && (
        <CheckoutStep 
          formData={formData} 
          updateFormData={updateFormData} 
          onComplete={handleComplete} 
          onBack={handleBack}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}