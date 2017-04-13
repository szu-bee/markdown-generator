function Heads(md) {
    const regexHeads = /^(\#{1,6})([^\#\n]+)$/m;
    while (regexHeads.exec(md) !== null) {
        let heads = regexHeads.exec(md);
        md = md.replace(heads[0], '<h' + heads[1].length + '>' + heads[2] +
            '</h' + heads[1].length + '>');
    }
    return md;
}


function URL(md) {
    const regexURL = /\[(.*)\]\((.*)\)/;
    while (regexURL.exec(md) !== null) {
        let urls = regexURL.exec(md);
        md = md.replace(urls[0],
            '<a href="' + urls[2] + '">' + urls[1] + '</a>');
    }
    return md;
}


function Image(md) {
    const regexImage = /\!\[(.*)\]\((.*)\)/;
    while (regexImage.exec(md) !== null) {
        let images = regexImage.exec(md);
        md = md.replace(images[0], '<img src="' + images[2] +
            '" style="padding-bottom: 4px;"><div style="border-bottom-color: grey;">' +
            images[1] + '</div>');
    }
    return md;
}


function FontStyles(md) {
    const regexFontStyles = /(\*{1,3})(.*)(\1)/;
    while (regexFontStyles.exec(md) !== null) {
        let fontStyles = regexFontStyles.exec(md);
        let tagOpen, tagClose;
        if (fontStyles[1] === '*') {
            [tagOpen, tagClose] = ['<em style="font-style="italic">', '</em>'];
        } else if (fontStyles[1] === '**') {
            [tagOpen, tagClose] = ['<strong>', '</strong>'];
        } else {
            [tagOpen, tagClose] = ['<strong style="font-style="italic">', '</strong>']
        }
        md = md.replace(fontStyles[0], tagOpen + fontStyles[2] + tagClose);
    }
    return md;
}


function CodeBlock(md) {
    const regexCodeBlock = /(\`{3})(\n?.*)(\1)/;
    while (regexCodeBlock.exec(md) !== null) {
        let blockQuote = regexCodeBlock.exec(md);
        let tagOpen, tagClose;
        if (blockQuote[2].charAt(0) === '\n') {
            [tagOpen, tagClose] = ['<pre style="background-color: cornsilk"><code>',
                '</code></pre>'
            ];
        } else {
            [tagOpen, tagClose] = ['<p><code>', '</code></p>'];
        }
        md = md.replace(blockQuote[0], tagOpen + blockQuote[2] + tagClose);
    }
    return md;
}


const regexUserLists = /((\s*)[\*\-\+]\s[\w\W]*)(\n{2})/m;
const regexSpaces = /(\s*)[\*\-\+]/;
const regexRemoveDots = /\s*[\*\-\+]\s(.*)/;

function Lists(md) {
    while (regexUserLists.exec(md) !== null) {
        const lists = regexUserLists.exec(md);
        md = md.replace(lists[0], StringToBlocks(lists[1]));
    }
    return md;
}

function StringToBlocks(str) {
    const lines = str.split('\n');
    const len = lines.length;
    if (len === 0) {
        return '';
    } else if (len === 1) {
        return '<ul><li>' + regexRemoveDots.exec(lines[0])[1] + '</li></ul>'
    }

    const spaceLens = lines.map(line => regexSpaces.exec(line)[1].length);
    const lenOfFirstLine = spaceLens[0];
    const blocks = [];
    let begin = 0;
    for (let i = 1; i < spaceLens.length; i++) {
        let len = spaceLens[i];
        if (len === lenOfFirstLine) {
            blocks.push(lines.slice(begin, i).join('\n'));
            begin = i;
        }
    }
    if (blocks.length === 0) {
        blocks.push(lines.join('\n'));
    }

    return '<ul>' + BlocksToHTML(blocks) + '</ul>';
}

function BlocksToHTML(blocks) {
    if (blocks.length === 1) {
        const end = blocks[0].indexOf('\n');
        let begin = 0;
        while (true) {
            const ch = blocks[0].charAt(begin);
            if (ch === '-' || ch === '*' || ch === '+') {
                const firstLine = blocks[0].slice(begin + 1, end);
                return firstLine + '<li>' + StringToBlocks(blocks[0].slice(end + 1)) + '</li>';
            }
            begin++;
        }
    }
    return blocks.map(block => '<li>' + StringToBlocks(block) + '</li>').join('');
}



// Test Data
Heads('###jsdfb\n#jshfk\n\n#####jsbf');
URL('[bee](http://www.hhh.com)\n\n[szubee](http://www.hhhhh.com)');
Image('![bee](http://www.hhh.com)\n\n![szubee](http://www.hhhhh.com)');
FontStyles('**hhhhh**');
CodeBlock('```\nconst hhh = \'oshfoksdknfjhsdi\' function hhh(md) {return md;}```');
Lists('- abc\n  - defg\n    - hijkl\n  - mnopqr\n\n');