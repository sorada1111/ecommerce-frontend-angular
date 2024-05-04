import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItem: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {}

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItem.length > 0) {
      //find the item in the cart based on item id
      existingCartItem = this.cartItem.find(
        (tempCartItem) => tempCartItem.id === theCartItem.id
      );
      //check if we found it
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      //Increment the quantity
      existingCartItem!.quantity++;
    } else {
      // Add the item to the array.
      this.cartItem.push(theCartItem);
    }

    // compute cart total price and total quantity

    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItem) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values ... all subscribers will reeive the new data

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data just for debugginf purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);
    for (let tempCartItem of this.cartItem) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(
        `name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`
      );
      console.log(
        `totalPrice: ${totalPriceValue.toFixed(
          2
        )}, totalQuantity: ${totalPriceValue}`
      );
      console.log(`------`);
    }
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItem.findIndex(
      (tempCartItem) => tempCartItem.id == theCartItem.id
    );
    if (itemIndex > -1) {
      this.cartItem.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
