# prompster: ChatGPT Slash Commands

[![Available in the Chrome Web Store](https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png)](https://chrome.google.com/webstore/detail/prompster/fbagfekcjdidpmmookklbaeddgkjddml) [![Get the addon](https://blog.mozilla.org/addons/files/2015/11/get-the-addon.png)](https://addons.mozilla.org/en-US/firefox/addon/prompster/)

Prompster is a Chrome/Firefox extension that streamlines your experience with OpenAI's ChatGPT by providing quick and easy access to a list of custom autocomplete prompts. By using a simple trigger character and a keyword-based system, you can insert predefined prompts directly into your ChatGPT input field. The list of predefined prompts is stored at [static/default_prompts.json](https://github.com/LucasAschenbach/prompster/blob/main/static/default_prompts.json) file and can be easily modified to suit your needs.

![prompster for ChatGPT](https://github.com/lucasaschenbach/prompster/blob/main/assets/prompster-demo.gif)

## How it works
1. Type the trigger character `/` in an input field on the site.
2. An autocomplete window with a textfield will appear above the input field.
3. As you type your prompt keyword, the window will display up to 5 suggestions that match the starting characters.
4. The first suggestion is selected by default, but you can navigate the options using arrow keys.
5. Press the `tab` key to insert the prompt associated with the selected keyword into the text field.
6. Press the escape key to close the window and discard the text.

## Install

### Official Store

Install from the official plugin store for your browser:

- [Chrome](https://chrome.google.com/webstore/detail/prompster/fbagfekcjdidpmmookklbaeddgkjddml)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/prompster/)

### Manually

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
   1. Open Chrome and go to chrome://extensions/.
   2. Enable "Developer mode" in the top right corner.
   3. Click "Load unpacked" and select the dist folder in the project directory.
   4. Your extension should now be loaded and ready to use with ChatGPT.

## Credits
The prompts inside [static/default_prompts.json](https://github.com/LucasAschenbach/prompster/blob/main/static/default_prompts.json) were sourced from the [Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts) repository. If you found the prompts interesting and useful, consider checking out their repository!

## License
This project is open-source and available under the MIT License. For more details, please see the [LICENSE](https://github.com/LucasAschenbach/prompster/blob/main/LICENSE) file.
