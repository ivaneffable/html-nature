export class AbstractView {
  setTitle(title: string) {
    document.title = title;
  }

  // Return the ID of the <template> tag to use
  get templateId() {
    return "";
  }

  // Runs any JS specific to this page
  async executeScript() {
    // Default: do nothing
  }

  async unmount() {
    // Default: do nothing
  }
}
