import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export function SvoyCard({
  name,
  description,
  socialLinks,
  pfpUrl,
}: {
  name: string;
  description: string;
  socialLinks?: { href: string; title: string };
  pfpUrl?: string;
}) {
  return (
    <div className="relative">
      <Card className="w-[380px] relative overflow-hidden text-left z-10 bg-chetoblack">
        <CardHeader className="relative">
          <CardTitle className="text-3xl flex items-center gap-2">
            {name ? name : <Skeleton className="h-[36px] w-[100px]" />}{" "}
            <span className="text-sm text-muted-foreground font-mono uppercase">[Newbie]</span>
          </CardTitle>
          <CardDescription className="flex">
            <div>{description ? description : <Skeleton className="h-[20px] w-[200px]" />}</div>
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
                <Link className="hover:underline text-sm" target="_blank" to={"https://github.com/dragoonzx/svoy"}>
                  Project Github
                </Link>
              </span>
              <span
                className={cn(
                  "flex items-center space-x-2",
                  socialLinks?.href ? "text-bluez" : "text-muted-foreground",
                )}
              >
                <LinkIcon size={16} />
                <Link
                  className={cn("text-sm", socialLinks?.href ? "hover:underline" : "cursor-not-allowed")}
                  to={socialLinks?.href ? socialLinks.href : "/app"}
                  target="_blank"
                >
                  {socialLinks?.title ? socialLinks.title : "x.com"}
                </Link>
              </span>
            </div>
            <div>
              {pfpUrl ? (
                <img src={pfpUrl} width={72} height={72} className="h-auto rounded-lg p-1 border border-white" alt="" />
              ) : (
                <div className="h-[72px] w-[72px] rounded-lg p-1 border border-white text-center text-xs flex items-center">
                  Showcase NFT
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
