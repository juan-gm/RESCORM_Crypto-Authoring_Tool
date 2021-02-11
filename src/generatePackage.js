import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';

export const generatePackage  = (state) => {
    JSZipUtils.getBinaryContent((process.env.PUBLIC_URL || ".") + (state.scormVersion === "2004" ? "/scorm2004.zip":"/scorm12.zip"), function(err, data) {
        if (err) {
            throw err; // or handle err
        }
        JSZip.loadAsync(data).then(function(zip) {
        	let indexContent = generateIndex(state)
			zip.file('index.html', indexContent);
            
			zip.generateAsync({ type: "blob" }).then(function(blob) {
                FileSaver.saveAs(blob, state.title.toLowerCase().replace(/\s/g, '') + Math.round(+new Date() / 1000) + (state.scormVersion === "2004" ? "_2004" : "_1.2") + ".zip");
            });
        }) 
    });
 

}
function decode(input) {
    return decodeURIComponent(window.atob(input.slice(21)).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''))
}

function generateIndex(state) {
    const {title, showUsername, timeout, tip, CombinationLockImage, mode, theme, good, bad, answer, escapp, puzzleId, escapeRoomId, puzzleLength, scormVersion, nonMetallic, PUBLIC_URL} = state;
    const parsedState = JSON.stringify({title, showUsername, timeout, tip, CombinationLockImage, mode, theme, good, bad, answer, escapp, puzzleId, escapeRoomId, puzzleLength, scormVersion, nonMetallic, PUBLIC_URL: "http://localhost:3000" + PUBLIC_URL});
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title || "Digital Lock"}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
 </head>
<body>
<div id="root"></div>
<script> window.config=JSON.parse('${parsedState}');</script>
<script type="text/javascript" src="bundle.js"></script>
</body>
</html>`;
}