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
import { GiCardRandom } from "react-icons/gi";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function RaffleSetupModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <GiCardRandom size={26} /> Raffle setup
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Raffle Kudos Setup</DialogTitle>
          <DialogDescription>Raffle earned Kudos to your network</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Amount
            </Label>
            <div className="w-full col-span-3 relative">
              <div className="absolute -top-5 right-0 text-xs font-mono">Balance: 0</div>
              <Input id="name" type="number" defaultValue="1" className="col-span-3" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="description" defaultValue="https://x.com/..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              End date
            </Label>
            <Input id="description" defaultValue="https://x.com/..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Setup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
