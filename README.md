# server.elscione.com_novels_books_cloner
simple nodejs [ server.elscione.com ] books cloner or automated downloading


-> website content copier. copies books/novels in folder : https://server.elscione.com/LNWNCentral%20Dump/<br>
-> if you want to copy everything, serach, find and replace above link on index.js with : https://server.elscione.com/<br>
-> running multiple times will ignore/skip already loaded or copied contents available in [./downloads ] folder, matching those on website [  https://server.elscione.com/ ], but program only checks file name match not file metada[file:size/created/modified/etc ], so if file is updated so long it still have same name as local, it will be ignore instead of re-downloaded, just delete [ download folder ] in this program to redownload everything or delete specific files or folders within download/books/<br><br>

<br>
-- Features<br>
-> inteactive console (webFig no longer necessary)<br>
-> View process logs<br>
-> Resume download<br>
-> Auto update downloads (new files only)<br>

<br>
-- Limitations<br>
-> Files with long names wont download (windows or windows puppeteer problem, maybe it may work beteer on linux.  -\_('-')_/-  );<br>
-> Folders/directories that contains period/fullstop (.)  in their names wont download (This is site limitation to disable direct file downloading, this limitation can be solved easily programmically, but there are few of directories names with such issue) latest report will contain files that failed to download on latest run, so you can manual download.<br>

---------
-- to run script<br><br>
1) npm install --global yarn<br>
2) yarn install : npm not working for some of required dependencies<br>
3) node index<br>
<br>
-----<br>
to do maybe<br>
-> add simple operation stats or report<br>
-> add html frnt control maybe probably wont right now<br>

<br>-- tip, if you have issue reclone this repository or maybe <br>
mail : petrusnk@ gmail .com //responding not guranteed or promised
