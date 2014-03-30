var CalendarDate = Backbone.Model.extend({
  next_month: function(){
    var month = this.get('month')
    if (month == 11){
      month = 0
    } else {
      month += 1
    }
    this.set('month', month)

  },

  prev_month: function(){
    var month = this.get('month')
    if (month == 0){
      month = 11
    } else {
      month -= 1
    }
    this.set('month', month)
  },

  select_day: function(day){
    console.log(day)
    console.log('yo!')

    var clicked_day = day.getAttribute('id').split('-')
    var year = clicked_day[0]
    var month = clicked_day[1]
    var day = clicked_day[2]

    var date = new Date(year, month, day)

    this.set('day', date.getDay())
    this.set('date', date.getDate())
    this.set('month', date.getMonth())
    this.set('year', date.getYear() + 1900)
  }
})

var MonthView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.model, 'change', this.update)
    this.render()
  },

  update: function(){
    this.calendar_body().innerHTML = '';
    this.calendar_sidebar().innerHTML = '';
    this.current_month().innerHTML = '';
    _.each (document.getElementsByClassName('calendar_button'), function(button){
      button.innerHTML= '';
    })
    this.render();
  },

  calendar_nav: function(){
    return document.getElementById('calendar_nav');
  },

  calendar_body: function(){
    return document.getElementById('calendar_body');
  },

  calendar_header: function(){
    return document.getElementById('calendar_header');
  },

  calendar_sidebar: function(){
    return document.getElementById('calendar_sidebar');
  },

  current_month: function(){
    return document.getElementById('current_month');
  },

  render_content: function(){
    var self = this;
    this.template_body(self.model.attributes);
    this.template_sidebar(self.model.attributes);
    this.template_current_month(self.model.attributes);
  },

  render: function(){
    var self = this
    var model_proto = this.model.__proto__

    this.template_body(self.model.attributes);

    _.each (model_proto, function(value, prop){
      if (prop == 'next_month') {
        var $next = document.createElement('div')
        $next.innerHTML = '>'
        $next.id = 'next_month' 
        $next.className = 'calendar_button'
        $next.addEventListener('click', function(){
          self.model[prop]()
        })
        self.calendar_header().appendChild($next)
      } else if (prop == 'prev_month') {
        var $prev = document.createElement('div')
        $prev.innerHTML = '<'
        $prev.id = 'prev_month'
        $prev.className = 'calendar_button' 
        $prev.addEventListener('click', function(){
          self.model[prop]()
        })
        self.calendar_header().appendChild($prev)
      } else if (prop == 'select_day') {
        var $days = document.getElementsByClassName('day')

        _.each ($days, function(day){
          day.addEventListener('click', function(){
            self.model[prop](this)
          })
        })
      }
    })

    var $current_month = document.createElement('div')
    $current_month.id = 'current_month'
    $current_month.class = 'current_month'
    self.calendar_header().appendChild($current_month)

    this.template_sidebar(self.model.attributes);
    this.template_current_month(self.model.attributes);
  },

  template_sidebar: function(attrs){
    var self = this
    var $day_display = document.createElement('div')
    $day_display.id = 'day_display'
    $day_display.innerHTML = '<h2 id="day_display">' + this.get_month(attrs.month) + '</h2>'
    self.calendar_sidebar().appendChild($day_display)

    var $date_display = document.createElement('div')
    $date_display.id = 'date_display'
    $date_display.innerHTML = '<h1 id="date_display">' + attrs.date + '</h1>'
    self.calendar_sidebar().appendChild($date_display)
  },

  template_current_month: function(attrs){
    this.current_month().innerHTML = '<h3 id="current_month">'+ this.get_month(attrs.month) +'</h3>'
  },

  template_body: function(attrs){
    var self = this
    var total_days = this.total_days(attrs.month, attrs.year)
    var current_month = this.get_month(attrs.month)
    var overflow = this.first_day(attrs.year, attrs.month)
    var next_overflow = this.last_day(attrs.year, attrs.month, total_days)

    var weeks = Math.ceil(total_days / 7)
    // days in past month & those overflowing into current
    var prev_total = self.total_days((attrs.month - 1), attrs.year)
    var overflow_days = prev_total - overflow
    var overflow_next_days = 7 - next_overflow
    var month_array = []

    month_array.push('<table id="calendar_view"><tr id="day_initials">')

    _.each (self.get_day_initials(), function(initial){
      month_array.push('<td class="day_initial">'+initial+'</td>')
    })

    month_array.push('</tr><tr id='+attrs.year+'-'+(attrs.month - 1)+' class="week">')

    for (i = overflow_days + 1; i <= prev_total; i++){
      // creates <td> for first week, including days carried over from past month
      month_array.push('<td id="'+attrs.year+'-'+attrs.month+'-'+i+'" class="day"></td>')
    }
    for (i = 1; i <= (7 - overflow);  i++){
      // completes the first week with days from the current month
      month_array.push('<td id="'+attrs.year+'-'+attrs.month+'-'+i+'" class="day">'+i+'</td>')
    }
    month_array.push('</tr>')

    for (i = 0; i < weeks; i++){
      // creates <td> for the rest of the month, beginning where the prior ended
      var week_start = (7 * i) + (8 - overflow)
      var week_stop = (7 * (i + 1)) + (8 - overflow)
      // breaks the month into iteratable weeks
      if (week_stop <= total_days){
        // for all middle weeks
        month_array.push('<tr id='+attrs.year+'-'+attrs.month+' class="week">')
        for (j = week_start; j < week_stop; j++){
          month_array.push('<td id="'+attrs.year+'-'+attrs.month+'-'+j+'" class="day">'+j+'</td>')
        }
        month_array.push('</tr>')
      } else {
        // generates days for the final week
        month_array.push('<tr id='+attrs.year+'-'+attrs.month+' class="week">')
        for (j = week_start; j <= total_days; j++){
          month_array.push('<td id="'+attrs.year+'-'+attrs.month+'-'+j+'" class="day">'+j+'</td>')
        }

        for (i = 1; i < overflow_next_days; i++){
          // creates <td> for the beginning of next month flowing into the current month
          month_array.push('<td id="'+attrs.year+'-'+(attrs.month + 1)+'-'+i+'" class="day"></td>')
        }
        month_array.push('</tr></table>')
      }
    }

    var month_string = month_array.join('')
    this.calendar_body().innerHTML = month_string

    this.calendar_style_helper(attrs)
  },

  calendar_style_helper: function(attrs){
    var $td = document.getElementsByTagName('td')
    for (i = 0; i < $td.length; i+=7) {
      $td[i].style.borderLeft = '0px'
    }

    var $today = document.getElementById(''+attrs.year+'-'+attrs.month+'-'+attrs.date+'')

    $today.style.backgroundColor = 'red'
    $today.style.color = 'white'
  },

  first_day: function(year, month){
    var day_one = new Date(year, month, 1)
    return day_one.getDay()
  },

  last_day: function(year, month, end){
    var day_last = new Date(year, month, end)
    return day_last.getDay()
  },

  total_days: function(month, year){
    return new Date(year, month + 1, 0).getDate();
  },

  get_day: function(day){
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days [ day ]
  },

  get_day_initials: function(){
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  },

  get_month: function(month){
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months[ month ]
  },
})

var CalendarView = Backbone.View.extend({
  initialize: function(){
    var self = this;
    this.render()
    this.views = []
  },

  render: function(){
    var self = this;
    var today = new Date()

    var calendar_date = new CalendarDate({
      day: today.getDay(),
      date: today.getDate(),
      month: today.getMonth(),
      year: (today.getYear() + 1900),
    })

    var month_view = new MonthView({
      model: calendar_date
    });

    self.$el.append(month_view.$el);

  }

})

window.onload = function(){
  console.log('Greetings, Intent Media humans.')
  window.calendar = new CalendarView()
}