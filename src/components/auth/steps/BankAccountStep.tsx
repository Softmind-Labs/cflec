import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CreditCard, Briefcase, ArrowRight, ArrowLeft, IdCard } from 'lucide-react';
import type { SignupFormData, GhanaianBank, BankAccountInfo } from '@/types';
import { GHANAIAN_BANKS } from '@/lib/constants';

interface Props {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BankAccountStep({ formData, updateFormData, onNext, onBack }: Props) {
  const updateBankInfo = (data: Partial<BankAccountInfo>) => {
    updateFormData({
      bankInfo: { ...formData.bankInfo, ...data }
    });
  };

  const handleHasAccountChange = (value: string) => {
    updateBankInfo({ 
      hasExistingAccount: value === 'yes',
      selectedBank: undefined 
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bank Account Setup
          </CardTitle>
          <CardDescription>
            Link your banking information for seamless transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Bank Account Question */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Do you have an active bank account with a Ghanaian bank?
            </Label>
            <RadioGroup
              value={formData.bankInfo.hasExistingAccount ? 'yes' : 'no'}
              onValueChange={handleHasAccountChange}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="cursor-pointer">Yes, I do</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="cursor-pointer">No, I don't</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Bank Selection (if No) */}
          {!formData.bankInfo.hasExistingAccount && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <Label className="text-base font-medium">Select a Bank to Open an Account</Label>
              <p className="text-sm text-muted-foreground">
                Choose a partner bank to create your account with
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(GHANAIAN_BANKS) as [GhanaianBank, string][]).map(([code, name]) => (
                  <div
                    key={code}
                    onClick={() => updateBankInfo({ selectedBank: code })}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.bankInfo.selectedBank === code
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-medium text-sm">{name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KYC Information */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-2 text-base font-medium">
              <IdCard className="h-5 w-5" />
              KYC Information
            </div>
            <p className="text-sm text-muted-foreground">
              Please provide your Ghana Card details for verification
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ghanaCardNumber">Ghana Card Number</Label>
                <Input
                  id="ghanaCardNumber"
                  placeholder="GHA-XXXXXXXXX-X"
                  value={formData.bankInfo.ghanaCardNumber}
                  onChange={(e) => updateBankInfo({ ghanaCardNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ghanaCardExpiry">Expiry Date</Label>
                <Input
                  id="ghanaCardExpiry"
                  type="date"
                  value={formData.bankInfo.ghanaCardExpiry}
                  onChange={(e) => updateBankInfo({ ghanaCardExpiry: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="occupation"
                    placeholder="e.g. Software Engineer"
                    value={formData.bankInfo.occupation}
                    onChange={(e) => updateBankInfo({ occupation: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourceOfIncome">Source of Income</Label>
                <Select
                  value={formData.bankInfo.sourceOfIncome}
                  onValueChange={(v) => updateBankInfo({ sourceOfIncome: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employment">Employment</SelectItem>
                    <SelectItem value="self_employed">Self-Employed</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                    <SelectItem value="investments">Investments</SelectItem>
                    <SelectItem value="student">Student (Allowance)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" className="flex-1 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} className="flex-1 gap-2">
          Next Step
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
