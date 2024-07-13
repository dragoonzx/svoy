import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function SvoyCard() {
  return (
    <div className="relative">
      <Card className="w-[380px] relative overflow-hidden text-left z-10 bg-chetoblack">
        <CardHeader className="relative">
          <CardTitle className="text-3xl">
            Max S <span className="text-sm text-muted-foreground font-mono uppercase">[Pro]</span>
          </CardTitle>
          <CardDescription className="flex">
            <div>Svoy project creator</div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
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
                <Link className="hover:underline text-sm" to={"/app"}>
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
              <div className="h-[72px] w-[72px] rounded-lg p-1 border border-white text-center text-xs flex items-center">
                Showcase NFT
              </div>
              {/* <img
                src="/showcase_example.png"
                width={72}
                height={72}
                className="h-auto rounded-lg p-1 border border-white"
                alt="No"
              /> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
