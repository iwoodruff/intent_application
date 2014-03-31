var AnimateView = Backbone.View.extend({
  initialize: function(){
    var self = this
    this.render()
  },

  sneaky_sprite: function(){
    return document.getElementById('sneaky_sprite')
  },

  sprite_img: function(){
    return document.getElementById('sprite_img')
  },

  render: function(){
    var $sprite_window = this.sneaky_sprite()
    var $sprite_img = this.sprite_img()
    
    this.move_dino()
  },

  move_dino: function(){
    var self = this
    var $sprite_window = this.sneaky_sprite()
    var $sprite_img = this.sprite_img()

    $('#sneaky_sprite').animate({
      'margin-left': $(window).width()
    }, 7000)

    // for (i = 0; i < window.innerWidth; i += 10){
    //   self.animate(i)
    // }

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

    // this.sneaky_sprite().style.webkitTransform = 'translateY('+ (-1 * movement) +')'

    $('#sprite_img').css('margin-top', (-1 * movement))
  },

  // animate: function(i){
  //   var self = this
  //   var timeout = Math.round(7000 / window.innerWidth)

  //   console.log(i)

  //   setTimeout(function(){
  //     self.sneaky_sprite().style.marginLeft = i
  //   }, timeout)
  // },

})