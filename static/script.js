if (window.location.pathname.endsWith("index.html") || window.location.pathname == ("/")) {
    const track = document.querySelector(".track-carousel")
    const slides = document.querySelectorAll(".slide")

    const nextBtn = document.querySelector(".arrow.right");
    const prevBtn = document.querySelector(".arrow.left");

    let currentIndex = 0;

    function UpdateCarousel(){  
        const width = slides[0].getBoundingClientRect().width; 

        track.style.transform = `translateX(-${currentIndex * width}px)`;
    }

    window.addEventListener("resize", () => {
        UpdateCarousel();
    })
    
    let autoSLide = setInterval(MoveNext, 3100)

    function MoveNext() {
        currentIndex++;
        if (currentIndex >= slides.length){
            currentIndex = 0;
        }
        UpdateCarousel();
    }

    function ResetTimer() {
        clearInterval(autoSLide);
        autoSLide = setInterval(MoveNext, 3100)
    }

    nextBtn.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex >= slides.length) {
            currentIndex = 0;
        }
        ResetTimer()
        UpdateCarousel();
    })


    prevBtn.addEventListener("click", () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = slides.length - 1;
        }
        ResetTimer()
        UpdateCarousel();
    })
}


document.addEventListener("DOMContentLoaded", () => {
    let btnText = document.querySelector(".btn-one");
    let btnColors = document.querySelector(".btn-two");
    let btnImgaes = document.querySelector(".btn-three");

    let formToolImages = document.getElementById("form-tool-images");
    let formToolColors = document.getElementById("form-tool-colors");
    let formTool = document.getElementById("form-tool");

    function SwitchForm(targetForm){
        formTool.style.display = "none";
        formToolColors.style.display = "none";
        formToolImages.style.display = "none";
        targetForm.style.display = "flex";
    }

    if (btnText){
        btnText.addEventListener("click", () => { SwitchForm(formTool) })
    }
    if (btnColors){
        btnColors.addEventListener("click", () => { SwitchForm(formToolColors)} )
    }
    if (btnImgaes){
        btnImgaes.addEventListener("click", () => { SwitchForm(formToolImages) })
    }

    let userInputs = document.querySelectorAll(".input-text");
    let uIColors = document.querySelectorAll(".input-color");
    let dl_btn = document.querySelector(".download_btn");

    /** @type {HTMLIFrameElement} **/
    const iframe = document.getElementById("previewed-frame");

    iframe.addEventListener("load", () => {
        const iDoc = iframe.contentDocument;
        let dataPack = {}
        formTool.addEventListener("submit", (e) =>  {
            e.preventDefault();

            userInputs.forEach(input => {
                const selector = input.getAttribute("data-target");
                const element = iDoc.querySelector(selector);

                if (element) {
                    element.textContent = input.value;
                    dataPack[selector] = input.value;
                }
            });
            alert(JSON.stringify(dataPack));
            
        });

        formToolColors.addEventListener("submit", (e) => {
            e.preventDefault();

            let bgPrimary = "#BFC3C5F4";
            let bgSecondary = "#011114F4";

            let bodyBGModifier = "";

            uIColors.forEach(uIC => {
                const colorSelector = uIC.getAttribute("data-target");
                const colorElement = iDoc.querySelector(colorSelector);

                if (colorElement){
                    if (uIC.getAttribute("data-type") == "background-gradient")
                    {   
                        if (uIC.getAttribute("data-gradient-type") == "primary")
                        {
                            bgPrimary = uIC.value;
                            bodyBGModifier = colorElement;
                        }
                        else if (uIC.getAttribute("data-gradient-type") == "secondary")
                        {
                            bgSecondary = uIC.value;
                        }
                    }
                    else if (uIC.getAttribute("data-type") == "color")
                    {
                        colorElement.style.color = uIC.value;
                    }
                    else if (uIC.getAttribute("data-type") == "background")
                    {
                        colorElement.style.background = uIC.value;
                    }
                    
                    dataPack[colorSelector] = uIC.value;
                }
                
            })

            let cssSintax = `linear-gradient(to right, ${bgPrimary}, ${bgSecondary})`;

            if (bodyBGModifier){
                bodyBGModifier.style.background = cssSintax;
            }

            alert(JSON.stringify(dataPack));
    
        })

        let createBtn = document.getElementById("create-button");

        createBtn.addEventListener("click", (e) => {
            e.preventDefault();

            fetch("/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataPack)
            })
        })
    });
});
