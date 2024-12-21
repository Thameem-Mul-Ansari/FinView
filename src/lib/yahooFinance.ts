import axios from 'axios';

export interface YahooStock {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  score: number;
}

export const searchStocks = async (query: string): Promise<YahooStock[]> => {
  if (!query) return [];
  
  try {
    // Using Yahoo Finance autocomplete API
    const response = await axios.get(
      `https://ac.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&lang=en-US&region=US&quotesCount=10&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.quotes) {
      return response.data.quotes
        .filter((quote: any) => quote.symbol && quote.shortname)
        .map((quote: any) => ({
          symbol: quote.symbol,
          name: quote.shortname || quote.longname || '',
          exchange: quote.exchange || '',
          type: quote.quoteType || '',
          score: quote.score || 0
        }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching stock suggestions:', error);
    return [];
  }
}