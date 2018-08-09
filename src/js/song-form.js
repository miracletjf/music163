{
  let view = {
    el: '#song_form',
    template: `
    <form action="">
      <div class="text-title">
        新建歌曲
      </div>
      <div class="row-box">
        <label>
          <span class="name">歌 名</span>
          <input type="text" class="ipt" value="--key--">
        </label>
      </div>
      <div class="row-box">
        <label>
          <span class="name">歌 手</span>
          <input type="text" class="ipt" value="">
        </label>
      </div>
      <div class="row-box">
        <label>
          <span class="name">歌曲外链</span>
          <input type="text" class="ipt" value="--link--">
        </label>
      </div>
      <div class="row-box">
        <div class="btn-box">
          <button>确认</button>
        </div>
      </div>
    </form>
    `,
    render(data = {}){
      var placeholders = ['key','link'];
      var html = this.template;
      placeholders.map(item=>{
        html = html.replace(`--${item}--`,data[item] || '');
      })
      $(this.el).html(html);
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.view = view;
      this.model = model;
      this.view.render();
      window.eventHub.on('upload',data=>{
        console.log(data);
        this.view.render(data);
      })
    }
  }

  controller.init(view,model);
}