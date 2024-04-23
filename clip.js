// let imageElemenet = document.getElementById('image');
let textElement = document.getElementById("tfield");
let listElement = document.getElementById("list");
let copyList = checkLocalStorage();
const worker = await Tesseract.createWorker();
listRefresh();



// ill come to this in a bit.
function checkLocalStorage(){
  //console.log(JSON.parse(window.localStorage.getItem("copy-list")).length);
  if(JSON.parse(window.localStorage.getItem("copy-list"))){
    return JSON.parse(window.localStorage.getItem("copy-list"));
  }
  else{
    window.localStorage.setItem("copy-list", JSON.stringify([]));
    return JSON.parse(window.localStorage.getItem("copy-list"));
  }
  
}


async function convert(params) {
    worker.recognize(params,"eng").then(function(data){
      console.log(data.data.text);
      copyList.push(data.data.text);
      console.log(copyList);
      window.localStorage.setItem("copy-list", JSON.stringify(copyList));
      listRefresh();
    });
}


function listRefresh(){
  listElement.innerHTML = "";
  for(let i = 0; i < copyList.length; i++){
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(copyList[i]));
    listElement.appendChild(li);
    
  }
}


document.getElementById('btn').onclick = async (evt) => {``
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
      // imageElemenet.src = imageUrl;
      convert(imageUrl);
    }
  };
  