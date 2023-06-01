module.exports = {

   // attachment div animation

  showDiv: function (e) {
    const attachmentContent = document.querySelector(".attachment-content");
    if (
      !attachmentContent.classList.contains("show") &&
      (attachmentContent.className === "attachment-content" ||
        attachmentContent.className === "attachment-content hide-animation")
    ) {
      attachmentContent.classList.remove("hide-animation");
      attachmentContent.classList.add("show");
    }
  },


  // attachment div animation

  removeDiv: function (e) {
    const attachmentContent = document.querySelector(".attachment-content");
    if (
      !attachmentContent.classList.contains("hide-animation") &&
      attachmentContent.className === "attachment-content show"
    ) {
      attachmentContent.classList.remove("show");
      attachmentContent.classList.add("hide-animation");
    }
  },

  toggleDiv: function (selector, showAnimation, hideAnimation) {
    const attachmentContent = document.querySelector(`.${selector}`);
    if (
      !attachmentContent.classList.contains(hideAnimation) &&
      attachmentContent.className === `${selector} ${showAnimation}`
    ) {
      attachmentContent.classList.remove(showAnimation);
      attachmentContent.classList.add(hideAnimation);
    }
    else {
      attachmentContent.classList.remove(hideAnimation);
      attachmentContent.classList.add(showAnimation);
    }
  },
};
