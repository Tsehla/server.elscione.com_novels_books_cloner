const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('node:path');

const app = express();
const PORT = 3000;

// Set up a route to fetch and extract links
app.get('/getLinks', async (req, res) => {


// var links = [ //dorect download of files prohbited, but not linking diirectly to final directory holding downloadable contents 

//   { 
//     directory:'',//folder 1/
//     link_structure : '',//selver/folder 1/folder 2/
//     is_file : false,
//     downloaded : false,
//     links : [

//       { 
//         directory:'',
//         is_file : false,
//         downloaded : false,
//         links : []
//       }


//     ]

//   }
// ]



  pupeteer('https://server.elscione.com/LNWNCentral%20Dump/', res);//call

});







// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');

const UserPreferencesPlugin = require("puppeteer-extra-plugin-user-preferences");

const { Console } = require('console');

//LINKS PROBLEM, SOME SUBLINKS FROM MAIN LINKS CHILD LINKS ARE NOT LOOPED OR CONTAINED LINKS RETURNED.
//OPTION TWO, GET ONLY LINKS WHITHIN A DIV FROM BROWSER RATHER THAN ALL LINKS IN A WEBPAGE, THIS WILL MAKE CODE SIMPLER

//start
async function pupeteer(url, res){

var stats_data = {
  total_found_online_files : 0,
  total_files_found_available_offline_matching_those_found_online : 0,
  total_new_files_downloaded : 0,
  total_files_could_not_download : 0,
  files_could_not_download_links : [],
}
  // const url = 'https://server.elscione.com/LNWNCentral%20Dump/';

  try {

    // Launch a headless browser
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    // Set the viewport for better rendering (optional)
    await page.setViewport({ width: 1280, height: 800 }); 

    //remove navigation timeout
    await page.setDefaultNavigationTimeout(0); 

    // Navigate to the URL and wait for network idle before extracting links
    await page.goto(url, { waitUntil: 'networkidle2' });

    // await page.$("#items")
    await page.waitForSelector( "#mainrow", { visible: true,timeout:0 } );
    await page.waitForSelector( "#content", { visible: true,timeout:0 } );
    await page.waitForSelector( "#view", { visible: true ,timeout:0 } );
    await page.waitForSelector( "#items", { visible: true ,timeout:0 } );

    await page.waitForTimeout(12000);//wait longer the better


    // var main_folder_links = await page.evaluate(() => {
    //   const linkElements = document.querySelectorAll('a');
    //   return Array.from(linkElements).map(link => ({
    //     href: link.href.replace('https://server.elscione.com/',''), //remover server addres so we can catch file extension using (.) later
    //     text: link.innerText.trim(),
    //   }));
    // });


    var main_folder_links = await page.evaluate(() => {

      //get all with class  [ item folder ]
      const linkElements = document.querySelectorAll('li.item.folder'); //node list

      //-- save links
      //link container
      var links =[];
      //loop
      linkElements.forEach(node=>{


        //check class does not contain navigation links class marker
        if(node.className.search('folder-parent') == -1){//if so

          //save links
          links.push({
            href: node.getElementsByTagName('a')[0].href,//link href
            text: node.getElementsByTagName('a')[0].innerText,//link text
            procesed : false,
          });

        }

      })


      return links;
      // return Array.from(linkElements).map(link => ({
      //   href: link.href.replace('https://server.elscione.com/',''), //remover server addres so we can catch file extension using (.) later
      //   text: link.innerText.trim(),
      // }));

    });
    
    // return console.log(main_folder_links[0])


    //clean of mpty links
    // if(main_folder_links && main_folder_links.length > 0){

    //   //loop links
    //   main_folder_links.forEach((link, index)=>{

    //     //if link is empty
    //     if(!link.href.trim()){

    //       console.log('-- empty ', link.href)
    //       //delete array item
    //       main_folder_links.splice(index,1);
    //     }

    //   })


    // }


    main_folder_links = main_folder_links.splice(0,1); // ------------   FOR TESTING RETURN ONLY TWELF ITEMS OR LINKSs  --- keep disabled if not testing or developing -------------
    
    // console.log(main_folder_links[7],main_folder_links[8],main_folder_links[9], main_folder_links.length);

    // console.log(main_folder_links, main_folder_links.length)

    // return 

    if(!main_folder_links || main_folder_links.length == 0){

      console.log('this program started befre dom completeletly loded, restarting program');

      browser.close();

      return pupeteer('https://server.elscione.com/LNWNCentral%20Dump/');//restart
    }


    var main_folder_links_tracker = 0;//main folder links tracker or extraction start 

    // var links_cooking = [];//for temp link bulding

    var complete_link = [];//links to files 

    await page.waitForTimeout(9000); //wait for dom to build/load

    controller(main_folder_links); //call


    async function goto_navigator(url){

      // console.log('-- navigator url : ', url)

      // const browser = await puppeteer.launch({headless:false});

      // const page = await browser.newPage();
  
      // Set the viewport for better rendering (optional)
      // await page.setViewport({ width: 1280, height: 800 });
  
      //remove navigation timeout

      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // await page.$("#mainrow");
      // await page.$("#content");
      // await page.$("#view");
      // await page.$("#items");
      // await page.$(".square");
      // await page.$(".landscape");

      await page.waitForSelector( "#mainrow", { visible: true,timeout:0 } );
      await page.waitForSelector( "#content", { visible: true,timeout:0 } );
      await page.waitForSelector( "#view", { visible: true ,timeout:0 } );
      await page.waitForSelector( "#items", { visible: true ,timeout:0 } );
      // await page.waitForSelector( ".square", { visible: true } );
      // await page.waitForSelector( ".icons", { visible: true } );
      // await page.waitForSelector( ".landscape", { visible: true } );
      // await page.$(".landscape");

      await page.waitForTimeout(12000); //wait body loads slow, the longer time wait the better

      var result = await page.evaluate(() => {

        
        // const linkElements = document.querySelectorAll('a');

        // console.log(linkElements)
        // return Array.from(linkElements).map(link => ({
        //   href: link.href.replace('https://server.elscione.com/',''), //remover server addres so we can catch file extension using (.) later,
        //   text: link.innerText.trim(),
        //   procesed : false 
        // }));


        //get all with class  [ item folder ]
        const linkElements = document.querySelectorAll('li.item.folder, li.item.file'); //node list//

        //-- save links
        //link container
        var links =[];
        //loop
        linkElements.forEach(node=>{


          //check class does not contain navigation links class marker
          if(node.className.search('folder-parent') == -1){//if so

            //save links
            links.push({
              href: node.getElementsByTagName('a')[0].href,//link href
              text: node.getElementsByTagName('a')[0].innerText,//link text
              procesed : false,
            });

          }

        });

        return links;

      });



      //call navigation controller

      // console.log('results -- url : '+ url, result)

      controller (result) ;//--- PROBLEM GETS CALLED TOO EARLY, WHEN NETWOTRK SLOW

      // await browser.close()
    }


    // var main_folder_links = links; //contains folder links of folder of book https://server.elscione.com/LNWNCentral%20Dump/
    // var main_folder_links_tracker = 7;

    // var links_cooking = [

    //   // {     
    //   //   href: '',
    //   //   text: '', 
    //   //   procesed : false 
    //   // }

    // ];//for temp link bulding

    // var complete_link = [];//links to files 


    function controller(sub_links=[]){ 


      // console.log(sub_links)

      // on start //may have to handle folder with no files here also
      // if(sub_links.length == 0){

      //   console.log('--1 -- no links : from results',main_folder_links_tracker ,main_folder_links.length);


      //   if(main_folder_links_tracker + 1 <= main_folder_links.length){

          
      //     // console.log('no links : from results',main_folder_links[main_folder_links_tracker], main_folder_links_tracker , main_folder_links.length);

      //     // //if url is empty
      //     // if(!main_folder_links[main_folder_links_tracker].href.trim()){

      //     //   main_folder_links_tracker = main_folder_links_tracker + 1;//increment

      //     //   return controller();//call
      //     // }

      //     // goto_navigator(main_folder_links[main_folder_links_tracker].href);//send url

          
      //     // return main_folder_links_tracker = main_folder_links_tracker + 1;//increment


          
      //     //if url is not empty
      //     if(main_folder_links[main_folder_links_tracker].href.trim()){

      //       //call navigator
      //       console.log('--1-- main links navigating : ',main_folder_links[main_folder_links_tracker].href),' , link [ '+main_folder_links_tracker+' of '+ (main_folder_links.length -1 )+' ]' ;

      //       goto_navigator(main_folder_links[main_folder_links_tracker].href);//send url
            
      //       main_folder_links_tracker = main_folder_links_tracker + 1;//increment

      //       return;
      //     }


         

      //     main_folder_links_tracker = main_folder_links_tracker + 1;//increment

      //     //if url empty go to next
      //     controller();//call

      //     return;


      //   }
        
      //   return console.log('processing done : total links = ' + complete_link.length + ' , ' + JSON.stringify(complete_link,1,2));

      // }


      //work with retrived links //add link
      sub_links.forEach((subLink, index)=>{

        // console.log(subLink)
        // if (index < 20){  console.log(index,subLink)}



        // if(index > 7 && subLink.href.trim() && subLink.href.trim().toLowerCase() != 'LNWNCentral%20Dump/'.toLowerCase()){ //anything index 7 and below is navigation links, [ LNWNCentral%20Dump/' ] another navi link but appear only in book folder,
        // if(index > 9 && subLink.href.trim() ){ //anything index 7 and below is navigation links, index 8 [is main folder : folders of books ] index 9 [ is book main folder: contains all of books data ]

        if(subLink.href.trim() ){

          // console.log(index,subLink)

          // if (index < 20){  console.log(index,subLink)}

          // //check if link contains file extension ( . )
          console.log('--complete check ', subLink.href.replace('https://server.elscione.com','').indexOf('.'), subLink.href );

          if(subLink.href.replace('https://server.elscione.com','').indexOf('.') != -1){ //if string position is found during serach

            console.log('complete link',subLink.href );

            complete_link.push(subLink);

          }

          // //add links with extended url to file
          else{

            console.log('new link', subLink.href);

            //check if link
            // if(subLink.href && subLink.href.trim().toLowerCase() != 'LNWNCentral%20Dump/'.toLowerCase()){

              //do
              // if(links_cooking.length < 3){ //limit browse book sub folders from top//for testing or program development

              main_folder_links.push(

                    subLink //save this links
                  )
              // }

            // }

          }


        }

      });


      
      // clear //all processed links
      main_folder_links.forEach((processed_link, index)=>{

        if(processed_link.procesed){
          
          console.log('removing link', processed_link.href);

          // console.log('-- 2 --',links_cooking);

          main_folder_links.splice(index,1); //delete element of that index from array

          // console.log('-- 2 --',links_cooking[index]);

        }

      });


      

      //get none processed links 
      // check if there are no links in links_cooking
      // if(links_cooking.length == 0){

      //   console.log('--2-- no links : after cleaning processed links', main_folder_links_tracker , main_folder_links.length );


        // if(main_folder_links_tracker + 1 <= main_folder_links.length && main_folder_links.length > 0 ){
        if( main_folder_links.length > 0 ){

          // console.log('-- go to ', main_folder_links[main_folder_links_tracker], main_folder_links[main_folder_links_tracker].href)

          //if url is not empty
          if(main_folder_links[main_folder_links_tracker].href.trim()){

            //call navigator
            console.log('--2-- links navigating : ',main_folder_links[main_folder_links_tracker].href,' , link [ '+main_folder_links_tracker+' of '+ (main_folder_links.length -1) +' ]' , 'main_folder_links');

            goto_navigator( main_folder_links[main_folder_links_tracker].href);//send url

            main_folder_links[main_folder_links_tracker].procesed = true;//set processed as true
            
            // main_folder_links_tracker = main_folder_links_tracker + 1;//increment

            return;
          }



          main_folder_links[main_folder_links_tracker].procesed = true;//set processed as true

          // main_folder_links_tracker = main_folder_links_tracker + 1;//increment

          //if url empty go to next
          controller();//call
         

          return;

        }


        console.log('---main links length : ',main_folder_links.length, main_folder_links_tracker);

        // browser.clo/se();//close browser

        console.log('processing done : total links = ' + complete_link.length + ' , ' + JSON.stringify(complete_link,1,2));

        return download_manager();//call download

      // }





      // //call navigator
      // console.log('sub links navigating : ',links_cooking[0].href,' , link [ 1 of '+ (links_cooking.length) +' ]' );

      // goto_navigator(links_cooking[0].href);//call

      // links_cooking[0].procesed = true;//set processed as true





    }; 
    // controller();//auto start



    async function download_manager(){

      if(complete_link.length ==0){
        return console.log('Error there are no download links');
      }

      var date = new Date();

      // fs.access("./downloads/links/'+complete_link[0].href.split('/')[2] +'/'+ date + '.json", function(error) {
      //   if (error) {
      //     console.log("Directory does not exist.")



      //   } else {
      //     console.log("Directory exists.")
      //   }
      // })
      //save new links as logs on txt or json




      // //check for folders exist : links
      // await fs.exists('/downloads/links/', async function (exist) {
      //     if (exist) {
      //         console.log('Directory exists');
      //     }
      //     else {
      //         await fs.mkdirSync('/downloads/links/');
      //         console.log('Directory created');
      //     }
      // })

      // //check for folders exist : books
      // await fs.exists('/downloads/books/', async function (exist) {
      //     if (exist) {
      //       console.log('Directory exists');
      //     }
      //     else {
      //       await fs.mkdirSync('/downloads/books/');
      //       console.log('Directory created');
      //     }
      // })


      const createDirectory = async (directoryName) => {

        // Check if the directory already exists.
        const exists = await fs.existsSync(directoryName);
      
        // If the directory does not exist, create it.
        if (!exists) {
          await fs.mkdirSync(directoryName,  {recursive: true});
        }

      };
      
      await createDirectory('./downloads/books/'+complete_link[0].href.split('/')[2] );

      await createDirectory('./downloads/links/'+complete_link[0].href.split('/')[2] );



      //save file //retrived links as json object file
      var file_name = complete_link[0].href.split('/')[2] +'/'+ date + '.json';

      await fs.writeFile(path.resolve(__dirname,'./downloads/links/'+file_name.replaceAll(/[^A-Za-z0-9.\-_]/gi,'-')), JSON.stringify(complete_link,1,1),  err => {//clean file name of special characters
        if (err) {

          console.error('file save errors :' + path.resolve(__dirname,'./downloads/links/'+ file_name.replaceAll(/[^A-Za-z0-9.\-_]/gi,'-')), err);
        }
        // file written successfully
      });


      
      //capture stats
      stats_data.total_found_online_files = complete_link.length;

      //check if folder structore with file/book to download axist on disk//if so remove link from links array
      complete_link.slice(0).forEach((file, index)=>{


        //decode url to text string, remove server domain and related, clean string of file unfriendly characters
        
        var file_directory_ =  file.href.replace( file.href.split('/')[file.href.split('/').length - 1], '');//remove file name

        //turn to folder address format
        var file_to_folder = decodeURIComponent(file_directory_.replace(file_directory_.split('/')[2], '').replace('https','').replace('http','').replace('://','').replace(/[/]/gi,'\\')).replaceAll(/[^A-Za-z0-9.\-_/\s\\]/gi,'-');

        // console.log(file.href.split('/')[2], '', file_to_folder);


        //check if file exists
        try {

          // console.log('== ', path.resolve(__dirname,'./downloads/books/'+ ('.'+file_to_folder)))

      

          if(fs.existsSync(path.resolve(__dirname,'./downloads/books/'+ file_to_folder +   decodeURIComponent(file.href.split('/')[file.href.split('/').length - 1] ) ))) {
            //file exists

            //remove file from to download links
            console.log('--splice 1-- ', complete_link.length);


            // complete_link.splice(index,1);//delete link\
            // console.log( 'splice ', complete_link.splice(index,1))
            complete_link.splice(
              complete_link.indexOf(file.href),
              1
            );//delete link\






            console.error('file already available locally : '+path.resolve(__dirname,'./downloads/books/'+ file_to_folder +   decodeURIComponent(file.href.split('/')[file.href.split('/').length - 1] ) ))
            console.log('--splice 2-- ', complete_link.length);


            //capture stats
            stats_data.total_files_found_available_offline_matching_those_found_online = stats_data.total_files_found_available_offline_matching_those_found_online + 1;


          }

          
          else{

            //if file not exist
            console.error('error file dont exist locally do download: '+path.resolve(__dirname,'./downloads/books/'+ file_to_folder +   decodeURIComponent(file.href.split('/')[file.href.split('/').length - 1] ) ));

   
          }
        } 
        catch(err) {
          console.error('file exist or not check problem : ',err)
        }

      })



      //download and remove link from download arra
      
      async function file_downloader (file_url) {


        // console.log('-=- ', file_url)

        // //check download path exist or create if not
        const createDirectory = async (directoryName) => {

          // Check if the directory already exists.
          const exists = await fs.existsSync(directoryName);
        
          // If the directory does not exist, create it.
          if (!exists) {
            await fs.mkdirSync(directoryName,  {recursive: true});
          }

        };

        //fuile url
        // var file_url = url + filename_url;//file complete url/direct link

        var file_directory =  file_url.href.replace( file_url.href.split('/')[file_url.href.split('/').length - 1], '');//remove file name

        //file url to folder structure
        var file_folder = decodeURIComponent(file_directory.replace(file_directory.split('/')[2], '').replace('https','').replace('http','').replace('://','').replace(/[/]/gi,'\\')).replaceAll(/[^A-Za-z0-9.\-_/\s\\]/gi,'-'); 
        
        await createDirectory('./downloads/books/'+ file_folder );//call directory create
        

        // const downloadImageDirectoryPath = process.cwd();

        // return console.log(file_folder)

        puppeteer.use(
          
          UserPreferencesPlugin({
            userPrefs: {
              download: {
                prompt_for_download: false,
                open_pdf_in_system_reader: true,
                default_directory: path.resolve(__dirname,'./downloads/books/'+ file_folder),
              },
              plugins: {
                always_open_pdf_externally: true,
              },
            },
          })
        );


        // Create a new Puppeteer browser instance.
        const browser = await puppeteer.launch({headless:false});

        // Create a new page in the browser.
        const page = await browser.newPage();

        // Navigate to the URL of the file to download.
        await page.goto(file_directory);


        // await page._client().send("Page.setDownloadBehavior",{
        //   behavior : "allow",
        //   downloadPath : "./"
        // })

        // await page.$(".landscape");

        await page.waitForSelector( "#mainrow", { visible: true,timeout:0 } );
        await page.waitForSelector( "#content", { visible: true,timeout:0 } );
        await page.waitForSelector( "#view", { visible: true ,timeout:0 } );
        await page.waitForSelector( "#items", { visible: true ,timeout:0 } );


        await page.waitForTimeout(22000); //wait body loads slow, the longer time wait the better

        // Find the download link element.
        // const downloadLink = await page.evaluate((url, filename_url ) => { 
          
        //   console.log('--',url, filename_url )
        //   return document.querySelector('a[href="' + url + filename_url + '"]'); 
        
        // },url, filename_url);

        //find href with that link 
        await page.evaluate((file_url) => {

          //clik anchor
          [...document.querySelectorAll('a')].find(element => element.href === (file_url.href)).click();


        },file_url); //pass argument to evaluate

          // await page.pdf({ path: './xyz.pdf', format: 'A4' });


          //check if file is complete download every 5 seconds for 1 hour
          var download_complete_tracker = 0;

          var download_tracker_timer = setInterval( async ()=>{
            //check the file : 
            try {


              //check file downloaded
              if (fs.existsSync(path.resolve(__dirname,'./downloads/books/'+ file_folder +   decodeURIComponent(file_url.href.split('/')[file_url.href.split('/').length - 1] ) ))) { 
                //file exists
                console.log('file downloaded : ' + path.resolve(__dirname,'./downloads/books/'+ file_folder +  decodeURIComponent(file_url.href.split('/')[file_url.href.split('/').length - 1] )));
                // clear timer
                clearInterval(download_tracker_timer);

                //reset tracker
                download_complete_tracker = 0;

                //remove link from array
                complete_link.splice(0,1);//remove itend on first index

                
                await browser.close();//close browser//previus browser instances

                  
                //call controller
                download_controller();

                //capture stats 
                stats_data.total_new_files_downloaded = stats_data.total_new_files_downloaded + 1;

              }

              //check if not file downloaded
              else {

                //check timer tracker
                // if(download_complete_tracker > 240){//20minuste
                if(download_complete_tracker > 720){//1 hour

                  // clear timer
                  clearInterval(download_tracker_timer);

                  //reset tracker
                  download_complete_tracker = 0;

                  //give error
                  console.log("Checking [download complete] suspended for file after 240 tries after 5 seconds interval : " + path.resolve(__dirname,'./downloads/books/'+ file_folder +  decodeURIComponent(file_url.href.split('/')[file_url.href.split('/').length - 1] )));

                  //remove link from array
                  complete_link.splice(0,1);//remove itend on first index

                          
                  await browser.close();//close browser//previus browser instances

                    
                  //call controller
                  download_controller();

                  //capture stats
                  stats_data.total_files_could_not_download = stats_data.total_files_could_not_download + 1;

                  stats_data.files_could_not_download_links.push(file_url.href);


                }

                else {

                  //if file not exist
                  console.error('waiting for download to complete for file in : '+path.resolve(__dirname,'./downloads/books/'+ file_folder + decodeURIComponent( file_url.href.split('/')[file_url.href.split('/').length - 1] )) +', try number [' +download_complete_tracker+'/720]');

                  //increase
                  download_complete_tracker = download_complete_tracker + 1;

                }
      
              }
            } 
            catch (e){//catch error
              console.log('download complete checking error for file '+file_url.href + ', error = '+e);


              //remove link from download list
              complete_link.splice(0,1);//remove itend on first index

              //reset tracker
              download_complete_tracker = 0;


                     
              await browser.close();//close browser//previus browser instances

                  
              //call controller
              download_controller();
            }



          }, 5000);



        // Close the browser.
        // await browser.close();
      };


      //download controller
      async function download_controller(){
        //if there are still links to downlod
        if(complete_link.length > 0){ 

          //then send first link for download
          file_downloader(complete_link[0]).href;
        }
        else {
          console.log('----++++ PROCESS COMPLETE ++++------, capture stats');

          console.log(JSON.stringify(stats_data, 1,2))
          
          // await browser.close();//close browser

        }

      } download_controller(); //auto start

    }
  

    // Close the browser
    // await browser.close();
  }
    
    
  catch (error) {
    console.error('Error extracting links:', error);
  }




};



pupeteer('https://server.elscione.com/LNWNCentral%20Dump/');//auto start


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
