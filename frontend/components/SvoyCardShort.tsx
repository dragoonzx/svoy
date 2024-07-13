import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function SvoyCardShort() {
  return (
    <div className="relative">
      <Card className="w-[380px] relative overflow-hidden text-left z-10 bg-chetoblack">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="text-xl">
              <p>
                Max S <span className="text-xs text-muted-foreground font-mono uppercase">[Pro]</span>
              </p>
              <p className="font-mono text-xs text-muted-foreground">#0001</p>
            </div>
            <div className="text-muted-foreground text-sm flex items-center">Some description</div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
