import { Component, EventEmitter, h, State, Event } from '@stencil/core';
import { DR_API_KEY } from '../../../global/global';

@Component({
  tag: 'dr-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @State() searchResult: { symbol: string; name: string }[] = [];

  @State() loading = false;

  @Event({ bubbles: true, composed: true }) ucSymbolSelected: EventEmitter<string>; //uc stands for unique

  onFindStocks(event: Event) {
    event.preventDefault();
    this.loading = true;
    const stockName = this.stockNameInput.value;
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${DR_API_KEY}`)
      .then(res => res.json())
      .then(parsedRes => {
        this.searchResult = parsedRes['bestMatches'].map(match => {
          return { name: match['2. name'], symbol: match['1. symbol'] };
        });

        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      });
  }

  onSelectSymbol(symbol: string) {
    this.ucSymbolSelected.emit(symbol); //emit method allows you to "emit" an event, which causes all callbacks registered to the event to 'fire', (get called).
  }

  render() {
    let content = (
      <ul>
        {this.searchResult.map(result => (
          <li onClick={this.onSelectSymbol.bind(this, result.symbol)}>
            <strong>{result.symbol}</strong> - {result.name}
          </li>
        ))}
      </ul>
    );
    if (this.loading) {
      content = <dr-spinner />;
    }
    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input type="text" id="stock-symbol" ref={el => (this.stockNameInput = el)} />
        <button type="submit">Find!</button>
      </form>,
      content,
    ];
  }
}
