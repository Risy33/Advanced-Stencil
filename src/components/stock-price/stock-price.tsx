import { Component } from '@stencil/core';
import { h } from '@stencil/core';

@Component({
  tag: 'dr-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  onFetchStockPrice(event: Event) {
    event.preventDefault();
    console.log('submitted');
  }

  render() {
    return [
      <form onSubmit={this.onFetchStockPrice}>
        <input type="text" id="stock-symbol" />
        <button type="submit">Fetch</button>
      </form>,
      <div>
        <p>Price: {0}</p>
      </div>,
    ];
  }
}
