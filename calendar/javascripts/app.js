var CalendarDate = Backbone.Model.extend({
  next_month: function(){
    var month = this.get('month')
    month += 1
    this.set('month', month)
  },

  prev_month: function(){
    var month = this.get('month')
    month -= 1
    this.set('month', month)
  },

  select_day: function(day){
    console.log(day)

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
    this.render_nav()
  },

  update: function(){
    this.calendar_body().innerHTML = '';
    this.calendar_sidebar().innerHTML = '';
    this.current_month().innerHTML = '';
    this.render_content();
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

  render_nav: function(){
    var self = this
    var model_proto = this.model.__proto__

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
        var $days = document.getElementsByTagName('td')
        console.log($days)
        _.each ($days, function(day){
          console.log('hi')
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

    this.render_content()
  },

  template_sidebar: function(attrs){
    var self = this
    var $day_display = document.createElement('div')
    $day_display.id = 'day_display'
    $day_display.innerHTML = '<h1 id="day_display">' + this.get_month(attrs.month) + '</h1>'
    self.calendar_sidebar().appendChild($day_display)

    var $date_display = document.createElement('div')
    $date_display.id = 'date_display'
    $date_display.innerHTML = '<h1 id="date_display">' + attrs.date + '</h1>'
    self.calendar_sidebar().appendChild($date_display)
  },

  template_current_month: function(attrs){
    this.current_month().innerHTML = '<h3 id="current_month">'+ this.get_day(attrs.day) +'</h3>'
  },

  template_body: function(attrs){
    var self = this
    var total_days = this.total_days(attrs.month, attrs.year)
    var current_month = this.get_month(attrs.month)
    var overflow = this.first_day(attrs.year, attrs.month)
    var weeks = Math.ceil(total_days / 7)

    if (attrs.month == 0){
      // if its January, the last month will be December of the prior year
      var prev_total = self.total_days(12, (attrs.year - 1))
      var overflow_days = prev_total - overflow
    } else {
      // days in past month & those overflowing into current month
      var prev_total = self.total_days((attrs.month - 1), attrs.year)
      var overflow_days = prev_total - overflow
    }

    var month_array = []

    month_array.push('<table id="'+attrs.year+'"><tr class="day_initials">')

    _.each (self.get_day_initials(), function(initial){
      month_array.push('<td class="day_initial">'+initial+'</td>')
    })

    if (total_days % 7 == 0) {
      // the month begins on monday the 1st
      month_array.push('</tr><tr id='+attrs.year+'-'+attrs.month+' class="week"><td id="'+attrs.year+'-'+attrs.month+'-1" class"calendar_day">1</td>')
    } else {
      // it is carrying days over from the prior month


      month_array.push('</tr><table id="'+attrs.year+'-'+(attrs.month - 1)+'"><tr id='+attrs.year+'-'+(attrs.month - 1)+' class="week">')

      for (i = overflow_days + 1; i <= prev_total; i++){
        // creates <td> for first week, including days carried over from past month
        month_array.push('<td id="'+attrs.year+'-'+attrs.month+'-'+i+'" class"calendar_day">'+i+'</td>')
      }
      for (i = 1; i <= (7 - overflow);  i++){
        // completes the first week with days from the current month
        month_array.push('<td id="'+attrs.year+'-'+attrs.month+'-'+i+'" class"calendar_day">'+i+'</td>')
      }
      month_array.push('</tr>')
    }

    for (i = 0; i < weeks; i++){
      // creates <td> for the rest of the month, beginning where the prior ended
      var week_start = (7 * i) + (8 - overflow)
      var week_stop = (7 * (i + 1)) + (8 - overflow)
      // breaks the month into iteratable weeks
      if (week_stop <= total_days){
        // for all middle weeks
        month_array.push('<tr id='+attrs.year+'-'+attrs.month+' class="week">')
        for (j = week_start; j < week_stop; j++){
          month_array.push('<td id="'+attrs.year+'-'+attrs.month+'-'+j+'" class"calendar_day">'+j+'</td>')
        }
        month_array.push('</tr>')
      } else {
        // generates days for the final week
        month_array.push('<tr id='+attrs.year+'-'+attrs.month+' class="week">')
        for (j = week_start; j <= total_days; j++){
          month_array.push('<td id="'+attrs.year+'-'+attrs.month+'-'+j+'" class"calendar_day">'+j+'</td>')
        }
        month_array.push('</tr></table>')
      }
    }

    var month_string = month_array.join('')
    this.calendar_body().innerHTML = month_string
  },

  first_day: function(year, month){
    var day_one = new Date(year, month, 1)
    return day_one.getDay()
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