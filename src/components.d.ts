/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface DrStockPrice {
    }
}
declare global {
    interface HTMLDrStockPriceElement extends Components.DrStockPrice, HTMLStencilElement {
    }
    var HTMLDrStockPriceElement: {
        prototype: HTMLDrStockPriceElement;
        new (): HTMLDrStockPriceElement;
    };
    interface HTMLElementTagNameMap {
        "dr-stock-price": HTMLDrStockPriceElement;
    }
}
declare namespace LocalJSX {
    interface DrStockPrice {
    }
    interface IntrinsicElements {
        "dr-stock-price": DrStockPrice;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "dr-stock-price": LocalJSX.DrStockPrice & JSXBase.HTMLAttributes<HTMLDrStockPriceElement>;
        }
    }
}
