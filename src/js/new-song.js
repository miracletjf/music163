{
  let view = {
    el: '.new-song',
    template: `新建歌曲`,
    render(data){
      $(this.el).html(this.template);
    }
  }

  let model = { }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render();
      window.eventHub.on('upload',data=>{
        $(this.view.el).addClass('actieve');
      })
    }
  }

  controller.init(view,model);
}