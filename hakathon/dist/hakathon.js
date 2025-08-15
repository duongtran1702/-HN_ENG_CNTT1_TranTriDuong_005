"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readlineSync = __importStar(require("readline-sync"));
let idPerson = 1;
let idBook = 1;
class Person {
    constructor(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
    getDetails() {
        console.log(`ID: ${this.id} - Name: ${this.name} - Email: ${this.email} - Phone: ${this.phone}`);
    }
}
class Book {
    constructor(bookId, title, price, amount, type, isAvailable = true) {
        this.bookId = bookId;
        this.title = title;
        this.price = price;
        this.amount = amount;
        this.type = type;
        this.isAvailable = isAvailable;
        if (this.amount === 0)
            this.isAvailable = false;
    }
    borrowBook() {
        this.amount -= 1;
        if (this.amount === 0)
            this.isAvailable = false;
    }
    returnBook() {
        this.amount += 1;
        if (this.isAvailable === false)
            this.isAvailable = true;
    }
    getDetails() {
        console.log(`ID: ${this.bookId} - Title: ${this.title} - Type: ${this.type} - Price: ${this.price}`);
    }
}
var TypeBook;
(function (TypeBook) {
    TypeBook["FictionBook"] = "fiction";
    TypeBook["ScienceBook"] = "science";
    TypeBook["HistoryBook"] = "history";
})(TypeBook || (TypeBook = {}));
class FictionBook extends Book {
    constructor(bookId, title, price, amount, type, isAvailable = true) {
        super(bookId, title, price, amount, type, isAvailable);
    }
    calculateLateFee(daysLate) {
        return 5000 * daysLate;
    }
}
class ScienceBook extends Book {
    constructor(bookId, title, price, amount, type, isAvailable = true) {
        super(bookId, title, price, amount, type, isAvailable);
    }
    calculateLateFee(daysLate) {
        return 10000 * daysLate;
    }
}
class HistoryBook extends Book {
    constructor(bookId, title, price, amount, type, isAvailable = true) {
        super(bookId, title, price, amount, type, isAvailable);
    }
    calculateLateFee(daysLate) {
        return 7000 * daysLate;
    }
}
class Borrowing {
    constructor(borrower, book, days, totalCost) {
        this.borrower = borrower;
        this.book = book;
        this.days = days;
        this.totalCost = totalCost;
        this.transactionId = Borrowing.nextId;
    }
    getDetails() {
        console.log(`ID: ${this.transactionId}\nBorrower:${this.borrower.getDetails()}\nBook: ${this.book.getDetails()}\nDays: ${this.days} days\nTotal cost: ${this.totalCost} VND`);
    }
}
Borrowing.nextId = 1;
class Repository {
    constructor() {
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    getAll() {
        return this.items;
    }
}
class LibraryManager {
    constructor() {
        this.booksRepo = new Repository();
        this.borrowersRepo = new Repository();
        this.borrowingRepo = new Repository();
    }
    addBook() {
        const title = readlineSync.question('Nhap ten sach: ');
        const price = readlineSync.questionInt('Nhap gia sach: ');
        const amount = readlineSync.questionInt('Nhap so luong sach: ');
        const option = readlineSync.question(`a. Fiction Book\b. Science Book\nc. History Book\nNhap lua chon:`);
        if (option === 'a') {
            this.booksRepo.items.push(new FictionBook(idBook++, title, price, amount, TypeBook.FictionBook));
        }
        else if (option === 'b') {
            this.booksRepo.items.push(new ScienceBook(idBook++, title, price, amount, TypeBook.ScienceBook));
        }
        else if (option === 'c') {
            this.booksRepo.items.push(new HistoryBook(idBook++, title, price, amount, TypeBook.HistoryBook));
        }
        else {
            console.log('Lua chon khong hop le!');
            return;
        }
    }
    addBorrower() {
        let newPerson;
        let id = idPerson++;
        const name = readlineSync.question('Nhap ten: ');
        const email = readlineSync.question('Nhap email: ');
        const phone = readlineSync.question('Nhap so dien thoai: ');
        newPerson = new Person(id, name, email, phone);
        this.borrowersRepo.items.push(newPerson);
        return newPerson;
    }
    borrowBook(bookId) {
        let brrowing;
        const book = this.booksRepo.items.find(e => e);
    }
}
