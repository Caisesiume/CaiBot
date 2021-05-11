class Queue {
    constructor(){
        this.data = [];
        this.rear = 0;
        this.size = 1000;
    }

    enqueue(element) {
        if(this.rear < this.size ) {
            this.data[this.rear] = element;
            this.rear = this.rear + 1;
        }
    }

    length() {
        return this.rear;
    }

    isEmpty() {
        return this.rear === 0;
    }

    getFront() {
        if(this.isEmpty() === false) {
            return this.data[0];
        }
    }

    getLast() {
        if(this.isEmpty() === false) {

            return this.data[ this.rear - 1 ] ;
        }
    }

    dequeue() {
        if(this.isEmpty() === false) {
            this.rear = this.rear-1;
            return this.data.shift();
        }
    }

    getSize() {
        return this.size;
    }

    print() {
        for(let i =0; i < this.rear; i++) {
            console.log(this.data[i]);
        }
    }
}
module.exports.Queue = Queue;