{
  let view = {
    el: '.songList-container',
    songLists: [],
    template: ` <ul class="songList"></ul>`,
    render(){
      let ul = $(this.template);
      this.songLists.map(item=>{
        console.log(item);
        let aaa = $('<li></li>').html(item.name);
        console.log(aaa);
        ul.append(aaa);
      })
      $(this.el).html(ul);
    },
    create(data){
      this.songLists.push(data);
      this.render();
    }
  }
  let model = {}
  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render();
      window.eventHub.on('saveData',data=>{
        this.view.create(data);
      })
    }
  }

  controller.init(view,model);
}