{
  let view = {
    el: '#song_form',
    template: `
    <form action="">
      <div class="row-box">
        <label>
          <span class="name">歌 名</span>
          <input name="name" type="text" class="ipt" value="--name--">
        </label>
      </div>
      <div class="row-box">
        <label>
          <span class="name">歌 手</span>
          <input name="author" type="text" class="ipt" value="--author--">
        </label>
      </div>
      <div class="row-box">
        <label>
          <span class="name">歌曲外链</span>
          <input name="url" type="text" class="ipt" value="--url--">
        </label>
      </div>
      <div class="row-box">
        <div class="btn-box"> 
          <button>确认</button>
        </div>
      </div>
    </form> `,
    render(data = {}){
      let placeholders = ['name','author','url','id'];
      let html = this.template;
      placeholders.map(item=>{
        html = html.replace(`--${item}--`,data[item] || '');
      })
      $(this.el).html(html);
      if(data.id){
        $(this.el).find('form').prepend('<div class="text-title"> 编辑歌曲 </div>')
      }else {
        $(this.el).find('form').prepend('<div class="text-title"> 新建歌曲 </div>')
      }
    },
    reset(){
      this.render({});
    },
    findElements(selector){
      return $(this.el).find(selector);
    },
    changeTitle(title){
      this.findElements('.text-title').text(title);
    }
  }

  let model = {
    data: {id:'',name:'',author:'',url:''},
    create(data){
      let Song = AV.Object.extend('Song');
      let song = new Song();
      return song.save(data).then(object=>{ 
        let {id,attributes} = object;
        Object.assign(this.data, {id,...attributes});
      })
    }
  }

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render();
      this.bindEvents();
      this.bindEventHubs();
    },
    bindEvents(){
      $(this.view.el).on('submit','form',(e)=>{
        e.preventDefault();
        let names = ('name author url').split(' ');
        let data = {};
        names.map(name=>{
          data[name] = $(this.view.el).find(`[name="${name}"]`).val();
        })

        this.model.create(data).then(()=>{
          this.view.reset();
          let string = JSON.stringify(this.model.data);
          let obj = JSON.parse(string);
          window.eventHub.emit('saveData',obj);
        });
      })
    },
    bindEventHubs(){
      window.eventHub.on('upload',data => {
        //去除文件名后缀
        data.name = data.name.replace(/\.mp3/,'');
        this.model.data = data;
        this.view.render(this.model.data);
      })
      window.eventHub.on('selectItem',data=>{
        this.model.data = data;
        this.view.render(this.model.data);
      })
      window.eventHub.on('newSong',()=>{
        this.view.reset();
      })
    }
  }

  controller.init(view,model);
}