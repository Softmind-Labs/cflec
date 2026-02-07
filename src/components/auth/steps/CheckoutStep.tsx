import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Smartphone, 
  ArrowLeft, 
  CheckCircle, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Trophy,
  Loader2,
  Shield
} from 'lucide-react';
import type { SignupFormData } from '@/types';
import { SUBSCRIPTION_PRICE } from '@/lib/constants';

interface Props {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
  onComplete: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const features = [
  { icon: BookOpen, text: 'All 27 learning modules' },
  { icon: TrendingUp, text: 'Full trading simulator access' },
  { icon: Award, text: '4 certificate levels' },
  { icon: Trophy, text: 'Leaderboard access' },
];

export function CheckoutStep({ formData, updateFormData, onComplete, onBack, isLoading }: Props) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-cflp-gold/10">
          <Badge variant="secondary" className="w-fit mb-2">Annual Subscription</Badge>
          <CardTitle className="text-2xl">CFLP Premium Access</CardTitle>
          <CardDescription>
            Complete financial literacy education platform
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Features List */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-cflp-green/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-cflp-green" />
                </div>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Price */}
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-1">Annual Subscription</p>
            <p className="text-4xl font-bold text-primary">
              {SUBSCRIPTION_PRICE.currency} {SUBSCRIPTION_PRICE.amount}
            </p>
            <p className="text-sm text-muted-foreground">per year</p>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Select Payment Method</Label>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(v) => updateFormData({ paymentMethod: v as 'mobile_money' | 'card' })}
              className="grid gap-3"
            >
              <div 
                className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  formData.paymentMethod === 'mobile_money' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => updateFormData({ paymentMethod: 'mobile_money' })}
              >
                <RadioGroupItem value="mobile_money" id="mobile_money" />
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="mobile_money" className="cursor-pointer font-medium">
                    Mobile Money
                  </Label>
                  <p className="text-sm text-muted-foreground">MTN, Vodafone, AirtelTigo</p>
                </div>
              </div>
              
              <div 
                className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  formData.paymentMethod === 'card' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => updateFormData({ paymentMethod: 'card' })}
              >
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="card" className="cursor-pointer font-medium">
                    Debit/Credit Card
                  </Label>
                  <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Security Note */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Your payment information is securely processed</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" className="flex-1 gap-2" disabled={isLoading}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onComplete} className="flex-1 gap-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Complete Registration
              <CheckCircle className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        By completing registration, you agree to our Terms of Service and Privacy Policy.
        Payment will be processed after email verification.
      </p>
    </div>
  );
}