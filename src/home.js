
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
//import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';

class Home extends PolymerElement {
  static get properties () {
    return {
    
    };
  }

  constructor() {
    super();
  }

  ready(){
    super.ready();
  }
  

  static get template () {
    return html`
      <style>
     
      </style>

    `;
  }
}

// Register the element with the browser.
customElements.define('home', Home);
