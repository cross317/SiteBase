if (window.location.pathname.endsWith("index.html") || window.location.pathname == ("/")) {
    const track = document.querySelector(".track-carousel")
    const slides = document.querySelectorAll(".slide")

    const nextBtn = document.querySelector(".arrow.right");
    const prevBtn = document.querySelector(".arrow.left");

    let currentIndex = 0;

    const slideWidth = slides[0].offsetWidth;

    function UpdateCarousel(){  
        const width = slides[0].getBoundingClientRect().width; 

        track.style.transform = `translateX(-${currentIndex * width}px)`;
    }

    let autoSLide = setInterval(MoveNext, 3100)

    function MoveNext() {
        currentIndex++;
        if (currentIndex > slides.length){
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
        UpdateCarousel();
    })


    prevBtn.addEventListener("click", () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = slides.length - 1;
        }
        UpdateCarousel();
    })
}


document.addEventListener("DOMContentLoaded", () => {
    let formTool = document.getElementById("form-tool");
    let userInputs = document.querySelectorAll(".input-text");
    let dl_btn = document.querySelector(".download_btn")

    /** @type {HTMLIFrameElement} **/
    const iframe = document.getElementById("previewed-frame");

    iframe.addEventListener("load", () => {
        const iDoc = iframe.contentDocument;
        formTool.addEventListener("submit", (e) =>  {
            e.preventDefault();

            let dataPack = {}

            userInputs.forEach(input => {
                const selector = input.getAttribute("data-target");
                const element = iDoc.querySelector(selector);

                if (element) {
                    element.textContent = input.value;
                    dataPack[selector] = input.value;
                }
            });
            alert(JSON.stringify(dataPack))
            
            fetch("/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataPack)
            })
            /*.then(res => res.json())
            .then(data => {
                let cartella_utente = data.cartella_utente;
                let url = "/download/" + cartella_utente;
                fetch(url, {
                   method: "POST"
                })
            })*/
        });
    });
});
