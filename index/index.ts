import * as fs from "fs";

// File names:
const indexFileName: string = 'index.txt';
const JSONfileName: string = 'index.json';
const HTMLtemplateFileName: string = 'index_template.html';
const HTMLfileName: string = 'index.html';

const encoding: BufferEncoding = 'utf8';

const helpText: string = `
index --scan <path>   
   # Scan directory with given root <path>.
   # Found strings are added to the JSON file ${JSONfileName}.
   # If the JSON file does not exist, it is created.

index --search <strings> [--case] [--partial]
   # Search for directories and return each directory, which is marked by each given string.
   # <strings> are separated by the comma character ','.
   # The found paths are written to an HTML file ${HTMLfileName}.
   # which contains a table with full hyperlinks to the directories.
   # Per default the comparison is performed not case sensitive. 
   # By giving the option "--case" it is performed case sensitive.
   # Per default a search has to match a whole string found in an ${indexFileName}.
   # By giving the option "--partial" a partial match is performed.
   # The command line options are read from left to right. This means, that
   # a given option applies only to the remaining options on the right
   # of the option.

index --clear
   # Clear the contents of the JSON file ${JSONfileName}.
   # If the JSON file does not exist, it is created.

index --help
   # Give help and show this text.
`;


// Colouring output strings on console:
const green: string = '\x1b[32m%s\x1b[0m';
const yellow: string = '\x1b[33m%s\x1b[0m';
const red: string = '\x1b[31m%s\x1b[0m'

function showError( m: string){
    console.log( red, `${m}. Use --help for getting help.`);
    process.exit(0);
}

function showWarning( m: string){
    console.log( yellow, m);
}

// Options
let caseSensitive: boolean = false;
let partialMatch: boolean = false;


// Work with strings and string arrays

const nl: string = '\n';

function compareStrings( s: string, t: string): boolean{
    const s2: string = caseSensitive ? s : s.toLowerCase();
    const t2: string = caseSensitive ? t : t.toLowerCase();
    return(
        partialMatch ?
            t2.includes( s2) :
            t2 == s2)
};

function indicesOfStr( s: string, l: string[]): number[]{
    let il: number[] = [];
    const lp: number = lastPos( l);
    for( let i = firstPos; i <= lp; i++){
        if( compareStrings( s, l[i]!)){
            il.push( i)
        }
    }
    return il;
}

function indexOfStr( s: string, l: string[]): number{
    return(
        l.findIndex( (i) => i == s))
};

const notFound: number = -1;

const firstPos: number = 0;

function lastPos( l: string[]): number{
    return(
        l.length - 1
    )
}

function intersection( sl1: string[], sl2: string[]): string[]{
    return(
        sl1.filter(
            (s:string) => sl2.includes(s)))};


// File system
function onWindows(): boolean{
    const platform = process.platform;
    return(
        platform === "win32" // even on a 64-bit machine.
    )
};
const onWin: boolean = onWindows();

const unixSep: string = '/';
const windowsSep: string = '\\';
const neutralSep: string = '|';

const sep:string =
    ( onWin ? windowsSep :unixSep);

function checkDir( d:string){
    if( ! fs.existsSync( d) ){
        showError( "Directory not found: " + d);
    };
    if( ! fs.statSync( d).isDirectory()){
        showError("Not a directory: " + d);
    }
}

