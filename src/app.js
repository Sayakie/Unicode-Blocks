export class app {
  constructor() {
    this.initVariables()
    this.loadVariables()
    this.confirmSupport()
    if (this.supportWorker) {
      this.$worker = new Worker(URL.createObjectURL(new Blob([ this.loadWorker() ])))
    }
    this.bindEvents()
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
    postMessage( ' I AM Worker ' )
    self.close()
  }

  bindEvents() {
    this.$worker.onmessage = (event) => console.log(event.data)
  }
}