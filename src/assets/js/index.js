
import 'bootstrap';
// import $ from 'jquery';
import '../scss/style.scss';


(function () {
    'use strict';

    $(
        () => {
            const button = document.querySelector('button');
            const textParagraph = document.querySelector('p');
            
            button.addEventListener('click', () => {
              const text = textParagraph.textContent;
              const promise = new Promise((resolve, reject) => {});
              console.log(promise);
              if (navigator.clipboard) {
                navigator.clipboard
                  .writeText(text)
                  .then(result => {
                    console.log(result);
                  })
                  .catch(error => {
                    console.log(error);
                  });
              } else {
                alert('Feature not available, please copy manually!');
              }
            });
           
        }
    )    
})();
