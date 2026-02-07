import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, User, Calendar, Phone, Heart, MapPin, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import type { SignupFormData, AccountType } from '@/types';
import { ACCOUNT_TYPE_LABELS, GHANA_REGIONS, WEST_AFRICAN_COUNTRIES } from '@/lib/constants';

const credentialsSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  accountType: z.enum(['kid', 'high_schooler', 'adult']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  region: z.string().optional(),
  mothersFirstName: z.string().min(2, "Mother's first name is required for security"),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

interface Props {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
  onNext: () => void;
}

export function CredentialsStep({ formData, updateFormData, onNext }: Props) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    try {
      credentialsSchema.parse(formData);
      setErrors({});
      onNext();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(newErrors);
        toast({
          title: 'Validation Error',
          description: err.errors[0].message,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
          />
        </div>
        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountType">Account Type *</Label>
        <Select
          value={formData.accountType}
          onValueChange={(v) => updateFormData({ accountType: v as AccountType })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
              className={`pl-10 ${errors.dateOfBirth ? 'border-destructive' : ''}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+233 XX XXX XXXX"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select
            value={formData.country}
            onValueChange={(v) => updateFormData({ country: v, region: '' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {WEST_AFRICAN_COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select
            value={formData.region}
            onValueChange={(v) => updateFormData({ region: v })}
            disabled={formData.country !== 'Ghana'}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.country === 'Ghana' ? 'Select region' : 'N/A'} />
            </SelectTrigger>
            <SelectContent>
              {GHANA_REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mothersFirstName">Mother's First Name (Security) *</Label>
        <div className="relative">
          <Heart className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="mothersFirstName"
            type="text"
            placeholder="For account recovery"
            value={formData.mothersFirstName}
            onChange={(e) => updateFormData({ mothersFirstName: e.target.value })}
            className={`pl-10 ${errors.mothersFirstName ? 'border-destructive' : ''}`}
          />
        </div>
        {errors.mothersFirstName && <p className="text-sm text-destructive">{errors.mothersFirstName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => updateFormData({ password: e.target.value })}
            className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
          />
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
            className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
          />
        </div>
        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
      </div>

      <Button onClick={handleNext} className="w-full gap-2">
        Next Step
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}