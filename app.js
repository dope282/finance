//delgetstei ajillah Controller
var uiController = (function(){
var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn"
};

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc, exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    }
})();

//sanhuute ajillah Controller
var financeController = (function(){
    //private datas
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var data = {
        items: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    };
    return {
        addItem: function(type, desc, val) {

            var item, id = 1;
            if(data.items[type].length === 0) id = 1;
            else {
                id = data.items[type][data.items[type].length - 1].id + 1;
            }
            if(type==='inc'){
                item = new Income(id, desc, val)
            }
            else {
                item = new Expense(id, desc, val)
            }

            data.items[type].push(item);
        }
    }
})();

// programmiin holbogch
var appController = (function(uiController, financeController){
    var ctrlAddItem = function(){
        //1.oruulah ogogdliig delgetsees olj avna
        var input = uiController.getInput();
        //2.olj avsan ogogdloo sanhuugin controller luu damjuulj tend hadgalna
        financeController.addItem(input.type, input.description, input.type);
        //3.olj avsan ogogdloo web deeree tohiroh hesegt gargana
        //4.tosviig tootsoolno
        //5.etssiin uldegdel, tootsoog delgetsend hadgalna
    }
    var setUpEventListeners = function(){
        var DOM = uiController.getDOMstrings();
        document.querySelector(DOM.addBtn).addEventListener("click", function(){
            ctrlAddItem();
        });
        document.addEventListener("keypress", function(event){
            if(event.keyCode === 13 | event.which === 13) {
                ctrlAddItem();
            }
        });
    }

    return {
        init: function() {
            console.log("started...");
            setUpEventListeners();
        }
    }
})(uiController, financeController);

appController.init();
