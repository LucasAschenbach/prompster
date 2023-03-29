# prompster: ChatGPT Slash Commands

Prompster is a handy Chrome extension that streamlines your experience with OpenAI's ChatGPT by providing quick and easy access to a list of custom autocomplete prompts. By using a simple trigger character and a keyword-based system, you can insert predefined prompts directly into your ChatGPT input field. The list of predefined prompts is stored at [static/prompts.json](https://github.com/LucasAschenbach/prompster/blob/main/static/prompts.json) file and can be easily modified to suit your needs.

<p align="center"><img src="https://github.com/lucasaschenbach/prompster/blob/main/assets/prompster-screenshot.png?raw=true" alt="prompster in ChatGPT"></p>

## How it works
1. Type the trigger character `/` in an input field on the site.
2. An autocomplete window with a textfield will appear above the input field.
3. As you type your prompt keyword, the window will display up to 5 suggestions that match the starting characters.
4. The first suggestion is selected by default, but you can navigate the options using arrow keys.
5. Press the `tab` key to insert the prompt associated with the selected keyword into the text field.
6. Press the escape key to close the window and discard the text.

## How to Run

1. Clone this repository:

```bash
git clone https://github.com/lucasaschenbach/prompster.git
```

2. Change to the project directory:
```bash
cd prompster
```

3. Install the dependencies:
```bash
npm install
```

4. Build the extension:
```bash
npm run build
```

5. Load the extension in Chrome:
  a) Open Chrome and go to chrome://extensions/.
  b) Enable "Developer mode" in the top right corner.
  c) Click "Load unpacked" and select the dist folder in the project directory.
  d) Your extension should now be loaded and ready to use on any website with input fields.

## Credits
The prompts inside [static/prompts.json](https://github.com/LucasAschenbach/prompster/blob/main/static/prompts.json) were sourced from the [Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts) repository. If you found the prompts interesting and useful, consider checking out their repository!

## License
This project is open-source and available under the MIT License. See the LICENSE file for more details.
