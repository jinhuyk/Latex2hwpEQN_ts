// LaTeX 변환기 함수 모음 (TypeScript 버전)

function convFrac(text: string): string {
    const pattern = /\\frac\{(.*?)\}\{(.*?)\}/g;
    return text.replace(pattern, (_, numerator, denominator) => {
        return `{${numerator}}over{${denominator}}`;
    });
}

function convRm(text: string): string {
    const pattern = /\\mathrm\{(.*?)\}/g;
    return text.replace(pattern, (_, content) => `rm{${content}}it`);
}

function convTxt(text: string): string {
    const pattern = /\\text\s?\{(.*?)\}/g;
    return text.replace(pattern, (_, content) => `${content}`);
}

function convUpperSub(text: string): string {
    text = text.replace(/_(\W|\w)/g, (_, char) => `_${char} `);
    text = text.replace(/\^(\W|\w)/g, (_, char) => `^${char} `);
    return text;
}

function convCases(text: string): string {
    return text.replace(/\\begin{cases}([\s\S]*?)\\end{cases}/g, (_, body) => `cases{${body}}`);
}

function convCases2(text: string): string {
    const pattern = /\\left\\\{\\begin{array}{(.*?)}(.*?)\\end{array}/g;
    return text.replace(pattern, (_, _arrtype, content) => `cases{ ${content} }`);
}

function convRoot(text: string): string {
    return text.replace(/\\sqrt\[(.*?)\]\{(.*?)\}/g, (_, root, inside) => `root{${root}}of{${inside}`);
}
function convSpace(text: string): string {
    text = text.replace(/\\,/g, '`');
    text = text.replace(/\\quad/g, '~');
    text = text.replace(/\\\\/g, '#');
    return text;
}

function convOper(text: string): string {
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

function convDeco(text: string): string {
    return text.replace(/bar\{(.*?)\}/g, (_, content) => `{bar{${content}}}`);
}

function convSupr(text: string): string {
    let rst = text;
    rst = rst.replace(/\\overline\{/g, "bar{");
    rst = rst.replace(/\\overrightarrow\{/g, "vec{");
    rst = rst.replace(/\\mid/g, "vert");
    rst = rst.replace(/\\\{/g, "left{");
    rst = rst.replace(/\\\}/g, "right}");
    rst = rst.replace(/\{/g, "{`");
    return rst;
}


function convTex2HwpEq(text: string): string {
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




class HtmlHandler{
    public TextChangeHandler(id : string, output : string) : void{

        let markdown = <HTMLTextAreaElement>document.getElementById(id);
        let markdownOutput = <HTMLLabelElement>document.getElementById(output);
        if(markdown !== null){
            markdown.onkeyup = (e) =>{
                if(markdown.value){
                    const lines = markdown.value.split("\n");
                    const transformed = lines.map(line => convTex2HwpEq(line)).join("<br>");
                    markdownOutput.innerHTML = transformed;
                }
                else 
                markdownOutput.innerHTML = "<p></p>";
            }
        }
    }
}
