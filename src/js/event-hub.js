window.eventHub = {
  events: {},
  emit(eventName,data){
    let events = this.events;
    events[eventName].map(fn => {
      fn.call(null,data);
    })
  },
  on(eventName,fn){
    if(this.events[eventName] === undefined){
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }
}