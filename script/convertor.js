"use strict";
// LaTeX 변환기 함수 모음 (TypeScript 버전)
function convFrac(text) {
    const pattern = /\\frac\{(.*?)\}\{(.*?)\}/g;
    return text.replace(pattern, (_, numerator, denominator) => {
        return `{${numerator}}over{${denominator}}`;
    });
}
function convRm(text) {
    const pattern = /\\mathrm\{(.*?)\}/g;
    return text.replace(pattern, (_, content) => `rm{${content}}it`);
}
function convTxt(text) {
    const pattern = /\\text\s?\{(.*?)\}/g;
    return text.replace(pattern, (_, content) => `${content}`);
}
function convUpperSub(text) {
    text = text.replace(/_(\W|\w)/g, (_, char) => `_${char} `);
    text = text.replace(/\^(\W|\w)/g, (_, char) => `^${char} `);
    return text;
}
function convCases(text) {
    return text.replace(/\\begin{cases}([\s\S]*?)\\end{cases}/g, (_, body) => `cases{${body}}`);
}
function convCases2(text) {
    const pattern = /\\left\\\{\\begin{array}{(.*?)}(.*?)\\end{array}/g;
    return text.replace(pattern, (_, _arrtype, content) => `cases{ ${content} }`);
}
function convRoot(text) {
    return text.replace(/\\sqrt\[(.*?)\]\{(.*?)\}/g, (_, root, inside) => `root{${root}}of{${inside}`);
}
function convSpace(text) {
    text = text.replace(/\\,/g, '`');
    text = text.replace(/\\quad/g, '~');
    text = text.replace(/\\\\/g, '#');
    return text;
}
function convOper(text) {
    let rst = text;
    rst = rst.replace(/\+/g, " +");
    rst = rst.replace(/</g, " < ");
    rst = rst.replace(/-/g, " -");
    rst = rst.replace(/=/g, " =");
    rst = rst.replace(/ to /g, " -> ");
    rst = rst.replace(/Leftrightarrow/g, "LRARROW");
    rst = rst.replace(/pm/g, " +- ");
    return rst;
}
function convDeco(text) {
    let rst = text;
    rst = rst.replace(/leftleft/g,"left");
    rst = rst.replace(/left left/g,"left");
    rst = rst.replace(/right right/g,"right");
    rst = rst.replace(/rightright/g,"right");
    rst.replace(/bar\{(.*?)\}/g, (_, content) => `{bar{${content}}}`);
    return rst;
}
function convSupr(text) {
    let rst = text;
    rst = rst.replace(/\\overline\{/g, "bar{");
    rst = rst.replace(/\\overrightarrow\{/g, "vec{");
    rst = rst.replace(/\\mid/g, "vert");
    rst = rst.replace(/\\\{/g, " left{");
    rst = rst.replace(/\\\}/g, " right}");
    rst = rst.replace(/\{/g, "{`");
    return rst;
}
function convTex2HwpEq(text) {
    let rst = text;
    rst = rst.replace(/\$\$/g, '\n');
    rst = rst.replace(/\$\n/g, '#');
    rst = convTxt(rst);
    rst = convCases(rst);
    rst = convCases2(rst);
    rst = convOper(rst);
    rst = convSupr(rst);
    for (let i = 0; i < 10; i++) {
        rst = convFrac(rst);
    }
    rst = convRm(rst);
    rst = convRoot(rst);
    rst = convUpperSub(rst);
    rst = convSpace(rst);
    rst = rst.replace(/\\/g, ' ');
    rst = rst.replace(/\$/g, '');
    rst = convDeco(rst);
    return rst;
}
class HtmlHandler {
    TextChangeHandler(id, output) {
        let markdown = document.getElementById(id);
        let markdownOutput = document.getElementById(output);
        if (markdown !== null) {
            markdown.onkeyup = (e) => {
                if (markdown.value) {
                    const lines = markdown.value.split("\n");
                    const transformed = lines.map(line => convTex2HwpEq(line)).join("<br>");
                    markdownOutput.innerHTML = transformed;
                }
                else
                    markdownOutput.innerHTML = "<p></p>";
            };
        }
    }
}
//# sourceMappingURL=convertor.js.map
