export default class Timer {
  constructor(callback, durationSeconds) {
    this.callback = callback;
    this.duration = durationSeconds;
    this.startTime = null;
    this.interval = null;
  }

  start() {
    this.startTime = Date.now();

    this.interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);

      console.log("Timer:", elapsedSeconds, "detik");

      if (elapsedSeconds >= this.duration) {
        clearInterval(this.interval);
        this.callback();
      }

    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
  }
}
