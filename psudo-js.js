class MovieOrder {
    constructor(name, deliv){
        this.movieName = name;
        if(deliv == "S"){
            this.moviePrice = 3.99;
        }
        else {
            this.moviePrice = 4.99;
        }
    }

    displayInfo() {
        document.write("Movie name: " + this.movieName + "<br>");
        document.write("Price: " + this.moviePrice);
    }
}

movieOrder = new MovieOrder("Emoji Movie", "S")
movieOrder2 = new MovieOrder("Name2", "S")
movieOrder.displayInfo()