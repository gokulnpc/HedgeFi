export interface TokenHolder {
  holder_address: string;
  percentage: number;
  token_name: string;
  symbol: string;
}

export interface TopTokenHolders {
  data: TokenHolder[];
}
