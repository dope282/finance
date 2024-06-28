//delgetstei ajillah Controller
var uiController = (function(){    
    
})();

//sanhuute ajillah Controller
var financeController = (function(){
    
})();

// programmiin holbogch
var appController = (function(uiController, financeController){
    var ctrlAddItem = function(){
        //1.oruulah ogogdliig delgetsees olj avna
        console.log("Enter...")
        //2.olj avsan ogogdloo sanhuugin controller luu damjuulj tend hadgalna

        //3.olj avsan ogogdloo web deeree tohiroh hesegt gargana

        //4.tosviig tootsoolno

        //5.etssiin uldegdel, tootsoog delgetsend hadgalna
    }    
    document.querySelector(".add__btn").addEventListener("click", function(){
        ctrlAddItem();
    })
    document.addEventListener("keypress", function(event){
        if(event.keyCode === 13 | event.which === 13) {
            ctrlAddItem();
        }
    })
})(uiController, financeController);
