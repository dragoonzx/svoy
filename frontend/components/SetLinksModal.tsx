import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GiLinkedRings } from "react-icons/gi";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function SetLinksModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <GiLinkedRings size={26} /> Set links
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Social Links </DialogTitle>
          <DialogDescription>
            {" "}
            <span className="font mono text-sm text-muted-foreground">[Only one available for beta]</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input id="name" defaultValue="X profile" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Link
            </Label>
            <Input id="description" defaultValue="https://x.com/..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
