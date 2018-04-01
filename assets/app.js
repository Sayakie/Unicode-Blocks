'use strict';
$(function() {
  $.event.trigger( 'page-loaded' )
  new initialization()
})

$( document ).on( 'page-loaded table-loaded', () => {
  $('.loading-wrap').delay(400).fadeOut(800)
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
  if (this.onceInit ? false : false) {
    // off 함수를 넣어 이벤트가 1회 이상 중복되었을 때 애니메이션이 겹쳐 유니코드 테이블이 표시되지 않는 문제를 해결합니다.
    this.$el.off().fadeOut(400, function() {
      $(this).html('').fadeIn(420)
    })
  }

  // 페이드-아웃 페이드-인 효과 도중 테이블이 바로 사라지는 문제를 막기 위해 setTimeout으로 딜레이를 줍니다.
  setTimeout($.proxy(function() {
    // 반복문에 사용할 변수를 정의합니다.
    var start = this.$point.temp.start,
        end = this.$point.temp.end,
        length = end - start + 1, results = ''

    // 16비트 유니코드인지 검사합니다.
    if (start >= 0 && start <= 0xD7FF || start >= 0xE000 && start <= 0xFFFF) {
      for (var i = 0; i < length; i++) {
        results += this.printChar(parseInt(start) + i)
      }
    } else if (start >= 0x10000 && start <= 0x10FFFF) {
      for (var i = 0; i < length; i++) {
        var first = Math.floor((parseInt(start) + i - 0x10000) / 0x400 + 0xD800),
            second = (parseInt(start) + i - 0x10000) % 0x400 + 0xDC00;
        
        results += this.printChar(first, second, parseInt(start) + i)
      }
    }

    this.$el.html(results)
  }, this), 0)
}

initialization.prototype.printChar = function(start, second = false, origin = false) {
  if (!origin) {
    origin = start
  }
  origin = origin.toString(16).toUpperCase()

  var result = '';
  result += '<div class="unicode-box col-2 col-md-1 col-lg-1"><a href="#">'
    result += '<span>'
      result += String.fromCharCode(start) + ( second ? String.fromCharCode((parseInt(second))) : '')
    result += '</span>'
    result += '<tt>'
      result += origin.length >= 5 ? String("00000" + origin).slice(-5) : String("0000" + origin).slice(-4)
    result += '</tt>'
  result += '<a/></div>'
  return result
}

initialization.prototype.bindEvents = function() {
  this.$point.start.on('keydown', $.proxy(function(e) {
    var key = (e.keyCode ? e.keyCode : e.which)
    if (key == 13) {
      this.$point.useRange = false
      this.drawTable()
      e.preventDefault()
    }
  }, this))
  this.$point.end.on('keydown', $.proxy(function(e) {
    var key = (e.keyCode ? e.keyCode : e.which)
    if (key == 13) {
      this.$point.useRange = false
      this.drawTable()
      e.preventDefault()
    }
  }, this))
  this.$point.selection.on('change', $.proxy(function() {
    this.$point.useRange = true
    this.drawTable()
  }, this))
  $(document).on('click', '.unicode-box', function(e) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).find('span').text()).select();
    document.execCommand("copy");
    $temp.remove();
    e.preventDefault()
  })
}

// TODO
//
// 여러 유니코드 범위를 입력하고 그 범위들을 출력할 수 있도록 수정**
// 문자열 클릭시 Copy하기