// const T = require("tesseract.js");
// import Tesseract from "tesseract.js";
// import { createWorker } from "tesseract.js";


let imageElemenet = document.getElementById('image');
let textElement = document.getElementById("tfield");
const copyList = [];

function checkLocalStorage(){
  if(window.localStorage.getItem("copy-list")){
    return 1;
  }
  else{
    window.localStorage.setItem("copy-list", JSON.stringify(copyList));
    return 1;
  }
}


async function convert(params) {
    // await T.recognize(params, 'eng', {logger: e => console.log(e)}).then(out => console.log(out.data.text));
    const worker = new Tesseract.TesseractWorker();
    worker.recognize(params,"eng").then(function(data){
      console.log(data.text);
      ;
    });
}

document.getElementById('btn').onclick = async (evt) => {
    const auth = await navigator.permissions.query( { name: "clipboard-read" } );
    if( auth.state !== 'denied' ) {
      const item_list = await navigator.clipboard.read();
      let image_type; // we will feed this later
      const item = item_list.find( item => // choose the one item holding our image
        item.types.some( type => { // does this item have our type
          if( type.startsWith( 'image/' ) ) {
            image_type = type; // store which kind of image type it is
            return true;
          }
        } )
      );
      const file = item && await item.getType( image_type );
      let imageUrl = URL.createObjectURL(file);
      imageElemenet.src = imageUrl;
      convert(imageUrl);
    }
  };
  