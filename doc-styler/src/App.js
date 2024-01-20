import { useState } from "react";

function App() {
    const [currentText, setCurrentText] = useState("Welcome\n\nReplace this text to start generating your documentation...");
    const [buttonText, setButtonText] = useState("Copy Documentation");

    return (
        <main className="flex flex-col items-center m-4 text-sm items-center">
            <h1 className="my-4 text-2xl font-bold">
                DocStyler
            </h1>
            <textarea
                className="border-2 rounded font-mono w-full max-w-[80%] mb-4 p-2 min-h-40"
                placeholder="Start typing..."
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
            >
            </textarea>
            <textarea
                className="border-2 rounded font-mono w-full max-w-[80%] mb-4 p-2 min-h-40"
                placeholder="Result"
                value={transformDocumentation(currentText, 80, 2)}
                disabled={true}
            >
            </textarea>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-44"
                onClick={
                    () => {
                        const getFormattedText = transformDocumentation(currentText, 80, 2);
                        console.log(getFormattedText);


                        navigator.clipboard.writeText(getFormattedText);
                        setButtonText("Copied!");
                        setTimeout(
                            () => {
                                setButtonText("Copy Documentation");
                            }, 2500
                        );
                    }
                }
            >
                {buttonText}
            </button>
        </main>
    );
}

// *****************************************************************************
// *                                  Welcome                                  *
// *                                                                           *
// *        Replace this text to start generating your documentation...        *
// *****************************************************************************
const transformDocumentation = (input, maxWidth, padding) => {
    let comment = "// ";
    let border = "-";

    let output = "";
    let lines = input.split("\n").map(s => s.trim());
    // console.log(lines)


    // *****************************************************************************
    // *                             Create Top Border                             *
    // *****************************************************************************
    let remainingWidth = maxWidth;

    output += comment; // Add the comment
    remainingWidth -= comment.length;

    while (remainingWidth > 0) {
        output += border;
        remainingWidth -= border.length;
    }

    output += "\n";


    // *****************************************************************************
    // *                            Preprocess Each Line                           *
    // *                                                                           *
    // *   This section will ensure that each line in the input is capped to the   *
    // *                          maximum available space.                         *
    // *    If there are longer lines, they are cut continuously by the maximum    *
    // *                       available space until they fit.                     *
    // *                         Full words are preserved.                         *
    // *****************************************************************************
    let maxTextWidth = maxWidth - comment.length - (border.length * 2) - (padding * 2);
    let preprocessedLines = [];
    for (let i = 0; i < lines.length; i += 1) {
        let line = lines[i];
        if (line.length <= maxTextWidth) {
            preprocessedLines.push(line);
        } else {
            let tempLine = line;
            while (tempLine.length > maxTextWidth) {
                let cut = maxTextWidth;
                while (tempLine.at(cut) !== " " && cut >= 0) {
                    cut -= 1;
                }

                if (cut < 0) {
                    cut = maxTextWidth;
                }

                let cutLine = tempLine.substring(0, cut);
                preprocessedLines.push(cutLine);

                tempLine = tempLine.substring(cut);
            }

            if (tempLine.length > 0) {
                preprocessedLines.push(tempLine);
            }
        }
    }

    lines = preprocessedLines;


    // *****************************************************************************
    // *                          Create Each Output Line                          *
    // *                                                                           *
    // *   Each line is taken and the maximum allowed text length is calculated.   *
    // *    The final "centered text" is then continuously grown on each side to   *
    // *             contain spaces until the allowed text length is 0.            *
    // *****************************************************************************
    for (let i = 0; i < lines.length; i += 1) {
        let line = lines[i];

        remainingWidth = maxWidth; // Reset remaining width available

        output += comment; // Add the comment, subtract from remaining width
        remainingWidth -= comment.length;

        output += border; // Add the border, subtract from remaining width
        remainingWidth -= border.length;

        // Add first padding
        for (let j = 0; j < padding; j += 1) {
            output += " ";
            remainingWidth -= 1;
        }

        // Need to save room for the remaining padding and the border
        let availableTextWidth = remainingWidth - padding - border.length - line.length;

        // Generate the spaces + text to place down
        let outputLine = line;
        while (availableTextWidth > 0) {
            outputLine = " " + outputLine + " ";
            availableTextWidth -= 2;
        }

        output += outputLine;
        if (line.length % 2 === 0) {
            output = output.substring(0, output.length - 1);
        }


        // Add second padding
        for (let j = 0; j < padding; j += 1) {
            output += " ";
        }

        // Add border
        output += border;

        output += "\n"
    }

    // *****************************************************************************
    // *                             Create Bottom Border                          *
    // *****************************************************************************
    remainingWidth = maxWidth;

    output += comment; // Add the comment
    remainingWidth -= comment.length;

    while (remainingWidth > 0) {
        output += border;
        remainingWidth -= border.length;
    }

    // console.log(output)
    return output;
};

export default App;