function getSubdirectories(dir:string):string[] {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

let rootFile: string = process.cwd();

function fullPath( rp: string): string{
    return(
        rootFile + sep + rp
    )
} 

function neutralizeSep( p: string){
    return(
        p.replace( sep, neutralSep)
    )
}


// Type definition for index.json:

type Item = { // m:n relation between path and keyword.
    path: number,
    keyword: number
};

type Index = {
    paths: string[]; // System specific file separator (e.g. '/' on Windows) is
                     // substituted by a neutral one: '|'.
    keywords: string[];
    items: Item[]
}

const keywordSep: string = ',';

const emptyIndex: Index = {
    paths: [],
    keywords: [],
    items: []
}

let currentIndex: Index = emptyIndex;

function addItem( rp: string, k: string){
    const nrp: string = neutralizeSep( rp);
    let rpi: number = indexOfStr( nrp, currentIndex.paths);
    if( rpi == notFound){
        currentIndex.paths.push( neutralizeSep( nrp));
        rpi = lastPos( currentIndex.paths);
    }

    let ki: number = indexOfStr( k, currentIndex.keywords);
    if( ki == notFound){
        currentIndex.keywords.push( k);
        ki = lastPos( currentIndex.keywords);
    }

    if( notFound == currentIndex.items.findIndex(
            (i:Item) => (i.keyword == ki) && (i.path == rpi))){
        currentIndex.items.push( {
            keyword: ki, path: rpi})
    }
};

function getPaths( k: string): string[] | undefined{
    const il: number[] = indicesOfStr( k, currentIndex.keywords);  
    if( il.length == 0){
        showWarning( "Unknown keyword: " + k + ". Ignored.");
        return( undefined);
    };
    let pl: string[] = [];
    currentIndex.items.forEach(
        (it:Item) => {
            if( notFound != il.findIndex( (i:number) => ( i == it.keyword))){
                const p: string | undefined = currentIndex.paths[ it.path];
                if( !p){
                    showError( "Path index: out of range.");
                }else{
                    if( notFound == pl.findIndex( (q:string) => q == p)){
                        pl.push( p)}}}});
    return( pl);
}


// JSON file with index
function clearJSONfile(){
    if( fs.existsSync( JSONfileName)){
        console.log( "Deleting content of JSON file.");        
    }else{
        console.log( "Creating JSON file.");
    };
    try {        
        fs.writeFileSync( JSONfileName, JSON.stringify( emptyIndex));
    } catch (error: any) {
        showError( "Writing to JSON file: " + error.message);
    }
}

function loadJSONfile(): Index{
    if( fs.existsSync( JSONfileName)){
        const { paths, keywords, items}: Index =
            JSON.parse( fs.readFileSync( JSONfileName, encoding));
        return(
            { paths, keywords, items}
        )
    }else{
        return(
            emptyIndex
        )
    }
}

function saveJSONfile( i:Index){
    try {
        fs.writeFileSync( JSONfileName, JSON.stringify( i));
    } catch (error: any) {
        showError( "Writing to JSON file: " + error.message);        
    }
}


// Index file
function readIndexFile( p: string):string[]{
    try {
        const content: string = fs.readFileSync( p, encoding);
        const words:string[] =
            content
                .split( nl)
                .filter(
                    (l) => l.length != 0) // remove empty lines
                .map(
                    (l) => l.split( keywordSep))
                .flat()
                .map(
                    (w) => w.trim())
                .filter(
                    (l) => l.length != 0);        
        return words;        
    } catch (error: any) {
        showError( "Reading index file: " + error.message);  
        return [];
    }
}

function collectIndexFiles( rp: string){
    const indexFile: string = fullPath( rp + sep + indexFileName);
    if( fs.existsSync( indexFile)){
        console.log( "   " + rp + sep + indexFileName);        
        const words:string[] = readIndexFile( indexFile);
        words.forEach(
            (w) => addItem( rp, w))
    };
    const subdirs:string[] = getSubdirectories( fullPath( rp));
    subdirs.forEach(
        (n:string) => collectIndexFiles( rp + sep + n))
}

function scanDir( rp: string | undefined){
    if( ! rp){
        showError( "Command 'scan': argument missing");
        return;
    };
    checkDir( fullPath( rp));
    console.log( "Collecting index files in directory " + rp);
    currentIndex = loadJSONfile();
    collectIndexFiles( rp);
    saveJSONfile( currentIndex);
}

const keywords: string = '{{keywords}}';
const paths: string = '{{paths}}';

function writeHTMLfile( kl: string[], pl: string[]){
    let HTML: string = '';
    try {
        HTML = fs.readFileSync( HTMLtemplateFileName, encoding);
    } catch (error: any) {
        showError( "Reading template HTML file: " + error.message);  
    }

    const HTML2: string = HTML.replace( keywords, kl.join( keywordSep));
    const HTML3: string = HTML2.replace( paths, JSON.stringify( pl));
    try {
        fs.writeFileSync( HTMLfileName, HTML3);
    } catch (error: any) {
        showError( "Writing HTML file: " + error.message);  
    }
}

function searchPaths( kl: string[]): string[]{
    currentIndex = loadJSONfile();
    let pl: string[] = [];
    let first: boolean = true;
    kl.forEach(
        (k:string) => {
            const plk: string[] | undefined = getPaths( k);
            if( !plk){
                // skip unknown keyword
            }else{
                if( first){
                    pl = plk;
                    first = false;
                }else{
                    pl = intersection( pl, plk)}}}
    );
    return pl;
}

function searchDir( sl: string | undefined){
    if( ! sl){
        showError( "Command 'search': argument missing");
        return;
    };
    const kl: string[] = sl
            .split( keywordSep)
            .map(
                (w) => w.trim())
            .filter(
                (l) => l.length != 0);
    if( kl.length == 0){
        showError( "search: no non-empty keyword given");
        return;
    };    
    const pl: string[] = searchPaths( kl);
    if( pl.length == 0){
        showError( "search: no paths found");
        return;
    };
    console.log( "  " + (pl.length) + " paths found.");
    writeHTMLfile( kl, pl);
}

function application( args: string[]){
    const firstArg: number = 2;
    if( args.length == firstArg){
        showError( "No arguments given");
    };
    const lastArg: number = args.length - 1;
    for( let i = firstArg; i <= lastArg; i++){
        switch (args[i]) {
            case "--help":
                console.log( helpText);
                break;
            case "--clear":
                clearJSONfile();
                break;
            case "--scan":
                scanDir( args[ ++i]);
                break;
            case "--case":
                caseSensitive = true;
                console.log( "Turn on case sensitive comparison.");                
                break;
            case "--partial":
                partialMatch = true;
                console.log( "Turn on partial match.");                
                break;
            case "--search":
                searchDir( args[ ++i]);
                break;
            default:
                showError( "Unknown option: " + args[i]);
        }
    }
    console.log( green, " *** finished");
}

application( process.argv);

