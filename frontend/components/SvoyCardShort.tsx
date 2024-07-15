import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function SvoyCardShort({ name, description, index }: { name: string; description: string; index?: string }) {
  return (
    <div className="relative">
      <Card className="w-[380px] relative overflow-hidden text-left z-10 bg-chetoblack">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="text-xl">
              <p>
                {name} <span className="text-xs text-muted-foreground font-mono uppercase">[Newbie]</span>
              </p>
              <p className="font-mono text-xs text-muted-foreground">#{index ?? "null"}</p>
            </div>
            <div className="text-muted-foreground text-sm flex items-center">{description}</div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
