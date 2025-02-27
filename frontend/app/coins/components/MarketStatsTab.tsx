import { type Coin } from "@/app/data/mockCoins";

type TimeRange = "5M" | "1H" | "4H" | "24H";

type VolumeData = {
  timeRange: TimeRange;
  buyVolume: number;
  sellVolume: number;
  netChange: number;
};

const MarketStatsTab = ({
  coinData,
  volumeData,
}: {
  coinData: Coin;
  volumeData: VolumeData[];
}) => (
  <div className="space-y-6">
    {/* Market Overview Stats */}
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-black/20 p-4 rounded-lg border border-gray-400/30">
        <div className="text-sm text-muted-foreground">Market Cap</div>
        <div className="text-xl font-bold">$15M</div>
      </div>
      <div className="bg-black/20 p-4 rounded-lg border border-gray-400/30">
        <div className="text-sm text-muted-foreground">Liquidity</div>
        <div className="text-xl font-bold">$2.3M</div>
      </div>
      <div className="bg-black/20 p-4 rounded-lg border border-gray-400/30">
        <div className="text-sm text-muted-foreground"># of Holders</div>
        <div className="text-xl font-bold">32K</div>
      </div>
      <div className="bg-black/20 p-4 rounded-lg border border-gray-400/30">
        <div className="text-sm text-muted-foreground"># of Markets</div>
        <div className="text-xl font-bold">43</div>
      </div>
    </div>

    {/* Time Range Stats */}
    <div className="grid grid-cols-4 gap-4">
      {volumeData.map((data) => (
        <div
          key={data.timeRange}
          className="bg-black/20 p-4 rounded-lg border border-gray-400/30"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{data.timeRange}</span>
            <span
              className={`text-sm ${
                data.netChange >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {data.netChange > 0 ? "+" : ""}
              {data.netChange}%
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Transaction Analysis */}
    <div className="space-y-4">
      <div className="bg-black/20 p-4 rounded-lg border border-gray-400/30">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-sm text-muted-foreground mr-2">TXNS</span>
            <span className="text-lg font-bold">16K</span>
          </div>
          <div className="flex gap-20">
            <div>
              <span className="text-sm text-green-400">BUYS</span>
              <span className="text-sm text-muted-foreground ml-2">7.8K</span>
            </div>
            <div>
              <span className="text-sm text-red-400">SELLS</span>
              <span className="text-sm text-muted-foreground ml-2">7.8K</span>
            </div>
          </div>
        </div>
        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-red-400"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div className="bg-black/20 p-4 rounded-lg border border-gray-400/30">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-sm text-muted-foreground mr-2">VOLUME</span>
            <span className="text-lg font-bold">$3M</span>
          </div>
          <div className="flex gap-20">
            <div>
              <span className="text-sm text-green-400">BUY VOL</span>
              <span className="text-sm text-muted-foreground ml-2">$1.4M</span>
            </div>
            <div>
              <span className="text-sm text-red-400">SELL VOL</span>
              <span className="text-sm text-muted-foreground ml-2">$1.4M</span>
            </div>
          </div>
        </div>
        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-red-400"
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  </div>
);

export default MarketStatsTab;
