'use strict';
var t;
$(function() {
  $.event.trigger( 'page-loaded' )
  t = new initialization()
})

$( document ).on( 'page-loaded table-loaded', () => {
  $('.loading').fadeOut(1200)
})

function initialization() {
  this.initialize()
  this.loadVariables()
  this.bindEvents()
  if (this.checkIsHaveStorage()) {
    this.loadStorage()
  } else {
    this.drawTable()
  }

  this.onceInit = true
  $.event.trigger( 'table-loaded' )
}

initialization.prototype.initialize = function() {
  this.onceInit = false
  this.$el = {}
  this.$point = {}
  this.$point.temp = {}
  this.$point.start = null
  this.$point.end = null
  this.$point.temp.start = null
  this.$point.temp.end = null
  this.$point.useRange = true
  this.$point.selection = null
}

initialization.prototype.loadVariables = function() {
  this.$el = $('#unicodeTable')
  this.$point.start = $('#rangeStart')
  this.$point.end = $('#rangeEnd')
  this.$point.selection = $('#rangeSelector')
}

initialization.prototype.checkIsHaveStorage = function() {
  if (typeof Storage !== void(0)) {
    // 클라이언트가 로컬 저장소를 지원합니다.
    if (localStorage.isHave) {
      // 로컬 저장소에 자원이 있을 경우
      return true
    } else {
      return false
    }
  }
  return false
}

initialization.prototype.loadStorage = function() {
  // Todo
  //
  // 로컬 저장소에 유니코드 시작값과 유니코드 끝값이 저장되어 있는지 확인합니다. 또는 옵션 중 하나가 선택되어 있는지도 조사합니다.
  // 만약 저장되어 있을 경우 그 값을 불러옵니다.
  this.drawTable()
}

initialization.prototype.redefineRange = function() {
  this.$point.temp.start = '0x' + this.$point.start.val()
  this.$point.temp.end = '0x' + this.$point.end.val()
}

initialization.prototype.sliceRange = function() {
  var val = this.$point.selection.find(':selected').val()
  this.$point.start.val(val.split('-')[0])
  this.$point.end.val(val.split('-')[1])
}

initialization.prototype.drawTable = function() {
  // 직접 지정하지 않고 미리 정의된 범위값을 사용한다면 시작점과 끝점을 지정해줍니다.
  if (this.$point.useRange) {
    this.sliceRange()
  }

  // 유니코드 테이블을 그리기 위해서 임시 범위를 재정의합니다.
  this.redefineRange()

  // 테이블을 애니메이션과 함께 초기화합니다.
  if (this.onceInit) {
    this.$el.fadeOut(400).stop(true, true).html('').fadeIn(500)
  }

  // 반복문에 사용할 변수를 정의합니다.
  var start = this.$point.temp.start,
      end = this.$point.temp.end,
      length = end - start + 1;

  // 16비트 유니코드인지 검사합니다.
  if (start >= 0 && start <= 0xD7FF || start >= 0xE000 && start <= 0xFFFF) {
    for (var i = 0; i < length; i++) {
      this.printChar(parseInt(start) + i)
    }
  } else if (start >= 0x10000 && start <= 0x10FFFF) {
    for (var i = 0; i < length; i++) {
      //start -= 0x10000;
      /*var first = ((0xffc00 & start) >> 10) + 0xD800,
          second = (0x3ff & start) + 0xDC00;*/
      var first = Math.floor((parseInt(start) + i - 0x10000) / 0x400 + 0xD800),
          second = (parseInt(start) + i - 0x10000) % 0x400 + 0xDC00;
      
      this.printChar(first, second, parseInt(start) + i)
    }
  }/*
    start -= 0x10000;

    var first = ((0xffc00 & start) >> 10) + 0xD800,
        second = (0x3ff & start) + 0xDC00
        this.$el.append( String.fromCharCode(first) + String.fromCharCode(second) )
  }
  /*
  var start = this.$point.temp.start,
      end = this.$point.temp.end,
      length = end - start + 1;

  for (var i = 0; i < length; i++) {
    var char = String.fromCharCode( (parseInt(start) + i), 16 ).slice(0, 1),
        unicode = (parseInt(start) + i).toString(16).toUpperCase(),
        result = ''; var final = unicode.length >= 5 ? String("00000" + unicode).slice(-5) : String("0000" + unicode).slice(-4)

    result += '<div class="unicode-box">'
      result += '<span>'
        result += char
      result += '</span>'
      result += '<tt>'
        result += JSON.parse(`["\\u${final}"]`)[0].slice(0, 1)
      result += '</tt>'
      result += '<td>'
        result += unicode.length >= 5 ? String("00000" + unicode).slice(-5) : String("0000" + unicode).slice(-4)
      result += '</td>'
    result += '</div>'
    this.$el.append( result )
  }
  */
}

initialization.prototype.printChar = function(start, second = false, origin = false) {
  var result = '';
  if (!origin) {
    origin = start
  }
  origin = origin.toString(16).toUpperCase()

  result += '<div class="unicode-box">'
    result += '<span>'
      //result += String.fromCharCode((parseInt(start) + i)) + ( second ? String.fromCharCode((parseInt(second) + i)) : '')
      result += String.fromCharCode(start) + ( second ? String.fromCharCode((parseInt(second))) : '')
    result += '</span>'
    result += '<tt>'
      result += origin.length >= 5 ? String("00000" + origin).slice(-5) : String("0000" + origin).slice(-4)
    result += '</tt>'
  result += '</div>'
  this.$el.append( result )
}

initialization.prototype.bindEvents = function() {
  this.$point.start.on('input', $.proxy(function() {
    this.drawTable()
  }, this))
  this.$point.end.on('input', $.proxy(function() {
    this.drawTable()
  }, this))
  this.$point.selection.on('change', $.proxy(function() {
    this.drawTable()
  }, this))
}


initialization.prototype.readjustValue = function(value) {
  // 16비트 유니코드는 올바른 값을 얻기 위해 값을 재조정할 필요가 있습니다.
  value -= 0x10000;

  return value
}

// TODO
//
// 여러 유니코드 범위를 입력하고 그 범위들을 출력할 수 있도록 수정**