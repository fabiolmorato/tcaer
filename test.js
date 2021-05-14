import { html } from "./tcaer/tcaer.js";
import render from "./tcaer/render.js";

function Component () {
  return html`
    <div class="component class-1 class-2">
      <${Hello} name="World" />
      Is it     working?
    </div>
  `;
}

function Hello ({ name }) {
  return html`
    <h1>Hello ${name}!</h1>
  `;
}

render(Component(), document.querySelector("#root"));
