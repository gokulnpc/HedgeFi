"use client";

import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Calendar,
  ImageIcon,
  Loader2,
  Upload,
  Twitter,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import GridBackground from "../../components/GridBackground";
import { cn } from "@/lib/utils";
import { AppLayout } from "../../components/app-layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Form Schema
const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  endDate: z.string().min(1, "Please select an end date"),
  initialPool: z.string().min(1, "Initial pool amount is required"),
  twitterHandle: z
    .string()
    .min(1, "Twitter handle is required for verification"),
  image: z.any().optional(),
});

const categories = [
  "Crypto",
  "Politics",
  "Sports",
  "Entertainment",
  "Technology",
  "Finance",
  "Meme Coins",
];

// Function to check if user has connected Twitter
const getUserTwitterInfo = () => {
  // In a real app, this would be an API call to get user settings
  // For now, we'll simulate by checking localStorage
  try {
    const userSettings = localStorage.getItem("userSettings");
    if (userSettings) {
      const settings = JSON.parse(userSettings);
      return settings.twitter || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting user Twitter info:", error);
    return null;
  }
};

// Function to save Twitter handle to user settings
const saveTwitterHandle = (handle: string) => {
  try {
    const userSettings = localStorage.getItem("userSettings") || "{}";
    const settings = JSON.parse(userSettings);
    settings.twitter = { handle, connected: true };
    localStorage.setItem("userSettings", JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving Twitter handle:", error);
  }
};

export default function CreatePrediction() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [twitterInfo, setTwitterInfo] = useState<{
    handle: string;
    connected: boolean;
  } | null>(null);
  const [showTwitterDialog, setShowTwitterDialog] = useState(false);
  const router = useRouter();

  // Check authentication status and Twitter connection
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(savedAuth === "true");

    // If not authenticated, show warning and redirect after 3 seconds
    if (savedAuth !== "true") {
      setShowAuthWarning(true);
      const timer = setTimeout(() => {
        router.push("/bets");
      }, 3000);

      return () => clearTimeout(timer);
    }

    // Check if user has connected Twitter
    const twitter = getUserTwitterInfo();
    setTwitterInfo(twitter);

    // If user hasn't connected Twitter, show dialog
    if (!twitter) {
      setShowTwitterDialog(true);
    }
  }, [router]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      endDate: "",
      initialPool: "1", // Default minimum bet is 1 NEAR
      twitterHandle: twitterInfo?.handle || "",
    },
  });

  // Update form when Twitter info changes
  useEffect(() => {
    if (twitterInfo?.handle) {
      form.setValue("twitterHandle", twitterInfo.handle);
    }
  }, [twitterInfo, form]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Twitter connection
  const handleTwitterConnect = () => {
    const twitterHandle = form.getValues("twitterHandle");

    if (!twitterHandle) {
      toast({
        title: "Error",
        description: "Please enter your Twitter handle",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call to verify the Twitter handle
    // For now, we'll simulate success
    saveTwitterHandle(twitterHandle);
    setTwitterInfo({ handle: twitterHandle, connected: true });
    setShowTwitterDialog(false);

    toast({
      title: "Success!",
      description: "Your Twitter account has been connected.",
      className: "bg-green-500 text-white",
    });
  };

  // Generate automatic cover image
  const generateCoverImage = async (title: string) => {
    // In a real app, this would be an API call to generate an image
    // For now, we'll return a placeholder
    return "/placeholder.svg?height=300&width=600";
  };

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      // If no image was uploaded, generate one
      if (!previewImage) {
        const generatedImage = await generateCoverImage(values.title);
        setPreviewImage(generatedImage);
        // In a real app, you would attach this image to the form data
      }

      // Save the Twitter handle to user settings
      saveTwitterHandle(values.twitterHandle);

      // Add API call here to create prediction
      console.log(values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Success!",
        description: "Your prediction has been created.",
        className: "bg-green-500 text-white",
      });

      // Redirect to bets page
      router.push("/bets");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showAuthWarning) {
    return (
      <AppLayout>
        <GridBackground />
        <div className="container max-w-4xl mx-auto px-4 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-6 rounded-md"
          >
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p>
              You need to be signed in to create a prediction. Redirecting to
              the bets page...
            </p>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showFooter={false}>
      <GridBackground />
      <div className="container max-w-4xl mx-auto px-4 pt-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
              Create a New Prediction
            </h1>
            <p className="text-muted-foreground">
              Set up your prediction market and let others bet on the outcome
            </p>
          </div>

          <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prediction Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Will Bitcoin reach $100k by 2024?"
                            className="border-white/10"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Make it clear and specific
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide more details about your prediction..."
                            className="min-h-[100px] border-white/10 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-white/10">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* End Date */}
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="datetime-local"
                              className="border-white/10"
                              {...field}
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormDescription>
                          When will the prediction be resolved?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Initial Pool */}
                  <FormField
                    control={form.control}
                    name="initialPool"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Pool Amount (NEAR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            step="0.1"
                            placeholder="1.0"
                            className="border-white/10"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Minimum bet is 1 NEAR</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Twitter Handle (Required) */}
                  <FormField
                    control={form.control}
                    name="twitterHandle"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Twitter Handle</FormLabel>
                          {twitterInfo?.connected && (
                            <Badge
                              variant="outline"
                              className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                            >
                              Connected
                            </Badge>
                          )}
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="@username"
                              className="border-white/10 pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your Twitter handle is required for verification
                          purposes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Upload (Optional) */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Cover Image</FormLabel>
                          <Badge
                            variant="outline"
                            className="bg-gray-500/10 text-gray-400 border-gray-500/20"
                          >
                            Optional
                          </Badge>
                        </div>
                        <FormControl>
                          <div className="space-y-4">
                            <div
                              className={cn(
                                "flex items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors",
                                "border-white/10 hover:border-white/20"
                              )}
                            >
                              <label
                                htmlFor="image-upload"
                                className="flex flex-col items-center gap-2 cursor-pointer"
                              >
                                {previewImage ? (
                                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={previewImage || "/placeholder.svg"}
                                      alt="Preview"
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      Click to upload or drag and drop
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      (If not provided, we'll generate one for
                                      you)
                                    </span>
                                  </>
                                )}
                                <Input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleImageUpload(e);
                                    onChange(e.target.files?.[0]);
                                  }}
                                  {...field}
                                />
                              </label>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload a cover image for your prediction or let us
                          generate one for you
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/10"
                      onClick={() => router.push("/bets")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Create Prediction
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Twitter Connection Dialog */}
      <Dialog open={showTwitterDialog} onOpenChange={setShowTwitterDialog}>
        <DialogContent className="sm:max-w-[425px] bg-black/90 border-white/10">
          <DialogHeader>
            <DialogTitle>Connect Twitter Account</DialogTitle>
            <DialogDescription className="text-gray-400">
              A Twitter account is required to create predictions. This helps
              verify your identity and prevent spam.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Twitter className="h-8 w-8 text-blue-400" />
              <div className="flex-1">
                <p className="font-medium">Twitter Integration</p>
                <p className="text-sm text-muted-foreground">
                  Connect your account to continue
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel>Twitter Handle</FormLabel>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="@username"
                  className="border-white/10 pl-10"
                  value={form.getValues("twitterHandle")}
                  onChange={(e) =>
                    form.setValue("twitterHandle", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <p className="text-sm text-yellow-500">
                You must connect your Twitter account to create predictions.
                This information will be used for verification.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-white/10"
              onClick={() => router.push("/bets")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTwitterConnect}
              className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
            >
              Connect Twitter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
