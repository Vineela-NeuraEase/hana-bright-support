
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";

type Role = "autistic" | "caregiver" | "clinician";

interface RoleSelectorProps {
  control: Control<any>;
  name: string;
}

const RoleSelector = ({ control, name }: RoleSelectorProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>I am a...</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted transition-all">
                <RadioGroupItem value="autistic" id="signup-autistic" />
                <Label htmlFor="signup-autistic" className="flex-grow cursor-pointer">Neurodivergent Individual</Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted transition-all">
                <RadioGroupItem value="caregiver" id="signup-caregiver" />
                <Label htmlFor="signup-caregiver" className="flex-grow cursor-pointer">Caregiver</Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted transition-all">
                <RadioGroupItem value="clinician" id="signup-clinician" />
                <Label htmlFor="signup-clinician" className="flex-grow cursor-pointer">Clinician</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RoleSelector;
