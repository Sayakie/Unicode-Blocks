export class app {
  constructor(options) {
    this.initVariables()
    this.loadVariables()
    this.confirmSupport()
    if (this.supportWorker) {
      this.$worker = new Worker(URL.createObjectURL(new Blob([ this.loadWorker() ])))
    } else {
      // Worker does not support
      this.sendMessage(`Worker does not support`)
    }
    // this.$worker.postMessage()
    this.bindEvents()
    this.mergeOptions(options)
    this.onceInit = true
    $.event.trigger( 'app-loaded' )
  }

  get version() {
    return this._version
  }

  set version(val) {
    this._version = val
  }

  get build() {
    return this._build
  }

  set build(val) {
    this._build = val
  }

  initVariables() {
    this.onceInit = false
    this.prefix = null
    this.suffix = null
    this.version = null
    this.build = null
    this.useBlock = null
    this.supportStorage = null
    this.supportWorker = null
    this.$el = null
    this.cvs = null
    this.$cvs = null
    this.$selector = null
    this.$ranges = null
    this.$ranges.temp = null
    this.$ranges.start = null
    this.$ranges.end = null
    this.$ranges.temp.start = null
    this.$ranges.temp.end = null
    this.$worker = null
  }

  loadVariables() {
    this.$el = $('#unicode-table')
    this.$selector = $('#scope-selector')
    this.$ranges.start = $('#scope-start')
    this.$ranges.end = $('#scope-end')
  }

  confirmSupport() {
    typeof Storage !== void(0)
      ? (localStorage.isHave)
        ? this.supportStorage = true
        : this.supportStorage = false
      : this.supportStorage = false
    
    typeof Worker !== void(0)
      ? this.supportWorker = true
      : this.supportWorker = false
  }

  loadWorker() {
    self.onMessage = (event) => {
      const data = event.data
    }
    self.close()
  }

  defineRange() {
    this.$point.temp.start = '0x' + this.$point.start.val()
    this.$point.temp.end = '0x' + this.$point.end.val()
  }

  sliceBlock() {
    const val = this.$selector.find(':selected').val().split('-')

    this.$ranges.start.val( val[0] )
    this.$ranges.end.val( val[1] )
  }

  sendMessage(msg, type = 'default') {
    console.log(msg)
  }

  bindEvents() {
    this.$worker.onmessage = (event) => console.log(event.data)
    this.$ranges.start.bind('keydown', $.proxy(event => {
      let key = event.keyCode ? event.keyCode : event.which

      switch (key) {
        case 13:
          // Keydown detect - Enter
          this.useBlock = true
          event.preventDefault()
          break
      }
    }, this))
    this.$ranges.end.bind('keydown', $.proxy(event => {
      let key = event.keyCode ? event.keyCode : event.which

      switch (key) {
        case 13:
          // Keydown detect - Enter
          this.useBlock = true
          event.preventDefault()
          break
      }
    }, this))
    this.$selector.bind('change', $.proxy(() => {
      this.useBlock = true
    }, this))
    $( document ).bind('click', '#canvas', event => {
      event.preventDefault()
    })
  }

  mergeOptions(options) {
    version(options.version)
    build(options.build)
  }
}