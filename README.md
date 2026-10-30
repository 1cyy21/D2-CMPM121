# D2 starter

A minimal TypeScript/Vite browser project with Deno checks and GitHub Pages deployment.

## Github Pages

[Sketchpad](https://1cyy21.github.io/D2-CMPM121/)

## How to Use

On the page is an interactable canvas with an interface board underneath. The user can draw on the canvas by holding left click on their mouse while the cursor is in the space. The interface board has the buttons: Redraw, Redo, Undo, Clear Pixels, Add Sticker, and Export PNG. Pressing "Undo" undoes the latest brush stroke added to the canvas while pressing "Redo" brings it back. Pressing on "Clear Pixels" wipes the canvas of all brush stroke made while pressing "Redraw" returns the cleared canvas. Pressing "Export PNG" exports any art made on the canvas to a PNG download. To use "Add Sticker" the user must input the desired name of their sticker into the "Name Sticker" text box and their desired sticker (emoji and/or text) into the "Insert Sticker" text box. When both are filled, pressing "Add Sticker" will add it to the dropdown menu. The are five options in the dropdown menu to start with: Thin Brush, Thick Brush, Smiley Face, Pumpkin, and Top Hat. Selecting Thin Brush and Thick Brush allows the user to draw freely on the canvas while choosing the rest will add the respective sticker ("☺️", "🎃", "🎩") to the canvas.

## How to install

First, go to the Repo Page and click on code. This allows you to grab a link of the Repo to clone into your own GitHub repository. Create a GitHub Repository and type "git clone [LINK]" into the terminal. To run this project, you'll need to download the "Deno" and "markdownlinit" extensions in your Github Extensions.

You will need internet to access the initial repo, clone it, download extensions, and initialize it onto your device.

After that, you do not need internet to run it locally on your device.

## Adding new interactions

If you plan to add any new interactions such as additional brushes, stickers, or even a shape tool, you'll need to edit the "render.ts" file which contains the data for how the brush and stickers are applied to the canvas. "ctx.save" handles how the brush selection changes user output and you can add any additional commands that match your desired result. If there is data you need to add that is not available in the current objects, you can modify "model.ts" to add additional variables to opjects such as brush width or shape.

## Credits

Tooling adapted from the [CMPM 121 Fall 2026 D1 starter](https://github.com/ucsc-cmpm-121-f26/d1-starter/tree/d949e744b0f9fb7c133a5316f86f2b7fe54529ad), derived from the [S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da). Those repositories have no explicit repository license; no new license is assigned to that material. The D2 scaffold was authored with OpenCode/OpenAI GPT-6.1 Sol assistance. Dependencies retain their respective licenses.
