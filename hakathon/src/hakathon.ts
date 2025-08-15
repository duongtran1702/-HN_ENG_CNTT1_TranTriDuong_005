import * as readlineSync from 'readline-sync';
let idPerson = 1;
let idBook = 1;

class Person {
    constructor(
        private id: number,
        private name: string,
        private email: string,
        private phone: string
    ) {}

    getId(): number {
        return this.id;
    }

    getDetails(): void {
        console.log(
            `ID: ${this.id} - Name: ${this.name} - Email: ${this.email} - Phone: ${this.phone}`
        );
    }
}

abstract class Book {
    constructor(
        private bookId: number,
        public title: string,
        public price: number,
        public amount: number,
        public type: string,
        public isAvailable: boolean = true
    ) {
        if (this.amount === 0) this.isAvailable = false;
    }
    getId(): number {
        return this.bookId;
    }

    borrowBook(): void {
        this.amount -= 1;
        if (this.amount === 0) this.isAvailable = false;
    }

    returnBook(): void {
        this.amount += 1;
        if (this.isAvailable === false) this.isAvailable = true;
    }

    getDetails(): void {
        console.log(
            `ID: ${this.bookId} - Title: ${this.title} - Type: ${this.type} - Price: ${this.price}`
        );
    }

    abstract calculateLateFee(daysLate: number): number;
}

enum TypeBook {
    FictionBook = 'fiction',
    ScienceBook = 'science',
    HistoryBook = 'history',
}

class FictionBook extends Book {
    constructor(
        bookId: number,
        title: string,
        price: number,
        amount: number,
        type: string,
        isAvailable: boolean = true
    ) {
        super(bookId, title, price, amount, type, isAvailable);
    }
    calculateLateFee(daysLate: number): number {
        return 5000 * daysLate;
    }
}

class ScienceBook extends Book {
    constructor(
        bookId: number,
        title: string,
        price: number,
        amount: number,
        type: string,
        isAvailable: boolean = true
    ) {
        super(bookId, title, price, amount, type, isAvailable);
    }
    calculateLateFee(daysLate: number): number {
        return 10000 * daysLate;
    }
}

class HistoryBook extends Book {
    constructor(
        bookId: number,
        title: string,
        price: number,
        amount: number,
        type: string,
        isAvailable: boolean = true
    ) {
        super(bookId, title, price, amount, type, isAvailable);
    }
    calculateLateFee(daysLate: number): number {
        return 7000 * daysLate;
    }
}

class Borrowing {
    private static nextId = 1;
    private transactionId: number;
    constructor(
        public borrower: Person,
        public book: Book,
        public days: number,
        public totalCost: number
    ) {
        this.transactionId = Borrowing.nextId;
    }
    getDetails(): void {
        console.log(
            `ID: ${
                this.transactionId
            }\nBorrower:${this.borrower.getDetails()}\nBook: ${this.book.getDetails()}\nDays: ${
                this.days
            } days\nTotal cost: ${this.totalCost} VND`
        );
    }
}

class Repository<T extends Record<string, any>> {
    public items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    getAll(): T[] {
        return this.items;
    }
}

class LibraryManager {
    public booksRepo = new Repository<Book>();
    public borrowersRepo = new Repository<Person>();
    public borrowingRepo = new Repository<Borrowing>();

    addBook(): void {
        const title = readlineSync.question('Nhap ten sach: ');
        const price = readlineSync.questionInt('Nhap gia sach: ');
        const amount = readlineSync.questionInt('Nhap so luong sach: ');

        const option = readlineSync.question(
            `a. Fiction Book\b. Science Book\nc. History Book\nNhap lua chon:`
        );

        if (option === 'a') {
            this.booksRepo.add(
                new FictionBook(
                    idBook++,
                    title,
                    price,
                    amount,
                    TypeBook.FictionBook
                )
            );
        } else if (option === 'b') {
            this.booksRepo.add(
                new ScienceBook(
                    idBook++,
                    title,
                    price,
                    amount,
                    TypeBook.ScienceBook
                )
            );
        } else if (option === 'c') {
            this.booksRepo.add(
                new HistoryBook(
                    idBook++,
                    title,
                    price,
                    amount,
                    TypeBook.HistoryBook
                )
            );
        } else {
            console.log('Lua chon khong hop le!');
            return;
        }
    }

