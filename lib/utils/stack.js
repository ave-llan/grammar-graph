var clone = require('./clone.js')

/**
 * a Stack
 * @constructor
 */
function Stack () {
  var stack = []     // what will hold the stack

  /**
   * @returns {boolean} is the stack empty?
   */
  this.isEmpty = function () {
    return stack.length === 0
  }

  /**
   * @param item -- adds an item of any type to the top of the stack
   */
  this.push = function (item) {
    stack.push(item)
  }

  /**
   * removes and returns the top of the stack
   * @returns the top of the stack
   */
  this.pop = function () {
    return stack.pop()
  }

  /**
   * Returns a clone of this stack. A deep copy if the stack contains only primitive values.
   * @returns {Stack} a clone of this stack
   */
  this.clone = function () {
    var queue = clone(stack)
    var clonedStack = new Stack()
    queue.forEach(clonedStack.push)
    return clonedStack
  }

}

module.exports = Stack
