{
  let view = {
    el: '#songList',
    template: `<li>
      <a href="./song.html?id={{id}}" class="item">
        <h3>{{name}}</h3>
        <p class="text">
          <svg class="icon icon-sq" aria-hidden="true"> <use xlink:href="#icon-sq"></use> </svg>
          {{author}}
        </p>
        <i> <svg class="icon icon-bofang" aria-hidden="true"> <use xlink:href="#icon-bofang"></use> </svg> </i>
      </a>
    </li>`,
    init(){
      this.$el = $(this.el);
    },
    render(data){
      let {songs,props} = data;
      let songsHtml = songs.reduce((str,song)=>{
        let template = this.template;
        props.map(item=>{
          console.log(item,song[item]);
          template = template.replace(`{{${item}}}`,song[item]);
        });
        console.log(template);
        return str + template;
      },'');

      this.$el.append(songsHtml);
    }
  }

  let model = {
    data:{ 
      props: ['id','name','author','url']
    },
    featchAll(){
      var query = new AV.Query('Song');
      return query.find().then( songs => {
        this.data.songs = songs.map(song=>{
          return {id:song.id,...song.attributes}
        });
      })
    }

  }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.init();
      this.getAllSongs();
    },
    getAllSongs(){
      this.model.featchAll().then(()=>{
        this.view.render(this.model.data);
      })
    }
  }

  controller.init(view,model);
}