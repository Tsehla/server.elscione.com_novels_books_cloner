
-> website content copier. copies books/novels in folder : https://server.elscione.com/LNWNCentral%20Dump/
-> if you want to copy everything, serach, find and replace above link on index.js with : https://server.elscione.com/
-> running multiple times will ignore/skip already loaded or copied contents available in [./downloads ] folder, matching those on website [  https://server.elscione.com/ ], but program only checks file name match not file metada[file:size/created/modified/etc ], so if file is updated so long it still have same name as local, it will be ignore instead of re-downloaded, just delete [ download folder ] in this program to redownload everything or delete specific files or folders within download/books/

-- to run script

1) npm install --global yarn
2) yarn install : npm not working for some of required dependencies
3) node index

-----
to do maybe
-> add simple operation stats or report
-> add html frnt control maybe probably wont right now