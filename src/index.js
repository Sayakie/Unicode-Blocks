$(function() {
  // call `page-loaded` when DOM-load ended
  $.event.trigger( 'page-loaded' )
  new initUnicodeTables()
})

$( document ).on('page-loaded app-loaded', () => {
  $('.loading-wrap').delay(250).fadeOut(800)
})

//
// ==================================================
import { app } from 'app'
app.options = {
  version: '0.1.0-beta.0',
  build: 31
}

new app()