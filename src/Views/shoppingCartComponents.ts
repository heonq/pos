import formatter from '../../utils/formatter';
import $ from '../../utils/index.js';
import { ShoppingCartComponentsInterface } from '../interfaces/ViewInterfaces';

const shoppingCartComponents: ShoppingCartComponentsInterface = {
  renderShoppingCart(shoppingCartData) {
    return shoppingCartData.map((cartProduct) => this.renderEachCartProduct(cartProduct)).join('');
  },

  renderEachCartProduct(cartProduct) {
    return `<div class="cart-row" data-number="${cartProduct.number}">
<div class="cart-product">
<div class="product-name">${cartProduct.name}</div>
  <div class="total-price">${formatter.formatNumber(cartProduct.price * cartProduct.quantity)}원
  </div>
</div>
<div class="quantity-box">
  <div class="minus">-</div>
  <div class="quantity">${cartProduct.quantity}</div>
  <div class="plus">+</div>
  <div class="delete">x</div>
</div>
</div>
`;
  },

  rerenderQuantityPrice(cartProduct, index) {
    const cartList = $('#shopping-cart-box').querySelectorAll('.cart-row');
    cartList[index].querySelector('.quantity').innerText = cartProduct.quantity;
    cartList[index].querySelector('.total-price').innerText = `${formatter.formatNumber(
      cartProduct.price * cartProduct.quantity,
    )}원`;
  },

  removeCartList(index) {
    const targetNode = $('#shopping-cart-box').querySelectorAll('.cart-row')[index];
    targetNode.parentNode.removeChild(targetNode);
  },
};

export default shoppingCartComponents;
