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
import { useBettingService } from "@/services/BettingService";

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
import GridBackground from "@/app/components/GridBackground";
import { cn } from "@/lib/utils";
import { AppLayout } from "@/app/components/app-layout";
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

export default function CreateBet() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [twitterInfo, setTwitterInfo] = useState<{
    handle: string;
    connected: boolean;
  } | null>(null);
  const [twitterHandleChanged, setTwitterHandleChanged] = useState(false);
  const router = useRouter();
  // Get the betting service at component level
  const bettingService = useBettingService();

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

  // Track Twitter handle changes
  const handleTwitterHandleChange = (value: string) => {
    if (!twitterInfo || !twitterInfo.connected) return;

    const currentHandle = twitterInfo.handle || "";
    // Check if the handle has been changed from the saved one
    setTwitterHandleChanged(value !== currentHandle);
  };

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

    // Reset the modified state after updating
    setTwitterHandleChanged(false);

    toast({
      title: "Success!",
      description: twitterInfo?.connected
        ? "Your Twitter handle has been updated."
        : "Your Twitter account has been connected.",
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
      let imageUrl = "/placeholder.svg"; // Default placeholder
      if (!previewImage) {
        const generatedImage = await generateCoverImage(values.title);
        setPreviewImage(generatedImage);
        imageUrl = generatedImage;
      } else {
        imageUrl = previewImage;
      }

      // Save the Twitter handle to user settings
      saveTwitterHandle(values.twitterHandle);

      // Convert endDate string to timestamp
      const endDateTimestamp = new Date(values.endDate).getTime() / 1000; // Convert to seconds

      // The contract expects amounts as numbers
      const initialPoolAmount = parseFloat(values.initialPool);
      const betAmount = 0; // Use 0 for base bet amount if not specified separately

      // Use the betting service that was initialized at component level
      await bettingService.createBet(
        values.title, // title
        values.description, // description
        values.category, // category
        values.twitterHandle, // twitterHandle
        Math.floor(endDateTimestamp), // endDate as a Unix timestamp (in seconds)
        betAmount, // amount (bet amount)
        initialPoolAmount, // initialPoolAmount
        imageUrl // imageURL
      );

      toast({
        title: "Success!",
        description: "Your bet has been created.",
        className: "bg-green-500 text-white",
      });

      // Redirect to bets page
      router.push("/bets");
    } catch (error) {
      console.error("Error creating bet:", error);
      toast({
        title: "Error",
        description: "Failed to create bet. Please try again.",
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
              You need to be signed in to create a bet. Redirecting to the bets
              page...
            </p>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showFooter={false}>
      <GridBackground />
      <div className="container max-w-full mx-auto px-12 pt-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
              Create a New Bet
            </h1>
            <p className="text-muted-foreground">
              Set up your bet and let others bet on the outcome
            </p>
          </div>

          <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Title - Full Width */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bet Title</FormLabel>
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

                  {/* Description - Full Width */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bet Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide more details about your bet..."
                            className="min-h-[100px] border-white/10 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Two Column Layout for remaining fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
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
                              When will the bet be resolved?
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
                            <FormDescription>
                              Minimum bet is 1 NEAR
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Twitter Handle (Required) */}
                      <FormField
                        control={form.control}
                        name="twitterHandle"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormLabel>Twitter Handle</FormLabel>
                              {twitterInfo?.connected &&
                                !twitterHandleChanged && (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  >
                                    Connected
                                  </Badge>
                                )}
                              {twitterInfo?.connected &&
                                twitterHandleChanged && (
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                  >
                                    Modified
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
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleTwitterHandleChange(e.target.value);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <div className="flex items-center justify-between mt-2">
                              <FormDescription>
                                Required for verification
                              </FormDescription>
                              {!twitterInfo?.connected && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleTwitterConnect}
                                  className="border-blue-500/20 text-blue-500 hover:bg-blue-500/10"
                                >
                                  <Twitter className="mr-2 h-3 w-3" />
                                  Connect
                                </Button>
                              )}
                              {twitterInfo?.connected &&
                                twitterHandleChanged && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleTwitterConnect}
                                    className="border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10"
                                  >
                                    <Twitter className="mr-2 h-3 w-3" />
                                    Update
                                  </Button>
                                )}
                            </div>
                            {!twitterInfo?.connected && (
                              <div className="flex items-center gap-2 p-3 mt-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                <p className="text-xs text-yellow-500">
                                  Twitter account required for bets
                                </p>
                              </div>
                            )}
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
                                    "flex items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors",
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
                                          src={
                                            previewImage || "/placeholder.svg"
                                          }
                                          alt="Preview"
                                          className="object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <>
                                        <ImageIcon className="h-11 w-8 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground text-center">
                                          Click to upload or drag and drop
                                        </span>
                                        <span className="text-xs text-muted-foreground text-center">
                                          (We'll generate one if not provided)
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Submit Button - Full Width */}
                  <div className="flex justify-end gap-4 pt-2">
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
                          Create Bet
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
    </AppLayout>
  );
}
