
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Calendar } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  restaurant: z.string().min(1, "Restaurant assignment is required"),
  paymentType: z.string().min(1, "Payment type is required"),
  cardNumber: z.string().min(8, "Card number is required"),
  socialAssuranceNumber: z.string().min(5, "Social assurance number is required"),
});

type DirectorFormValues = z.infer<typeof formSchema>;

interface DirectorFormProps {
  onSubmit: (data: DirectorFormValues) => void;
  onCancel: () => void;
  restaurants: { id: number; name: string }[];
}

const DirectorForm = ({ onSubmit, onCancel, restaurants }: DirectorFormProps) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  
  const form = useForm<DirectorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Mr",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      address: "",
      phoneNumber: "",
      email: "",
      restaurant: "",
      paymentType: "ccp",
      cardNumber: "",
      socialAssuranceNumber: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleSubmit = (data: DirectorFormValues) => {
    // Include images and CV in submission
    onSubmit({
      ...data,
      profileImage,
      idCardImage,
      cvFile: cvFile?.name,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="date" {...field} className="w-full" />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+213 XXX XXX XXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="restaurant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Assignment</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select restaurant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {restaurants.map((restaurant) => (
                      <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                        {restaurant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ccp">CCP</SelectItem>
                      <SelectItem value="baridiMob">Baridi Mob</SelectItem>
                      <SelectItem value="bna">BNA</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                      <SelectItem value="visa">Visa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="XXXX XXXX XXXX XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="socialAssuranceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social Assurance Number</FormLabel>
                <FormControl>
                  <Input placeholder="XXX-XX-XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="profileImage">Profile Picture</Label>
              <div className="mt-1">
                <div className="relative">
                  {profileImage ? (
                    <div className="relative h-32 w-32 overflow-hidden rounded-md border">
                      <img
                        src={profileImage}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute right-1 top-1 rounded-full bg-white p-1 shadow-sm"
                        onClick={() => setProfileImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="profileImage"
                      className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                    >
                      <Upload className="mb-2 h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500">Profile</span>
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleImageChange(e, setProfileImage)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="idCardImage">ID Card</Label>
              <div className="mt-1">
                <div className="relative">
                  {idCardImage ? (
                    <div className="relative h-32 w-32 overflow-hidden rounded-md border">
                      <img
                        src={idCardImage}
                        alt="ID Card preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute right-1 top-1 rounded-full bg-white p-1 shadow-sm"
                        onClick={() => setIdCardImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="idCardImage"
                      className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                    >
                      <Upload className="mb-2 h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500">ID Card</span>
                      <input
                        id="idCardImage"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleImageChange(e, setIdCardImage)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="cvFile">CV</Label>
              <div className="mt-1">
                <div className="relative">
                  {cvFile ? (
                    <div className="relative h-32 w-32 overflow-hidden rounded-md border bg-gray-50 flex flex-col items-center justify-center">
                      <div className="text-xs font-medium text-gray-700 truncate max-w-[120px] px-2">
                        {cvFile.name}
                      </div>
                      <button
                        type="button"
                        className="absolute right-1 top-1 rounded-full bg-white p-1 shadow-sm"
                        onClick={() => setCvFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="cvFile"
                      className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                    >
                      <Upload className="mb-2 h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500">CV</span>
                      <input
                        id="cvFile"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="sr-only"
                        onChange={handleCvChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-feedme-500 hover:bg-feedme-600">
            Add Director
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DirectorForm;
