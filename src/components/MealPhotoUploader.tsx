import { useRef, useState } from "react";
import { Camera, ImagePlus, Link2, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Curated free-to-use Unsplash photos of Indian meals/tiffins
const SUGGESTED_PHOTOS = [
  "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
  "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=800&q=80",
  "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
  "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
  "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80",
  "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80",
  "https://images.unsplash.com/photo-1626500155159-cb7d29ee8e0a?w=800&q=80",
  "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80",
  "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80",
  "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&q=80",
];

type Props = {
  photoUrl: string | null;
  onChange: (url: string | null) => void;
  dayLabel: string;
};

export function MealPhotoUploader({ photoUrl, onChange, dayLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image is too large (max 4MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result));
      setOpen(false);
      toast.success("Photo added! 📸");
    };
    reader.readAsDataURL(file);
  }

  function handlePickSuggested(url: string) {
    onChange(url);
    setOpen(false);
    toast.success("Photo added! 📸");
  }

  function handleUrlSave() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    try {
      const u = new URL(trimmed);
      if (!/^https?:$/.test(u.protocol)) throw new Error();
    } catch {
      toast.error("Please enter a valid http(s) image URL.");
      return;
    }
    onChange(trimmed);
    setUrlInput("");
    setOpen(false);
    toast.success("Photo added! 📸");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-border bg-muted/40 aspect-[16/9]">
        {photoUrl ? (
          <>
            <img
              src={photoUrl}
              alt={`${dayLabel} meal photo`}
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => {
                toast.error("Couldn't load that image. Try another one.");
                onChange(null);
              }}
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-2">
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="rounded-full h-8">
                  <ImagePlus className="h-3.5 w-3.5 mr-1" /> Change
                </Button>
              </DialogTrigger>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full h-8 text-white hover:bg-white/20 hover:text-white"
                onClick={() => onChange(null)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
              </Button>
            </div>
          </>
        ) : (
          <DialogTrigger asChild>
            <button
              type="button"
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-warm-gradient/20 flex items-center justify-center">
                <Camera className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">Add a meal photo</div>
              <div className="text-xs">Upload, paste a URL, or pick one</div>
            </button>
          </DialogTrigger>
        )}
      </div>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">📸 Photo for {dayLabel}'s tiffin</DialogTitle>
          <DialogDescription>
            Upload your own snap, paste an image link, or pick a tasty one below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="rounded-xl h-12 justify-start"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4 mr-2" /> Upload from device
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste image URL"
                className="pl-9 rounded-xl h-12"
                onKeyDown={(e) => e.key === "Enter" && handleUrlSave()}
              />
            </div>
            <Button onClick={handleUrlSave} className="rounded-xl h-12">
              Save
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-semibold mt-2 mb-3">
            <Wand2 className="h-4 w-4 text-primary" /> Or pick a yummy photo
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[320px] overflow-y-auto">
            {SUGGESTED_PHOTOS.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => handlePickSuggested(url)}
                className={cn(
                  "relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.03] hover:shadow-pop",
                  photoUrl === url ? "border-primary" : "border-transparent",
                )}
              >
                <img
                  src={url}
                  alt="Indian meal suggestion"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
