import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { towns as townNames} from './towns.js';

const townsTemplate = (towns) => html`
<ul>
   ${towns.map(t => html`<li class=${t.match ? 'active' : ''}>${t.name}</li>`)}
</ul>`;

const towns = townNames.map(t => ({name: t, match: false}));
const resultDiv = document.getElementById('towns');
const input = document.getElementById('searchText');
const output = document.getElementById('result');

document.querySelector('button').addEventListener('click', onClick);

renderTowns();

function onClick() {
   const match = input.value.trim().toLocaleLowerCase();
   let matches = 0;
   for (let town of towns) {
      if (match && town.name.toLocaleLowerCase().includes(match)) {
         town.match = true;
         matches += 1;
      } else {
         town.match = false;
      }
   }
   output.textContent = `${matches} matches found`;
   renderTowns();
}

function renderTowns() {
   const result = townsTemplate(towns);
   render(result, resultDiv);
}

