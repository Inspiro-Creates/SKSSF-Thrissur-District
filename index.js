```js
// @ts-nocheck
// console.log("coucou");

const uploadedImageDiv = document.getElementById("uploadedImage");
const fileUpload = document.getElementById("fileUpload");

fileUpload.addEventListener("change", getImage, false);

let cropper = null;

const cropButton = document.getElementById("cropButton");
cropButton.addEventListener("click", cropImage);

let myGreatImage = null;

const croppedImage = document.getElementById("croppedImage");


function getImage() {

  console.log("images", this.files[0]);

  const imageToProcess = this.files[0];

  // Display uploaded image
  let newImg = new Image();

  newImg.src = URL.createObjectURL(imageToProcess);

  newImg.id = "myGreatImage";

  uploadedImageDiv.style.width = "250px";
  uploadedImageDiv.style.height = "250px";

  // Remove previous image
  const oldImage = document.getElementById("myGreatImage");

  if (oldImage) {
    oldImage.remove();
  }

  uploadedImageDiv.appendChild(newImg);

  myGreatImage = document.getElementById("myGreatImage");

  processImage();
}


function processImage() {

  cropButton.style.display = "block";

  // Destroy previous cropper
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }

  cropper = new Cropper(myGreatImage, {

    aspectRatio: 2710 / 1891,

    autoCropArea: 1,

    background: true,

    movable: false,

    resizable: false,

    checkOrientation: true,

    strict: false,

    guides: true,

    highlight: true,

    dragCrop: false,

    cropBoxResizable: true,

    viewMode: 2,

    data: {
      width: 3000,
      height: 3000,
    },

    crop(event) {

      console.log(
        Math.round(event.detail.width),
        Math.round(event.detail.height)
      );

      const canvas = this.cropper.getCroppedCanvas();

      croppedImage.src = canvas.toDataURL("image/png");
    },

  });
}


function cropImage() {

  if (!cropper) {
    alert("Please upload an image first.");
    return;
  }

  const imgurl = cropper.getCroppedCanvas().toDataURL("image/png");

  const img = document.createElement("img");

  img.src = imgurl;

  document.getElementById("cropResult").appendChild(img);

  draw();
}


function draw() {

  var canvas = document.getElementById("canvas");

  var ctx = canvas.getContext("2d");

  ctx.font = "70px Roboto";

  ctx.textAlign = "center";

  ctx.fillStyle = "black";


  // Draw cropped image

  ctx.drawImage(
    document.getElementById("croppedImage"),
    151,
    146,
    2710,
    1891
  );


  // Draw frame

  ctx.drawImage(
    document.getElementById("frame"),
    0,
    0
  );


  // Draw username

  ctx.fillText(
    document.getElementById("username").value,
    696,
    2272
  );
}


/* =========================================
   MULTIPLE DOWNLOAD SYSTEM
   ========================================= */

let downloadCount =
  Number(localStorage.getItem("downloadCount")) || 0;


function download() {

  const canvas = document.getElementById("canvas");

  if (!canvas) {
    alert("Canvas not found.");
    return;
  }


  // Convert canvas to PNG

  canvas.toBlob(function (blob) {

    if (!blob) {

      alert("Unable to create image.");

      return;
    }


    // Increase download number

    downloadCount++;


    // Save number permanently on this device

    localStorage.setItem(
      "downloadCount",
      downloadCount
    );


    // Create temporary download link

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);


    // File name

    link.download =
      `Inspiro_Creates_${downloadCount}.png`;


    // Trigger download

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    // Free memory

    setTimeout(function () {

      URL.revokeObjectURL(link.href);

    }, 1000);


  }, "image/png");
}


/* =========================================
   SHOW DOWNLOAD BUTTON
   ========================================= */

$(function () {

  $("#cropButton").on("click", function () {

    $("#download").show();

  });

});


/* =========================================
   POSTER SHOW / HIDE
   ========================================= */

const toggleBtn =
  document.querySelector("#cropButton");

const divList =
  document.querySelector("#poster");


toggleBtn.addEventListener("click", () => {

  if (divList.style.display === "none") {

    divList.style.display = "block";

    toggleBtn.innerHTML = "Hide List";

  } else {

    divList.style.display = "none";

    toggleBtn.innerHTML = "Show List";

  }

});


/* =========================================
   USERNAME HIDE
   ========================================= */

$(document).ready(function () {

  $("#cropButton").click(function () {

    $("#poster1").hide();

  });

});


/* =========================================
   CLOSE BUTTONS
   ========================================= */

$("#x").click(function () {

  location.reload();

});


$("#close").click(function () {

  location.reload();

});


/*
   IMPORTANT:
   DO NOT reload the page after downloading.

   The old code was:

   $('#download').click(function () {
     location.reload();
   });

   It has been removed so multiple downloads
   can happen without refreshing the page.
*/
```

### What changed

The old download system:

```js
download.href = image;
download.download = `Inspiro_Creates_${downloadCount}.png`;
```

has been replaced with a temporary download link using `canvas.toBlob()`.

And this has been **removed**:

```js
$('#download').click(function () {
  location.reload();
});
```

So now:

**Download 1 → Download 2 → Download 3 → Download 4 → ...**

all work without refreshing the page.

The filenames will be:

```text
Inspiro_Creates_1.png
Inspiro_Creates_2.png
Inspiro_Creates_3.png
Inspiro_Creates_4.png
```

The counter is stored in `localStorage`, so it continues even after the browser is closed.
