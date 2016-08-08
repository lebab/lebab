import UtilInherits from './util-inherits';
import Prototypal from './prototypal';

export default class Inheritance {
  constructor(potentialClasses) {
    this.potentialClasses = potentialClasses;
    this.utilInherits = new UtilInherits(this);
    this.prototypal = new Prototypal(this);
  }

  process(node, parent) {
    return (
      this.utilInherits.process(node, parent) ||
      this.prototypal.process(node, parent)
    );
  }
}
