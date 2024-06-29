//delgetstei ajillah Controller
var uiController = (function(){
var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expense: ".budget__expenses--value",
    percentegeLabel: ".budget__expenses--percentage",
    containerDiv: ".container"
};

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc, exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        getDOMstrings: function(){
            return DOMstrings;
        },
        clearFields: function() {
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue );
        //convert list to array
        var fieldsArr = Array.prototype.slice.call(fields);
        // for(var i = 0; i < fieldsArr.length; i++){
        //     fieldsArr[i].value = "";
        // }
        fieldsArr.forEach(function(el, index, array){
            el.value = "";
        });

        fieldsArr[0].focus();
        },
        tusviigUzuuleh(tusuv) {
            document.querySelector(DOMstrings.tusuvLabel).textContent = tusuv.tusuv;
            document.querySelector(DOMstrings.incomeLabel).textContent = tusuv.totalInc;
            document.querySelector(DOMstrings.expense).textContent = tusuv.totalExp;
            if(tusuv.huvi !== 0){
            document.querySelector(DOMstrings.percentegeLabel).textContent = tusuv.huvi + "%";
        } else document.querySelector(DOMstrings.percentegeLabel).textContent = tusuv.huvi;
        },
        deleteListItem: function(id){
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },
        addListItem: function(item, type) {
            //orlogo zarlagiin elementiig aguulsan HTML-iig beltgene
            var html, list;
            if(type === 'inc') {
                list = DOMstrings.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">+ %VALUE%%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                list = DOMstrings.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">- %VALUE%%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //ter html dotrooo orlogo zarlagiin utguudiin REPLACE ashiglaj oorchilno
            html = html.replace("%id%", item.id);
            html = html.replace("%DESCRIPTION%", item.description);
            html = html.replace("%VALUE%%", item.value);
            //beltgesen HTML ee DOM ruu hiij ogno.
            document.querySelector(list).insertAdjacentHTML('beforeend', html)
        }
    };
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
    };
    var calculateTotal = function(type){
        var sum = 0;
        data.items[type].forEach(function(el){
            sum = sum + el.value;
        });
        data.totals[type] = sum;
    }
    var data = {
        items: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        tusuv: 0,
        huvi: 0
    };
    return {
        tusuvTootsooloh: function(){
            //niit orlogo zarlagiig tootsoolno
            calculateTotal('inc');
            calculateTotal('exp');
            //tusviig shineer toootsooolno
            data.tusuv = data.totals.inc-data.totals.exp;
            //orlogo zarlagiin huviig tootsoolno
            data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100)
        },
        tusviigAvah: function(){
            return {
                tusuv: data.tusuv,
                huvi: data.huvi,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },
        deleteItem: function(type, id){
            var ids = data.items[type].map(function(el){
                return el.id;
            });

            var index = ids.indexOf(id);

            if(index !== -1){
                data.items[type].splice(index, 1);
            }
        },
        addItem: function(type, desc, val) {

            var item, id;
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
            return item;
        }
    }
})();

// programmiin holbogch
var appController = (function(uiController, financeController){
    var ctrlAddItem = function(){
        //1.oruulah ogogdliig delgetsees olj avna
        var input = uiController.getInput();
        if(input.description !== "" && input.value !== ""){
            //2.olj avsan ogogdloo sanhuugin controller luu damjuulj tend hadgalna
            var item = financeController.addItem(input.type, input.description, input.value);
            //3.olj avsan ogogdloo web deeree tohiroh hesegt gargana
            uiController.addListItem(item, input.type);
            uiController.clearFields();
            //4.tosviig tootsoolno
            financeController.tusuvTootsooloh();
            //5.etssiin uldegdel, tootsoog delgetsend hadgalna
            var tusuv = financeController.tusviigAvah();
            uiController.tusviigUzuuleh(tusuv);
        }
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
        document.querySelector(DOM.containerDiv).addEventListener("click", function(event){
            var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
            if(id){
                var arr = id.split("-");
                var type = arr[0];
                var itemId = parseInt(arr [1]);
                //1. sanhuugiin modulias type, id ashiglaad ustgana.
                financeController.deleteItem(type, itemId);
                //2. delgets deereees ene elementiig ustgana.
                uiController.deleteListItem(id);
                //3. uldegdel tootsoog shinechilj haruulna.
            }
        })
    }

    return {
        init: function() {
            console.log("started...");
            uiController.tusviigUzuuleh({
                tusuv: 0,
                huvi: 0,
                totalInc: 0,
                totalExp: 0
            });
            setUpEventListeners();
        }
    }
})(uiController, financeController);

appController.init();
