module.exports = {
  scrollToBottom(messagesContainer) {
    let shouldScroll =
      messagesContainer.current.scrollTop +
        messagesContainer.current.clientHeight ===
      messagesContainer.current.scrollHeight;
    if (!shouldScroll) {
      messagesContainer.current.scrollTop =
        messagesContainer.current.scrollHeight;
    }
  },
};
