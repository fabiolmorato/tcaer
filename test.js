import { html } from "./tcaer/tcaer.js";

function Component () {
  return html`
    <div class="component class-1 class-2">
      <${Hello} name="World" id=${1} />
      Is it     working?
      ${"hello!!!"}
    </div>
  `;
}

function Hello ({ name }) {
  return html`
    <h1>Hello ${name}!</h1>
  `;
}

console.log(
  JSON.stringify(
    Component(),
    null,
    4
  )
);
