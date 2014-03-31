var AnimateView = Backbone.View.extend({
  initialize: function(){
    var self = this
    this.template()
    this.render()
  },

  template: function(){
    var $sneaky_container = document.createElement('div')
    $sneaky_container.id = 'imgs'
    document.getElementById('calendar').parentNode.appendChild($sneaky_container)

    var $sneaky_sprite = document.createElement('div')
    $sneaky_sprite.id = 'sneaky_sprite'
    $sneaky_sprite.innerHTML = '<img id="sprite_img" src="images/dino_sprite_reverse.png">'
    document.getElementById('imgs').appendChild($sneaky_sprite)

    var $folliage_right = document.createElement('div')
    $folliage_right.id = 'folliage_right'
    $folliage_right.innerHTML = '<img id="folliage_right_img" class="folliage" src="images/rainforest_right.png">'
    document.getElementById('imgs').appendChild($folliage_right)

    var $folliage_left = document.createElement('div')
    $folliage_left.id = 'folliage_left'
    $folliage_left.innerHTML = '<img id="folliage_left_img" class="folliage" src="images/rainforest_left.png">'
    document.getElementById('imgs').appendChild($folliage_left)

    var $folliage_top = document.createElement('div')
    $folliage_top.id = 'folliage_top'
    $folliage_top.innerHTML = '<img id="folliage_top_img" class="folliage" src="images/rainforest_top.png">'
    document.getElementById('imgs').appendChild($folliage_top)
  },

  render: function(){
    $('#folliage_right_img')
      .css('height', $(window).height())
      .css('margin-left', $(window).width())

    $('#folliage_left_img')
      .css('height', $(window).height())
      .css('margin-left', -1500)

    $('#folliage_top_img')
      .css('width', 0.8 * $(window).width())
      .css('margin-left', '10%')
      .css('margin-top', -500)
  },

  begin: function(){
    this.overgrowth()
    this.move_dino()
  },

  overgrowth: function(){
    $('#folliage_right_img').animate({
      'margin-left': $(window).width() - (0.75 * $('#folliage_right_img').width())
    }, 1500)

    $('#folliage_left_img').animate({
      'margin-left': (-0.10 * $('#folliage_left_img').width())
    }, 1500)

    $('#folliage_top_img').animate({
      'margin-top': '0'
    }, 1500)
  },

  move_dino: function(){
    var self = this

    $('#sneaky_sprite').animate({
      'margin-left': $(window).width()
    }, 7000)

    var j = 1

    var timer = setInterval(function(){
      self.walk_dino(j += 1)
    }, 800)
    
    setTimeout(function(){
      clearInterval(timer)
      $('#sprite_window').fadeOut(1500)
    }, 7000)
  },

  walk_dino: function(i){
    var movement = i * 478

    $('#sprite_img').css('margin-top', (-1 * movement))
  },


})