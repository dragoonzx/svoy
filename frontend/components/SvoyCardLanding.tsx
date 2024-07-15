import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Meteors } from "./ui/meteors";

export function SvoyCardLanding() {
  return (
    <div className="relative">
      <Card className="w-[380px] relative overflow-hidden text-left z-10 bg-chetoblack">
        <CardHeader>
          <CardTitle className="text-3xl">
            Max S <span className="text-sm text-muted-foreground font-mono uppercase">[Pro]</span>
          </CardTitle>
          <CardDescription>Svoy project creator</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <p>Links</p>
              <span className="flex items-center space-x-2">
                <LinkIcon size={16} />
                <Link className="hover:underline text-sm" to={"/app"}>
                  Create Svoy profile now
                </Link>
              </span>
              <span className="flex items-center space-x-2">
                <LinkIcon size={16} />
                <Link className="hover:underline text-sm" target="_blank" to={"https://github.com/dragoonzx/svoy"}>
                  Project Github
                </Link>
              </span>
              <span className="flex items-center space-x-2 text-muted-foreground">
                <LinkIcon size={16} />
                <Link className="text-sm cursor-not-allowed" to={"/app"}>
                  x.com
                </Link>
              </span>
            </div>
            <div>
              <img
                src="/showcase_example.png"
                width={72}
                height={72}
                className="h-auto rounded-lg p-1 border border-white"
              />
            </div>
          </div>
          <div className="absolute rotate-45 w-28 h-4 text-xs bg-bluez top-6 -right-6 text-center">Raffle now!</div>
          <Meteors number={10} />
        </CardContent>
      </Card>
      <GradientBg />
    </div>
  );
}

function GradientBg() {
  return (
    <div className=" absolute -z-10 inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-bluez transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
  );
}