    addBorrower(): Person {
        let newPerson: Person;
        let id = idPerson++;
        const name = readlineSync.question('Nhap ten: ');
        const email = readlineSync.question('Nhap email: ');
        const phone = readlineSync.question('Nhap so dien thoai: ');
        newPerson = new Person(id, name, email, phone);

        this.borrowersRepo.add(newPerson);
        return newPerson;
    }

    borrowBook(
        bookId: number,
        borrowerId: number,
        days: number
    ): Borrowing | null {
        let borrowing: Borrowing | null = null;
        const book = this.booksRepo.items.find((e) => e.getId() === bookId);
        const person = this.borrowersRepo.items.find(
            (e) => e.getId() === borrowerId
        );
        if (book && person) {
            borrowing = new Borrowing(person, book, days, book.price);
            book.borrowBook();
            this.borrowingRepo.add(borrowing);
        } else {
            console.log('Id sach hoac id nguoi muon khong ton tai');
            return null;
        }

        return borrowing;
    }

    returnBook(bookId: number): void {
        const book = this.booksRepo.items.find((e) => e.getId() === bookId);
        if (book) book.returnBook();
        else console.log('Id sach khong ton tai');
    }

    listAvailableBooks(): void {
        const listBooks = this.booksRepo.items.filter(
            (e) => e.isAvailable === true
        );
        listBooks.forEach((tmp) => tmp.getDetails());
    }

    listBorrowingByCustomer(customerId: number): void {
        const listBrrowers = this.borrowingRepo.items.filter(
            (e) => e.borrower.getId() === customerId
        );
        listBrrowers.forEach((tmp) => tmp.book.getDetails());
    }

    calculateTotalRevenue(): number {
        const revenue = this.borrowingRepo.items.reduce(
            (total, tmp) => total + tmp.totalCost,
            0
        );
        return revenue;
    }

    showAddBrrower(): void {
        this.borrowersRepo.items.forEach((person) => person.getDetails());
    }
    countBook() {
        let fiction = 0;
        let science = 0;
        let history = 0;

        for (const book of this.booksRepo.items) {
            if (book.type === TypeBook.FictionBook) fiction += 1;
            if (book.type === TypeBook.HistoryBook) history += 1;
            if (book.type === TypeBook.ScienceBook) science += 1;
        }
        console.log(`Book fiction: ${fiction}`);
        console.log(`Book science: ${science}`);
        console.log(`Book history: ${history}`);
    }
}

const menu = () => {
    console.log('1. Thêm người mượn');
    console.log('2. Thêm sách.');
    console.log('3. Cho mượn sách');
    console.log('4. Hiển thị toàn bộ người mượn	');
    console.log('5. Trả sách.');
    console.log('6. Hiển thị toàn bộ sách có thể mượn');
    console.log('7. Hiển thị toàn bộ sách của người mượn');
    console.log('8. Tính tổng doanh thu');
    console.log('9. Đếm số lượng sách theo  từng thể  loại sách');
    console.log('10. Thoát chương trình');
};
const manageLibrary = new LibraryManager();
let choice = -1;
do {
    menu();
    choice = readlineSync.questionInt('Nhập lựa chọn cua bạn: ');
    if (choice === 1) {
        manageLibrary.addBorrower();
    } else if (choice === 2) {
        manageLibrary.addBook();
    } else if (choice === 3) {
        const bookId = readlineSync.questionInt('Nhap id sach: ');
        const borrowerId = readlineSync.questionInt('Nhap id nguoi muon: ');
        const days = readlineSync.questionInt('Nhap so ngay muon: ');
        manageLibrary.borrowBook(bookId, borrowerId, days);
    } else if (choice === 4) {
        manageLibrary.showAddBrrower();
    } else if (choice === 5) {
        const bookId = readlineSync.questionInt('Nhap id sach de tra: ');
        manageLibrary.returnBook(bookId);
    } else if (choice === 6) {
        manageLibrary.listAvailableBooks();
    } else if (choice === 7) {
        const borrowerId = readlineSync.questionInt('Nhap id nguoi muon: ');
        manageLibrary.listBorrowingByCustomer(borrowerId);
    } else if (choice === 8) {
        const vevenue = manageLibrary.calculateTotalRevenue();
        console.log(`Tong doanh thu: ${vevenue} VND`);
    } else if (choice === 10) {
        console.log('Da thoat chuong trinh');
    } else if (choice === 9) {
        manageLibrary.countBook();
    }
} while (choice !== 10);
