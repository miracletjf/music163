{
  let view = {
    el: '#loading_box'
  }

  let model = { }

  let controller = {
    init(view,model){
      this.model = model;
      this.view = view;
      this.bindEventHub();
    },
    bindEventHub(){
      window.eventHub.on('loading',()=>{
        $(this.view.el).addClass('active');
      })
       window.eventHub.on('loadinged',()=>{
         $(this.view.el).removeClass('active');
       })
    }
  }

  controller.init(view,model);
}