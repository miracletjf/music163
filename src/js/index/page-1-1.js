{
  let view = {
    el: '#playList',
    template: `<li class="cover">
        <a href="./song.html?id={{id}}">
          <div class="picture"><img src="{{imgUrl}}"><span class="hot"></span></div>
          <p class="text">{{name}}</p>
        </a>
      </li>`,
    init(){
      this.$el = $(this.el);
    },
    render(data){
      let playLists = data.playLists;
      let props = ('id imgUrl name').split(' ');

      let playListsHtml = playLists.reduce((res,playList)=>{
        return res + props.reduce( (liHtml,item) => 
          liHtml.replace(`{{${item}}}`,playList[item]),this.template);
      },'');

      this.$el.html(playListsHtml);
    }
  }

  let model = {
    data:{},
    fetchAll(){
      let query = new AV.Query('PlayList');
      query.limit(6);
      return query.find().then( playLists => {
        this.data.playLists = playLists.map(playList=>{
          return {id:playList.id,...playList.attributes}
        });
      })
    }
  }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.init();
      this.model.fetchAll().then(()=>{
        this.view.render(this.model.data);
      });
    }
  }

  controller.init(view,model);
}