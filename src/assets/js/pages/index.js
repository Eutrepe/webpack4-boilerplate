
import 'bootstrap';
// import $ from 'jquery';
import '../../scss/style.scss';


(function () {
    'use strict';
            
    fetch('uploads/i18n/test.json')
        .then(response => response.json())
        .then(json =>{
            console.log(json);
            document.getElementById('testImage').src = json.url;
        });
})();
