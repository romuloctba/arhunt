# AR Hunt

## About
A quick easter-hunt prototype game, where 10 markers were distirbuted on our office walls, and anyone could open the APP and hunt for them.
After reading all markers, user has all clues he need to guess 1 of the 5 sorted 'secret word'.

> [Powered By AR.js](https://github.com/jeromeetienne/AR.js)

## How it works
- When first start, it randomly chooses a `activePath` 
- Each path has a different sequence of clues
- Currently there are 10 markers registered
- Each path has a certain amount of clues to be collected
- Each clue is a letter 
- The clues are shown in order they are collected
- Some markers may not have clues for some `path`.
- Gather all usefull marks and figure out the final word

## How to run this project

1. Have NodeJS installed (tested with v10.15.3)

2. clone this repository & open it in terminal

3. run: `$ npm install`

## Development

- after sucessfull npm install, run:
`$ npm start`

This loads the browser at http://localhost:8080


## Production / Publish

- The command `npm run build`  builds to the `docs` folder (so it can be published using githubpages)
- The destination can be changed at `webpack.config.js` 
- Another **important** parameter is `const baseUrlProd = "/arhunt/"`. Replace /arhunt/ with the repo or public folder name


## The Markers
- This uses 3x3 2d Barcode marker
- This uses marker #1 to #10
- PNG files that you can print are available at [./_markers](./_markers) folder
- There is [this Marker Generator](http://au.gmented.com/app/marker/marker.php) on the Webs

**Important** specially on iOS, the marker borders must be clear (about 1cm clear), or the camera will have trouble reading it.

---

## Clue image Credits
The Clue image credits are available on CLUE_IMAGE_CREDITS.md
You can there find the author, and the original image source URL.
Most of images are available in .eps or .ai vector originaly.
They were all downloaded from Freepik.com

## Disclaimer
> This is a personal project, coded by me (Rômulo Zoch) to have fun at easter celebration at my work.
The Company or clients I work for had no part or supervision in coding this project, and any opinions here present do not reflect any opinions but the author's.

> The original version (that we played) had famous character images, and it was changed to avoid copyright issues, since I own no rights for any of the clues presented here.

## MIT LICENSE DISCLAIMER
The MIT License applies to the project, except for the clue images, which can have their own LICENSE. Please reffer to their SOURCE_URL available at CLUE_IMAGES_CREDITS.md file if you want to use them in your project. 
(They were all free when I used them, and I believe still are. But the owners may have specific demands to fair use them, so please be aware of that.)