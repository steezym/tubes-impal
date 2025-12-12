function postIdGenerator() {
  return 'P' + Date.now().toString().slice(-6);
}

export default postIdGenerator;
