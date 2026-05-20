
# Tool index

## 1 Introduction

### 1.1 Purpose

The idea of the tool at hand is to help finding information in a directory tree.
On windows systems this is called an index: you can search for files by giving
a text string. The index tool from Windows looks for files, where the search string
appears in the filename or its contents.

The index tool offered here is similar, but the search uses a different approach.
The search is based on mapping search strings to selected subdirectories.
For each subdirectory to be marked for the search, you write a text file named `index.txt`,
which contains a list of strings (separated by newline and the comma character ',').
The search scans through a given directory tree and collects all `index.txt` files
and stores the found search strings and visited directories into a JSON file `index.json`.
The JSON file contains an m:n relation between relative paths and search strings.

This JSON file can be used by the tool to search for directories by giving a list
of search strings. The search result is an HTML file `index.html`, which contains the paths to
the found subdirectories. A found subdirectory can be accessed in two ways:
1. Click on an anchor element opens the directory in the web browser.
2. Click on the 'Copy to clipboard' button copies the full path to the clipboard,
  so that the path can be used in a file browser.

Two options are offered for string comparison:  
--case: comparison is performed case sensitive;  
--partial: comparison is is successful on substrings.

For the generation of the `index.html`, the tool uses the template file `index_template.html`,
which has to placed in the same directory as `index.ts`.

The tool can used on both Windows and Unix systems without generating the JSON file
again (because we use a special separator for path components).
Also the produced HTML file can used on both operating systems: Windows and Linux.

### 1.2 Technology
The tool is written in TypeScript.

### 1.3 Commands

The tool offers the following commandline options:

```shell
index --scan <path>      
   # Scan directory with given root <path>.
   # Found strings are added to the JSON file `index.json`.
   # If the JSON file does not exist, it is created.

index --search <strings> [--case] [--partial]
   # Search for directories and return each directory, which is marked by each given string.
   # <strings> are separated by the comma character ','.
   # The found paths are written to an HTML file 'index.html',
   # which contains a table with full hyperlinks to the directories.
   # Per default the comparison is performed not case sensitive. 
   # By giving the option `--case` it is performed case sensitive.
   # Per default a search has to match a whole string found in an `index.txt` file.
   # By giving the option `--partial` a partial match is performed.
   # The command line options are read from left to right. This means, that
   # a given option applies only to the remaining options on the right
   # of the option.

index --clear
   # Clear the contents of the JSON file `index.json`.
   # If the JSON file does not exist, it is created.

index --help
   # Give help and show this text.
```

## 2 Source files
The tool consists of the following files:

```shell
index.ts # Typescript source code of the tool. 
index_template.html # HTML file with template for the generation of the 'index.html'.
```

## 3 Installation
The tool requires the run-time environment `bun` for TypeScript.

Because the tool only uses the fs package, it can be compiled with the following command:

```shell
bun build index.ts --compile
```

Unfortunately the binary is about 100 MB big, whereas the bun environment is only 30 MB big.
