import { Component, Element, Listen, Prop, State, Watch, Host } from '@stencil/core';
import { h } from '@stencil/core';
import { DR_API_KEY } from '../../global/global';

@Component({
  tag: 'dr-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  stockInput: HTMLInputElement; //used to get access to our user input data when we are using ref
  // initialStockSymbol: string;
  @State() fetchedPrice: number;
  @State() stockUserinput: string;
  @State() stockInputValid = false;
  @State() error: string;
  @State() loading = false;

  @Element() el: HTMLElement; //used to get access to our user input data when we are using querySelector

  @Prop({ mutable: true, reflect: true }) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.stockUserinput = newValue;
      this.stockInputValid = true;
      this.fetchStockPrice(newValue);
    }
  }

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
    this.stockSymbol = this.stockInput.value; //this alternative it's used when ref is used
    // this.fetchStockPrice(stockSymbol);
  }

  componentWillLoad() {
    console.log('component will load');
    console.log(this.stockSymbol);
    if (this.stockSymbol) {
      // this.initialStockSymbol = this.stockSymbol;
      this.stockUserinput = this.stockSymbol;
      this.stockInputValid = true;
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  componentDidLoad() {
    //lifecycle hook
    console.log('componentDidLoad');
  }

  componentWillUpdate() {
    console.log('componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    // if (this.stockSymbol !== this.initialStockSymbol) {
    //   this.initialStockSymbol = this.stockSymbol;
    //   this.fetchStockPrice(this.stockSymbol);
    // }
  }

  disconnectedCallback() {
    console.log('componenDidUnload');
  }

  @Listen('ucSymbolSelected', { target: 'body' })
  onStockSymbolSelected(event: CustomEvent) {
    console.log('stock symbol selected: ' + event.detail);
    if (event.detail && event.detail !== this.stockSymbol) {
      this.stockSymbol = event.detail;
    }
  }

  fetchStockPrice(stockSymbol: string) {
    this.loading = true;
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
        this.loading = false;
      }) //the + converts the string in to a number
      .catch(err => {
        this.error = err.message;
        this.fetchedPrice = null;
        this.loading = false;
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
    if (this.loading) {
      dataContent = (
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }

    return (
      <Host class={this.error ? 'error' : ''}>
        <form onSubmit={this.onFetchStockPrice.bind(this)}>
          <input type="text" id="stock-symbol" ref={el => (this.stockInput = el)} value={this.stockUserinput} onInput={this.onUserInput.bind(this)} />
          <button type="submit" disabled={!this.stockInputValid || this.loading}>
            Fetch
          </button>
        </form>
        <div>{dataContent}</div>
      </Host>
    );
  }
}
