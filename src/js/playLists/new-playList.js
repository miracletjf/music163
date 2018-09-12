{
  let view = {
    el: '.new-playList',
    template: `新建歌曲`,
    init(){
      this.$el = $(this.el);
    },
    render(){
      this.$el.html(this.template);
    }
  }

  let model = {}

  let controll = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.init();
      this.view.render();
    }
  }

  controll.init(view,model)

}