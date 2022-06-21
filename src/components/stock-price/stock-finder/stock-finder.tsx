import { Component, h, State } from '@stencil/core';
import { DR_API_KEY } from '../../../global/global';

@Component({
  tag: 'dr-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @State() searchResult: { symbol: string; name: string }[] = [];

  onFindStocks(event: Event) {
    event.preventDefault();
    const stockName = this.stockNameInput.value;
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${DR_API_KEY}`)
      .then(res => res.json())
      .then(parsedRes => {
        this.searchResult = parsedRes['bestMatches'].map(match => {
          return { name: match['2. name'], symbol: match['1. symbol'] };
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input type="text" id="stock-symbol" ref={el => (this.stockNameInput = el)} />
        <button type="submit">Find!</button>
      </form>,
      <ul>
        {this.searchResult.map(result => (
          <li>{result.name}</li>
        ))}
      </ul>,
    ];
  }
}
