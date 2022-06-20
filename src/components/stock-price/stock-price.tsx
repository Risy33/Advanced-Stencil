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
  @State() stockUserinput: string;
  @State() stockInputValid = false;

  onUserInput(event: Event) {
    this.stockUserinput = (event.target as HTMLInputElement).value;
    if (this.stockUserinput.trim() !== '') {
      this.stockInputValid = true;
    } else {
      this.stockInputValid = false;
    }
  }

  stonckInput: HTMLInputElement;

  //   @Element() el: HTMLElement;

  onFetchStockPrice(event: Event) {
    event.preventDefault();

    // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;
    const stockSymbol = this.stonckInput.value; //this alternative will it's used when ref is used

    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
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
        <input type="text" id="stock-symbol" ref={el => (this.stonckInput = el)} value={this.stockUserinput} onInput={this.onUserInput.bind(this)} />
        <button type="submit" disabled={!this.stockInputValid}>
          Fetch
        </button>
      </form>,
      <div>
        <p>Price: $ {this.fetchedPrice}</p>
      </div>,
    ];
  }
}
