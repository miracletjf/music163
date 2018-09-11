window.eventHub = {
  events: {},
  emit(eventName,data){
    if(this.events[eventName]){
      let events = this.events;
      events[eventName].map(fn => {
        fn.call(null,data);
      })
    }
  },
  on(eventName,fn){
    if(this.events[eventName] === undefined){
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }
}