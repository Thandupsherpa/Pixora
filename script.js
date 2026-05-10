const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const convertBtn = document.getElementById("convertBtn");

let imageFiles = [];

imageInput.addEventListener("change", (e) => {

  preview.innerHTML = "";

  imageFiles = Array.from(e.target.files);

  imageFiles.forEach((file) => {

    const reader = new FileReader();

    reader.onload = function(event){

      const img = document.createElement("img");

      img.src = event.target.result;

      img.classList.add("preview-image");

      preview.appendChild(img);
    };

    reader.readAsDataURL(file);
  });
});

convertBtn.addEventListener("click", async () => {

  if(imageFiles.length === 0){
    alert("Please upload images first");
    return;
  }

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF();

  for(let i = 0; i < imageFiles.length; i++){

    const file = imageFiles[i];

    const imageData = await readFileAsDataURL(file);

    const img = new Image();

    img.src = imageData;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const imgWidth = 190;
    const imgHeight = (img.height * imgWidth) / img.width;

    if(i > 0){
      pdf.addPage();
    }

    pdf.addImage(
      imageData,
      "JPEG",
      10,
      10,
      imgWidth,
      imgHeight
    );
  }

  pdf.save("converted.pdf");
});

function readFileAsDataURL(file){

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}