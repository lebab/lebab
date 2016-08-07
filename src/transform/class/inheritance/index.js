import UtilInherits from './util-inherits';

export default class Inheritance {
  constructor(potentialClasses) {
    this.potentialClasses = potentialClasses;
    this.utilInherits = new UtilInherits(this);
  }

  process(node, parent) {
    return (
      this.utilInherits.process(node, parent)
    );
  }
}
