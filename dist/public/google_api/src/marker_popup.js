var Popup;
function createPopupClass() {
  function Popup(position, content) {
    this.position = position;
    this.inRange = false;

    content.classList.add('popup-bubble');

    // This zero-height div is positioned at the bottom of the bubble.
    var bubbleAnchor = document.createElement('div');
    bubbleAnchor.classList.add('popup-bubble-anchor');
    bubbleAnchor.appendChild(content);

    // This zero-height div is positioned at the bottom of the tip.
    this.containerDiv = document.createElement('div');
    this.containerDiv.classList.add('popup-container');
    this.containerDiv.appendChild(bubbleAnchor);

    // Optionally stop clicks, etc., from bubbling up to the map.
    google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
  }
  // ES5 magic to extend google.maps.OverlayView.
  Popup.prototype = Object.create(google.maps.OverlayView.prototype);

  Popup.prototype.setInRange = function(inRange) {
    this.inRange = inRange;
  }

  /** Called when the popup is added to the map. */
  Popup.prototype.onAdd = function() {
    this.getPanes().floatPane.appendChild(this.containerDiv);
  };

  /** Called when the popup is removed from the map. */
  Popup.prototype.onRemove = function() {
    if (this.containerDiv.parentElement) {
      this.containerDiv.parentElement.removeChild(this.containerDiv);
    }
  };

  /** Called each frame when the popup needs to draw itself. */
  Popup.prototype.draw = function() {
    var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);

    // Hide the popup when it is far out of view.
    var display =
        this.inRange && Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
        'block' :
        'none';

    if (display === 'block') {
      this.containerDiv.style.left = divPosition.x + 'px';
      this.containerDiv.style.top = divPosition.y + 'px';
    }
    if (this.containerDiv.style.display !== display) {
      this.containerDiv.style.display = display;
    }
  };

  return Popup;
}
