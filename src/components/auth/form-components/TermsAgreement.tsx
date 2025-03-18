
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";

interface TermsAgreementProps {
  control: Control<any>;
  name: string;
}

const TermsAgreement = ({ control, name }: TermsAgreementProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
          <FormControl>
            <Checkbox 
              checked={field.value} 
              onCheckedChange={field.onChange} 
              id="accept-terms"
            />
          </FormControl>
          <FormLabel htmlFor="accept-terms" className="font-normal">
            I accept the terms of service and privacy policy
          </FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TermsAgreement;
