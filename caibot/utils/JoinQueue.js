class Queue {
    constructor(){
        this.data = [];
        this.rear = 0;
        this.size = 1000;
    }

    // Adds an item at the last pos in the queue, if it's not  full.
    enqueue(element) {
        if(this.rear < this.size ) {
            this.data[this.rear] = element;
            this.rear = this.rear + 1;
        }
    }

    // Returns the index of the last element in the queue 
    length() {
        return this.rear;
    }

    // Returns a boolean. true = is empty
    isEmpty() {
        return this.rear === 0;
    }

    // Returns the first element in the queue
    getFront() {
        if(this.isEmpty() === false) {
            return this.data[0];
        }
    }

    // Returns the last element in the queue
    getLast() {
        if(this.isEmpty() === false) {

            return this.data[ this.rear - 1 ] ;
        }
    }

    // Removes the first element from the queue
    dequeue() {
        if(this.isEmpty() === false) {
            this.rear = this.rear-1;
            return this.data.shift();
        }
    }

    // Returns the size of the queue
    getSize() {
        return this.size;
    }

    // logs all elements currently in the queue
    print() {
        for(let i =0; i < this.rear; i++) {
            console.log(this.data[i]);
        }
    }
}
module.exports.Queue = Queue;