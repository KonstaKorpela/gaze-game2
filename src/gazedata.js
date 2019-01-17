window.addEventListener("message", messageEvent, false);

function messageEvent(e) {
 const data = e.data;
 if (typeof data !== 'object' || data == null) {
   return;
 }

 if (data.title !== 'gaze') {
   return;
 }

 // TODO Tarkista event.origin

 // Katseen sijainti CSS pikseleissä suhteessa dokumentin (document.documentElement) vasempaan yläreunaan).
 const x = data.x;
 const y = data.y;
}

// Voit debugata to itse tota tyyliin.
window.postMessage({ data: 'gaze', x: 0, y: 0 }, '*');
