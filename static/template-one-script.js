const observer = new IntersectionObserver((entries) => { 

  entries.forEach(entry => {  

    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {

      entry.target.classList.remove('visible'); 
    }
  });
});

document.querySelectorAll('.fade-scroll').forEach(el => observer.observe(el)); // qui troviamo tutti gli elementi con la classe .fade-scroll e li "osserviamo" uno ad uno


const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
  navbar.classList.toggle('active');
});