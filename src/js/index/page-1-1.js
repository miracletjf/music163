{
  let view = {
    el: '#playList',
    template: `
    `
  }

  let model = {
    data:{}
  }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      }
  }

  controller.init(view,model);
}