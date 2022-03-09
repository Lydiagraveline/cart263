/**
Fragments of Sapho
Lydia Graveline

A webpage of ancient greek poetry by Sappho that is quickly disintegrating,
it is the user's job to recover the fragmented poems by clicking on the missing
lines. This program is based on Anne Carson's translation of Sappho "If Not, Winter".

*/

"use strict";

$(`.lost`).on(`click`, recover);

setInterval(update, 500);

function recover(event){
  $(this).removeClass(`redacted`);
  $(this).addClass(`recovered`);
}

/**
Update is called every 500 milliseconds and it updates all the secrets on the page
using jQuery`s each() function which calls the specified function on _each_ of the
elements in the selection
*/
function update() {
  $(`.recovered`).each(disintegrate);
}

function disintegrate(){
  let r = Math.random();
  if (r < 0.1) {
    $(this).removeClass(`recovered`);
    $(this).addClass(`redacted`);
  }
}
