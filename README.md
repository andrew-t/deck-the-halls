# deck-the-halls

_Trolling the ancient Yuletide carol_

This bot watched the public Twitter timeline and checks for tweets which fit the metre of Deck The Halls With Boughs Of Holly. That is, four metrical feet consisting of a stressed and an unstressed syllable.

To do this, we use a list of words mapped to their stress patterns. I use [the CMU Pronouncing Dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict), which is a wonderful resource but does mean technically the bot has a slight US accent. It also can't tell what sense a tweet means a word in which can change the stress pattern.

There are a couple of other things it filters for, including tweets that are just the same word four or eight times, or tweets where it isn't fairly clear which parts are content and which are hashtags and the like.

The gist of the code is that it turns a tweet into a string of numbers: a 0 for an unstressed beat, and a 1 or a 2 for a stressed beat. We test it against the regex `/^([1-9]0){4}$/` to test for Deck the Hallsiness. You can configure the code to sing other songs by [changing that regex](https://github.com/andrew-t/deck-the-halls/blob/master/index.js#L62).

The bot runs at [@falalala_la](https://twitter.com/falalala_la/) during Christmastime.

To run, this code needs:

 * Some Twitter credentials in `creds.json`, in a format [twit](https://www.npmjs.com/package/twit) will understand.
 * A copy of [the CMU Pronouncing Dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict) in `dict.txt`.
