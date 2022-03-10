/**
Fragments of Sapho
Lydia Graveline

A webpage of ancient greek poetry by Sappho that is quickly disintegrating,
it is the user's job to recover the fragmented poems by clicking on the missing
lines. This program is based on Anne Carson's translation of Sappho "If Not, Winter".

*/

"use strict";

// The chance a span will be start disintegrating per update
const REVEAL_PROBABILITY = 0.1;
// How often to update the spans (potentially disintegrating them)
const UPDATE_FREQUENCY = 500;

// The number of the current poem displayed
var count = 0;
// The total number of poems in the program
var total = $("section").length - 1;

/**
When the button is clicked, display the next poem
*/
$(`:button`).on(`click`, function () {
  // If the last poem has been reached, start the counter over
  if (count >= total) {
    $("section").eq(total).hide();
    count = 1;
  } else {
    count++;
  }

  $("#counter").html(function (i, val) {
    return (val = count);
  });
  $("section").eq(count).show();
  $("section").eq(count - 1).hide();
});

// recover the words when the mouse
$(`.redacted`).on(`mouseover`, recover);

// Set an interval of 500 milliseconds to attempt fading the poem
setInterval(update, UPDATE_FREQUENCY);

/**
When a line of the poem is clicked we remove its redacted class and add the recovered class
*/
function recover(event) {
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

/**
With random chance it fading the current line by removing the
recovered class and adding the revealed class. Because this function is called
by each(), "this" refers to the current element that each has selected.
*/
function disintegrate() {
  let r = Math.random();
  if (r < 0.1) {
    $(this).removeClass(`recovered`);
    $(this).addClass(`redacted`);
  }
}
