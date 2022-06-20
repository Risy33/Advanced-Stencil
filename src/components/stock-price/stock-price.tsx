import { Component, Element, State } from '@stencil/core';
import { h } from '@stencil/core';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'dr-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  @State() fetchedPrice: number;

  @Element() el: HTMLElement;

  onFetchStockPrice(event: Event) {
    event.preventDefault();

    const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;

    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}=${AV_API_KEY}`)
      .then(res => {
        return res.json();
      })
      .then(parsedRes => (this.fetchedPrice = +parsedRes['Global Quote']['05. price'])) //the + converts the string in to a number
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input type="text" id="stock-symbol" />
        <button type="submit">Fetch</button>
      </form>,
      <div>
        <p>Price: $ {this.fetchedPrice}</p>
      </div>,
    ];
  }
}
