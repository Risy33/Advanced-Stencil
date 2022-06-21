import { Component, Element, Prop, State } from '@stencil/core';
import { h } from '@stencil/core';
import { DR_API_KEY } from '../../global/global';

@Component({
  tag: 'dr-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  stockInput: HTMLInputElement; //used to get access to our user input data when we are using ref
  @State() fetchedPrice: number;
  @State() stockUserinput: string;
  @State() stockInputValid = false;
  @State() error: string;

  @Prop() stockSymbol: string;

  @Element() el: HTMLElement; //used to get access to our user input data when we are using querySelector

  onUserInput(event: Event) {
    this.stockUserinput = (event.target as HTMLInputElement).value;
    if (this.stockUserinput.trim() !== '') {
      this.stockInputValid = true;
    } else {
      this.stockInputValid = false;
    }
  }

  onFetchStockPrice(event: Event) {
    event.preventDefault();

    // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;
    const stockSymbol = this.stockInput.value; //this alternative it's used when ref is used
    this.fetchStockPrice(stockSymbol);
  }

  componentDidLoad() {
    if (this.stockSymbol) {
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  fetchStockPrice(stockSymbol: string) {
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${DR_API_KEY}`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('invalid');
        }
        return res.json();
      })
      .then(parsedRes => {
        if (!parsedRes['Global Quote']['05. price']) {
          throw new Error('ivalid symbol');
        }
        this.error = null;
        this.fetchedPrice = +parsedRes['Global Quote']['05. price'];
      }) //the + converts the string in to a number
      .catch(err => {
        this.error = err.message;
      });
  }

  render() {
    let dataContent = <p>Please enter a symbol</p>;
    if (this.error) {
      dataContent = <p>{this.error}</p>;
    }
    if (this.fetchedPrice) {
      dataContent = <p>Price: $ {this.fetchedPrice}</p>;
    }

    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input type="text" id="stock-symbol" ref={el => (this.stockInput = el)} value={this.stockUserinput} onInput={this.onUserInput.bind(this)} />
        <button type="submit" disabled={!this.stockInputValid}>
          Fetch
        </button>
      </form>,
      <div>{dataContent}</div>,
    ];
  }
}
