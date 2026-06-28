import { Layout } from "@/components/layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type FormValues = z.infer<typeof formSchema>;

export function Contact() {
  const { toast } = useToast();
  const submitContact = useSubmitContact();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    submitContact.mutate({ data: values }, {
      onSuccess: () => {
        toast({
          title: "Message Sent",
          description: "We've received your message and will be in touch shortly.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "There was a problem sending your message. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <Layout>
      <div className="bg-muted py-12 md:py-20 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Contact HQ</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Questions about gear specs? Need support for an expedition? 
            Reach out. We're here.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold mb-6">Send a Dispatch</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Gear inquiry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How can we help?" 
                          className="min-h-[150px] resize-y" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto"
                  disabled={submitContact.isPending}
                >
                  {submitContact.isPending ? "Sending..." : "Submit Message"}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="space-y-10 lg:pl-10 lg:border-l border-border">
            <div>
              <h2 className="text-2xl font-bold mb-6">Headquarters</h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Basecamp</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      1400 Elevation Way<br />
                      Boulder, CO 80302<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Comm Line</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      +1 (800) 555-APEX<br />
                      Mon-Fri, 9am - 5pm MST
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Electronic</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      support@apextrail.com<br />
                      pro-sales@apextrail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-6 border border-border">
              <h3 className="font-bold mb-2">Pro Program</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Active mountain guides, search & rescue, and outdoor industry professionals qualify for special pricing.
              </p>
              <Button variant="outline" className="w-full">Apply for Pro Status</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
