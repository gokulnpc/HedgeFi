import { Card, CardContent } from "@/components/ui/card";

const TradersTab = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border border-gray-400/30">
        <CardContent className="p-4">
          <h4 className="text-sm text-muted-foreground">Total Traders</h4>
          <p className="text-2xl font-bold">16K</p>
        </CardContent>
      </Card>
      <Card className="border border-gray-400/30">
        <CardContent className="p-4">
          <h4 className="text-sm text-muted-foreground">Active (24h)</h4>
          <p className="text-2xl font-bold">3.2K</p>
        </CardContent>
      </Card>
      <Card className="border border-gray-400/30">
        <CardContent className="p-4">
          <h4 className="text-sm text-muted-foreground">Avg Trade</h4>
          <p className="text-2xl font-bold">$187</p>
        </CardContent>
      </Card>
      <Card className="border border-gray-400/30">
        <CardContent className="p-4">
          <h4 className="text-sm text-muted-foreground">Total Trades</h4>
          <p className="text-2xl font-bold">45.6K</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default TradersTab;
