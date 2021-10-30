function loadRepos() {
   const resultDiv = document.getElementById('res');
   const url = 'https://api.github.com/users/testnakov/repos';
   const xhr = new XMLHttpRequest();

   xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
         resultDiv.textContent = xhr.responseText;
      }
   });

   xhr.open('GET', url);
   xhr.send();
}