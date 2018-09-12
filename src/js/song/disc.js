{
  let view = {
    el: '#disc',
    init(){
      this.$el = $(this.el);
      this.$discCircle = this.$el.find('#disc_circle');
    }
  }

  let model = {
    data: {
      lastTransform: ''
    }
  }

  let controller = {
    init(view,model){
      this.model = model;
      this.view = view;
      this.view.init();
      this.bindEventHubs();
    },
    bindEventHubs(){
      window.eventHub.on('play',()=>{
        this.view.$el.addClass('animate');
      })
      window.eventHub.on('pause',()=>{
        let transformStyle = getComputedStyle(this.view.$discCircle[0]).transform;
        this.view.$el.removeClass('animate');
        this.view.$el.css({'transform': this.model.data.lastTransform === '' ? transformStyle:transformStyle.concat(' ',this.model.data.lastTransform)});
        this.model.data.lastTransform = getComputedStyle(this.view.$el[0]).transform;
      })
    }
  }

  controller.init(view,model);
}