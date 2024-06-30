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
    containerDiv: ".container",
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
};
var nodeListForEach = function(list, callback) {
    for(var i=0; i<list.length; i++){
        callback(list[i], i);
    }
};
var formatMoney = function(too) {
    too = "" + too;
    var x = too.split("").reverse().join("");
    var y = "";
    var count = 1;
    for(var i = 0; i < x.length; i++){
        y = y + x[i];
        if(count % 3 === 0) y = y + ",";
        count++;
    }
    var z = y.split("").reverse().join("");
    if(z[0] === ",") z = z.substr(1, z.length - 1);

    return z;
};

    return {

        displayDate: function() {
            var unuudur = new Date();
            document.querySelector(DOMstrings.dateLabel).textContent = unuudur.getFullYear() + " оны " + 
            unuudur.getMonth() + " сарын санхүү";
        },
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc, exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        displayPercentages: function(allPercentages){
            //zarlagiin nodeList-iig oloh 
            var elements = document.querySelectorAll(DOMstrings.expensePercentageLabel);
            //element bolgonii huvid zarlagiin massive aas avch shivj oruulah
            nodeListForEach(elements, function(el, index){
                el.textContent = allPercentages[index];
            })
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
            var type;
            if(tusuv.tusuv > 0) type = "inc";
            else type = "exp"
            document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(tusuv.tusuv, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(tusuv.totalInc, "inc");
            document.querySelector(DOMstrings.expense).textContent = formatMoney(tusuv.totalExp, "exp");
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
            html = html.replace("%VALUE%%", formatMoney(item.value, type));
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
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0)
            this.percentage = Math.round((this.value / totalIncome) * 100);
        else this.percentage = 0;
    };
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
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
            if(data.totals.inc>0){
                data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100)
            }else data.huvi = 0;
        },
        calculatePercentages: function(){
            data.items.exp.forEach(function(el){
                el.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function(){
            var allPercentages = data.items.exp.map(function(el){
                return el.getPercentage();
            });
            return allPercentages;
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
            //tusviig shineer tootsoolood delgetsend uzuulne
            updateTusuv();
        }
    };
    var updateTusuv = function() {
            //4.tosviig tootsoolno
            financeController.tusuvTootsooloh();
            //5.etssiin uldegdel, tootsoog delgetsend hadgalna
            var tusuv = financeController.tusviigAvah();
            uiController.tusviigUzuuleh(tusuv);
            //6.elementuudin huviig toootsooolno
            financeController.calculatePercentages();
            //7.elementuudin huviig huleeej avna
            var allPercentages = financeController.getPercentages();
            //8.edgeer huviig delgetsend gargana
            uiController.displayPercentages(allPercentages);
    };
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
                updateTusuv();
            }
        })
    }

    return {
        init: function() {
            console.log("started...");
            uiController.displayDate();
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
