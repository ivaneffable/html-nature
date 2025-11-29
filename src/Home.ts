import { AbstractView } from "./AbstractView";

export class Home extends AbstractView {
  constructor() {
    super();
    this.setTitle("Home");
  }

  get templateId() {
    return "view-home";
  }
}
