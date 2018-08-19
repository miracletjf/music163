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
      let {name,author,url} = data;
      let Song = AV.Object.extend('Song');
      let song = new Song();
      return song.save({name,author,url}).then(object=>{
        let {id,attributes} = object;
        Object.assign(this.data, {id,...attributes});
      })
    },
    modify(data){
        // 第一个参数是 className，第二个参数是 objectId
        var song = AV.Object.createWithoutData('Song', data.id);
        // 修改属性
        ('name author url').split(' ').map(item=>{
          song.set(item,data[item]);
        });
        // 保存到云端
        return song.save();
    },
    resetData(){
      this.data = {id:'',name:'',author:'',url:''};
      window.eventHub.emit('newSong');
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
        
        Object.assign(this.model.data,data);
        
        if(this.model.data.id){
          this.modifyData(this.model.data)
        }else{
          this.createData(this.model.data);
        }
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
        if(this.model.data.id){
          this.model.resetData();
        }
        this.view.reset();
      })
    },
    createData(data){
      return this.model.create(data).then(()=>{
        this.view.reset();
        // 拷贝对象，
        //   否则将会传递对象地址，
        //   产生bug，列表数据指向同一个地址
        console.log(this.model.data);
        let obj = JSON.parse(JSON.stringify(this.model.data));
        window.eventHub.emit('saveData',obj);
        this.model.resetData();
      });
    },
    modifyData(data){
      return this.model.modify(data).then(()=>{
        this.view.render(this.model.data);
        let obj = JSON.parse(JSON.stringify(this.model.data));
        window.eventHub.emit('modifyData',obj);
        this.model.resetData();
      })
    },

  }

  controller.init(view,model);
}